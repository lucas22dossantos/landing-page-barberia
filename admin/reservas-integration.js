// ===== INTEGRACIÓN DEL SISTEMA DE RESERVAS CON EL FORMULARIO =====

// Esta función debe agregarse al script.js existente o reemplazar la función handleReserva

function handleReserva(event) {
  event.preventDefault();

  const formData = {
    nombre: document.getElementById('nombre').value,
    telefono: document.getElementById('telefono').value,
    email: document.getElementById('email')?.value || '',
    servicio: document.getElementById('servicio').value,
    fecha: document.getElementById('fecha').value,
    horario: document.getElementById('horario').value,
    comentarios: document.getElementById('comentarios').value
  };

  // Validar datos
  if (!formData.nombre || !formData.telefono || !formData.servicio || 
      !formData.fecha || !formData.horario) {
    alert('❌ Por favor completa todos los campos obligatorios');
    return;
  }

  // Crear reserva usando el sistema
  const resultado = SistemaReservas.crearReserva(formData);

  if (resultado.exito) {
    // Generar mensaje de WhatsApp
    const mensaje = SistemaReservas.generarMensajeWhatsApp(resultado.reserva);
    const urlWhatsApp = `https://wa.me/${CONFIG.whatsappNumber}?text=${mensaje}`;

    // Mostrar confirmación
    mostrarConfirmacionReserva(resultado.reserva, urlWhatsApp);
  } else {
    alert(`❌ Error: ${resultado.error}`);
  }
}

function mostrarConfirmacionReserva(reserva, urlWhatsApp) {
  const modal = document.getElementById('reservaModal');
  const modalContent = modal.querySelector('.modal__content');

  // Guardar contenido original
  const contenidoOriginal = modalContent.innerHTML;

  // Mostrar confirmación
  modalContent.innerHTML = `
    <button class="modal__close" onclick="closeReservaModal()">
      <i class="fas fa-times"></i>
    </button>
    
    <div class="modal__header">
      <i class="fas fa-check-circle" style="color: #30d158;"></i>
      <h2>¡Reserva Creada!</h2>
      <p>Tu reserva ha sido registrada exitosamente</p>
    </div>

    <div style="background: rgba(26, 26, 26, 0.5); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
      <h3 style="color: #d4af37; margin-bottom: 1rem;">Detalles de tu Reserva</h3>
      
      <div style="display: grid; gap: 0.75rem;">
        <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid #333;">
          <span style="color: #9a9a9a;">ID de Reserva:</span>
          <strong style="color: #e5e5e5;">${reserva.id}</strong>
        </div>
        
        <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid #333;">
          <span style="color: #9a9a9a;">📅 Fecha:</span>
          <strong style="color: #e5e5e5;">${formatearFechaReserva(reserva.fecha)}</strong>
        </div>
        
        <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid #333;">
          <span style="color: #9a9a9a;">🕐 Horario:</span>
          <strong style="color: #e5e5e5;">${reserva.horario}</strong>
        </div>
        
        <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid #333;">
          <span style="color: #9a9a9a;">✂️ Servicio:</span>
          <strong style="color: #e5e5e5;">${reserva.servicio}</strong>
        </div>
        
        <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid #333;">
          <span style="color: #9a9a9a;">⏱️ Duración:</span>
          <strong style="color: #e5e5e5;">${reserva.duracion} minutos</strong>
        </div>
        
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #9a9a9a;">📊 Estado:</span>
          <span style="background: rgba(255, 159, 10, 0.2); color: #ff9f0a; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; font-weight: 600;">
            Pendiente de Confirmación
          </span>
        </div>
      </div>
    </div>

    <div style="background: rgba(48, 209, 88, 0.1); border: 1px solid rgba(48, 209, 88, 0.3); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
      <p style="color: #30d158; font-size: 0.875rem; margin: 0;">
        <i class="fas fa-info-circle"></i> 
        <strong>Próximo paso:</strong> Confirma tu reserva enviando un mensaje por WhatsApp. 
        Te responderemos lo antes posible.
      </p>
    </div>

    <a href="${urlWhatsApp}" target="_blank" class="btn btn--submit" style="text-decoration: none; display: block; text-align: center;">
      <i class="fab fa-whatsapp"></i>
      <span>Confirmar por WhatsApp</span>
    </a>

    <button class="btn btn--secondary" onclick="cerrarYReiniciar()" style="margin-top: 1rem; width: 100%; background: transparent; border: 1px solid #d4af37; color: #d4af37;">
      <i class="fas fa-times"></i> Cerrar
    </button>

    <p style="margin-top: 1.5rem; text-align: center; font-size: 0.875rem; color: #9a9a9a;">
      💡 <strong>Consejo:</strong> Guarda el ID de tu reserva para futuras consultas
    </p>
  `;

  // Función para cerrar y reiniciar
  window.cerrarYReiniciar = function() {
    modalContent.innerHTML = contenidoOriginal;
    closeReservaModal();
    document.getElementById('reservaForm').reset();
    
    // Re-attach event listener
    document.getElementById('reservaForm').onsubmit = handleReserva;
  };
}

function formatearFechaReserva(fecha) {
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Actualizar selectService para pre-seleccionar servicio
function selectService(servicio) {
  openReservaModal();
  document.getElementById('servicio').value = servicio;
  
  // Trigger change para actualizar horarios si hay fecha seleccionada
  const fecha = document.getElementById('fecha').value;
  if (fecha) {
    actualizarHorariosDisponibles();
  }
}

// Actualizar horarios disponibles cuando cambia fecha o servicio
function actualizarHorariosDisponibles() {
  const fecha = document.getElementById('fecha').value;
  const servicio = document.getElementById('servicio').value;
  const horarioSelect = document.getElementById('horario');

  if (!fecha || !servicio) {
    horarioSelect.innerHTML = '<option value="">Seleccionar horario</option>';
    return;
  }

  // Obtener horarios disponibles del sistema
  const horariosDisponibles = SistemaReservas.obtenerHorariosDisponibles(fecha, servicio);

  if (horariosDisponibles.length === 0) {
    horarioSelect.innerHTML = '<option value="">No hay horarios disponibles</option>';
    return;
  }

  horarioSelect.innerHTML = '<option value="">Seleccionar horario</option>' +
    horariosDisponibles.map(h => `<option value="${h}">${h}</option>`).join('');
}

// Event listeners para el formulario
document.addEventListener('DOMContentLoaded', () => {
  const fechaInput = document.getElementById('fecha');
  const servicioSelect = document.getElementById('servicio');

  if (fechaInput && servicioSelect) {
    // Configurar fecha mínima (hoy) y máxima (30 días adelante)
    const hoy = new Date();
    const maxFecha = new Date();
    maxFecha.setDate(maxFecha.getDate() + 30);

    fechaInput.min = hoy.toISOString().split('T')[0];
    fechaInput.max = maxFecha.toISOString().split('T')[0];

    // Actualizar horarios cuando cambia fecha o servicio
    fechaInput.addEventListener('change', actualizarHorariosDisponibles);
    servicioSelect.addEventListener('change', actualizarHorariosDisponibles);
  }
});

// ===== PANEL DE CLIENTE - Ver sus reservas =====
function abrirMisReservas() {
  const telefono = prompt('Ingresa tu número de teléfono para ver tus reservas:');
  
  if (!telefono) return;

  const reservas = SistemaReservas.obtenerReservasCliente(telefono);

  if (reservas.length === 0) {
    alert('No se encontraron reservas con ese número de teléfono');
    return;
  }

  // Mostrar reservas en un modal o ventana
  mostrarReservasCliente(reservas, telefono);
}

function mostrarReservasCliente(reservas, telefono) {
  const modal = document.getElementById('reservaModal') || crearModalGenerico();
  const modalContent = modal.querySelector('.modal__content');

  const reservasActivas = reservas.filter(r => 
    r.estado !== 'completada' && r.estado !== 'cancelada'
  );

  const reservasPasadas = reservas.filter(r => 
    r.estado === 'completada' || r.estado === 'cancelada'
  );

  modalContent.innerHTML = `
    <button class="modal__close" onclick="closeReservaModal()">
      <i class="fas fa-times"></i>
    </button>
    
    <div class="modal__header">
      <i class="fas fa-calendar-alt"></i>
      <h2>Mis Reservas</h2>
      <p>Teléfono: ${telefono}</p>
    </div>

    <div style="max-height: 500px; overflow-y: auto; padding: 1rem;">
      ${reservasActivas.length > 0 ? `
        <h3 style="color: #d4af37; margin-bottom: 1rem;">Próximas Reservas</h3>
        ${reservasActivas.map(r => renderReservaCliente(r, telefono)).join('')}
      ` : ''}

      ${reservasPasadas.length > 0 ? `
        <h3 style="color: #9a9a9a; margin: 2rem 0 1rem;">Historial</h3>
        ${reservasPasadas.map(r => renderReservaCliente(r, telefono, true)).join('')}
      ` : ''}
    </div>
  `;

  openReservaModal();
}

function renderReservaCliente(reserva, telefono, pasada = false) {
  const estadoColors = {
    'pendiente': { bg: 'rgba(255, 159, 10, 0.1)', color: '#ff9f0a', text: 'Pendiente' },
    'confirmada': { bg: 'rgba(48, 209, 88, 0.1)', color: '#30d158', text: 'Confirmada' },
    'cancelada': { bg: 'rgba(255, 69, 58, 0.1)', color: '#ff453a', text: 'Cancelada' },
    'completada': { bg: 'rgba(100, 210, 255, 0.1)', color: '#64d2ff', text: 'Completada' }
  };

  const estado = estadoColors[reserva.estado] || estadoColors.pendiente;
  const puedeModificar = reserva.estado === 'pendiente' || reserva.estado === 'confirmada';

  return `
    <div style="background: ${pasada ? '#0a0a0a' : 'rgba(26, 26, 26, 0.5)'}; border: 1px solid ${pasada ? '#222' : 'rgba(212, 175, 55, 0.2)'}; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
        <div>
          <h4 style="color: #e5e5e5; margin-bottom: 0.5rem;">${reserva.servicio}</h4>
          <p style="color: #9a9a9a; font-size: 0.875rem;">ID: ${reserva.id}</p>
        </div>
        <span style="background: ${estado.bg}; color: ${estado.color}; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
          ${estado.text}
        </span>
      </div>

      <div style="display: grid; gap: 0.5rem; margin-bottom: 1rem;">
        <div style="display: flex; gap: 0.5rem; color: #e5e5e5;">
          <i class="fas fa-calendar" style="color: #d4af37; width: 20px;"></i>
          <span>${formatearFechaReserva(reserva.fecha)}</span>
        </div>
        <div style="display: flex; gap: 0.5rem; color: #e5e5e5;">
          <i class="fas fa-clock" style="color: #d4af37; width: 20px;"></i>
          <span>${reserva.horario} (${reserva.duracion} min)</span>
        </div>
      </div>

      ${puedeModificar && !pasada ? `
        <div style="display: flex; gap: 0.5rem;">
          <button onclick="cancelarReservaCliente('${reserva.id}', '${telefono}')" 
                  style="flex: 1; padding: 0.5rem; background: transparent; border: 1px solid #ff453a; color: #ff453a; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
            <i class="fas fa-times"></i> Cancelar
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

function cancelarReservaCliente(reservaId, telefono) {
  const motivo = prompt('¿Por qué deseas cancelar? (opcional)');
  
  if (motivo === null) return; // Usuario canceló el prompt

  const resultado = SistemaReservas.cancelarReserva(reservaId, telefono, motivo || 'Sin motivo especificado');

  if (resultado.exito) {
    alert('✅ Reserva cancelada exitosamente');
    abrirMisReservas(); // Recargar lista
  } else {
    alert(`❌ ${resultado.error}`);
  }
}

function crearModalGenerico() {
  // Si no existe modal, crear uno genérico
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'modalGenerico';
  modal.innerHTML = `
    <div class="modal__overlay" onclick="this.parentElement.style.display='none'"></div>
    <div class="modal__content"></div>
  `;
  document.body.appendChild(modal);
  return modal;
}

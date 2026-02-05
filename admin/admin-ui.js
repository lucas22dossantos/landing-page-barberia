// ===== ADMIN UI - Interfaz de Administración (API UNIFICADA) =====

const AdminUI = {
  tabActual: 'hoy',

  init() {
    this.setupEventListeners();
    this.actualizarFechaActual();
    this.configurarFechasFiltro();
    this.initNotifications();
  },

  setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.login();
    });
    setInterval(() => this.actualizarFechaActual(), 60000);
  },

  actualizarFechaActual() {
    const ahora = new Date();
    const opciones = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    document.getElementById('currentDate').textContent = ahora.toLocaleDateString('es-AR', opciones);
  },

  configurarFechasFiltro() {
    const hoy = new Date().toISOString().split('T')[0];
    const treintaDias = new Date();
    treintaDias.setDate(treintaDias.getDate() + 30);
    document.getElementById('filtroFechaInicio').value = hoy;
    document.getElementById('filtroFechaFin').value = treintaDias.toISOString().split('T')[0];
  },

  login() {
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    if (SistemaReservas.autenticarAdmin(password)) {
      document.getElementById('loginContainer').style.display = 'none';
      document.getElementById('dashboard').classList.add('active');
      this.cargarDashboard();
    } else {
      errorDiv.textContent = '❌ Contraseña incorrecta';
      errorDiv.classList.add('show');
      setTimeout(() => errorDiv.classList.remove('show'), 3000);
    }
  },

  cargarDashboard() {
    this.cargarEstadisticas();
    this.cargarAgendaHoy();
    this.cargarTodasReservas();
    this.cargarReservasPendientes();
    console.log("Dashboard cargado");
  },

  cargarEstadisticas() {
    const stats = SistemaReservas.obtenerEstadisticas();
    document.getElementById('statHoy').textContent = stats.reservasHoy || 0;
    document.getElementById('statTotal').textContent = stats.totalReservas || 0;
    document.getElementById('statClientes').textContent = stats.totalClientes || 0;
    document.getElementById('statConfirmadas').textContent = stats.reservasConfirmadas || 0;
    this.mostrarEstadisticasDetalladas(stats);
  },

  mostrarEstadisticasDetalladas(stats) {
    const container = document.getElementById('statsDetalladas');
    const servicios = stats.serviciosMasReservados || {};
    const serviciosHTML = Object.entries(servicios)
      .sort((a, b) => b[1] - a[1])
      .map(([servicio, cantidad]) => `
        <div class="stat-card">
          <div class="stat-card-header">
            <div>
              <div class="stat-card-value">${cantidad}</div>
              <div class="stat-card-label">${servicio}</div>
            </div>
            <div class="stat-card-icon"><i class="fas fa-cut"></i></div>
          </div>
        </div>
      `).join('');

    container.innerHTML = `
      <div class="stat-card">
        <div class="stat-card-header">
          <div>
            <div class="stat-card-value">${stats.reservasCanceladas || 0}</div>
            <div class="stat-card-label">Canceladas</div>
          </div>
          <div class="stat-card-icon"><i class="fas fa-times-circle"></i></div>
        </div>
      </div>
      ${serviciosHTML}
    `;
  },

  cargarAgendaHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    const reservas = SistemaReservas.obtenerReservas({ fecha: hoy });
    this.renderizarTabla('agendaHoy', reservas, 'No hay reservas para hoy');
  },

  cargarTodasReservas() {
    const reservas = SistemaReservas.obtenerReservas();
    this.renderizarTabla('todasReservas', reservas, 'No se encontraron reservas');
  },

  cargarReservasPendientes() {
    const reservas = SistemaReservas.obtenerReservas({ estado: 'pendiente' });
    this.renderizarTabla('reservasPendientes', reservas, 'No hay reservas pendientes');
  },

  renderizarTabla(containerId, reservas, emptyMsg) {
    const container = document.getElementById(containerId);
    if (!reservas || reservas.length === 0) {
      container.innerHTML = `<div class="empty-state"><i class="fas fa-calendar"></i><p>${emptyMsg}</p></div>`;
      return;
    }

    reservas.sort((a, b) => {
      if (a.fecha !== b.fecha) return new Date(b.fecha) - new Date(a.fecha);
      return b.horario.localeCompare(a.horario);
    });

    container.innerHTML = `
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Barbero</th>
              <th>Servicio</th>
              <th>Nota</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${reservas.map(r => this.renderReservaRow(r)).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderReservaRow(r) {
    const fechaFmt = new Date(r.fecha + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
    const badgeClass = `badge badge-${r.estado}`;
    const acciones = this.renderAcciones(r);

    return `
      <tr>
        <td>${fechaFmt}</td>
        <td><strong>${r.horario}</strong></td>
        <td>
          <div class="client-info">
            <span class="client-name">${r.nombre}</span>
            <span class="client-phone">${r.telefono}</span>
          </div>
        </td>
        <td><span class="badge badge-confirmada">${r.barbero || 'N/A'}</span></td>
        <td>${r.servicio}</td>
        <td>
          <div class="client-note">${r.comentarios || '<span style="color: #444; font-style: normal;">-</span>'}</div>
        </td>
        <td><span class="${badgeClass}">${r.estado}</span></td>
        <td><div class="action-buttons">${acciones}</div></td>
      </tr>
    `;
  },

  renderAcciones(r) {
    if (r.estado === 'pendiente') {
      return `
        <button class="btn-icon btn-icon-check" title="Confirmar" onclick="AdminUI.cambiarEstado('${r.id}', 'confirmada')"><i class="fas fa-check"></i></button>
        <button class="btn-icon btn-icon-times" title="Cancelar" onclick="AdminUI.cambiarEstado('${r.id}', 'cancelada')"><i class="fas fa-times"></i></button>
      `;
    }
    if (r.estado === 'confirmada') {
      return `
        <button class="btn-icon btn-icon-check" title="Completar" onclick="AdminUI.cambiarEstado('${r.id}', 'completada')"><i class="fas fa-check-double"></i></button>
        <button class="btn-icon btn-icon-times" title="Cancelar" onclick="AdminUI.cambiarEstado('${r.id}', 'cancelada')"><i class="fas fa-times"></i></button>
        <button class="btn-icon" style="background: rgba(37, 211, 102, 0.1); color: #25d366;" title="Enviar Confirmación WhatsApp" onclick="AdminUI.enviarConfirmacionWhatsApp('${r.id}')"><i class="fab fa-whatsapp"></i></button>
      `;
    }
    return '<small style="color: #444;">Finalizada</small>';
  },

  cambiarEstado(id, nuevoEstado) {
    if (confirm(`¿Cambiar estado a ${nuevoEstado}?`)) {
      SistemaReservas.actualizarEstado(id, nuevoEstado);
      this.cargarDashboard();

      // Automatización: Notificar al cliente al confirmar
      if (nuevoEstado === 'confirmada') {
        setTimeout(() => {
          if (confirm('✅ Reserva confirmada. ¿Deseas enviar la notificación oficial por WhatsApp al cliente ahora?')) {
            this.enviarConfirmacionWhatsApp(id);
          }
        }, 300);
      }
    }
  },

  cambiarTab(tab) {
    // UI Updates
    document.querySelectorAll('.nav-item').forEach(t => t.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');

    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const tabMap = {
      'hoy': { id: 'tabHoy', title: 'Agenda de Hoy' },
      'todas': { id: 'tabTodas', title: 'Todas las Reservas' },
      'pendientes': { id: 'tabPendientes', title: 'Solicitudes Pendientes' },
      'estadisticas': { id: 'tabEstadisticas', title: 'Reportes y Estadísticas' }
    };

    const target = tabMap[tab];
    document.getElementById(target.id).classList.add('active');
    document.getElementById('activeTabTitle').textContent = target.title;

    // Load data
    if (tab === 'hoy') this.cargarAgendaHoy();
    if (tab === 'todas') this.cargarTodasReservas();
    if (tab === 'pendientes') this.cargarReservasPendientes();
  },

  aplicarFiltros() {
    const fechaInicio = document.getElementById('filtroFechaInicio').value;
    const fechaFin = document.getElementById('filtroFechaFin').value;
    const estado = document.getElementById('filtroEstado').value;

    const reservas = SistemaReservas.obtenerReservas();
    const filtradas = reservas.filter(r => {
      const matchEstado = !estado || r.estado === estado;
      const matchFecha = (!fechaInicio || r.fecha >= fechaInicio) &&
        (!fechaFin || r.fecha <= fechaFin);
      return matchEstado && matchFecha;
    });

    this.renderizarTabla('todasReservas', filtradas, 'No se encontraron reservas con esos filtros');

    // Feedback visual
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'FILTRADO ✅';
    setTimeout(() => btn.textContent = originalText, 2000);
  },

  cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
      document.getElementById('dashboard').classList.remove('active');
      document.getElementById('loginContainer').style.display = 'flex';
      document.getElementById('password').value = '';
    }
  },

  initNotifications() {
    // Escuchar cambios en localStorage (para detectar reservas nuevas desde la web pública)
    window.addEventListener('storage', (e) => {
      if (e.key === 'barberia_reservas') {
        const newData = JSON.parse(e.newValue);
        const oldData = JSON.parse(e.oldValue);

        // Si hay más reservas que antes, notificar
        if (newData.reservas.length > oldData.reservas.length) {
          const nuevaReserva = newData.reservas[newData.reservas.length - 1];
          this.mostrarNotificacionNuevaReserva(nuevaReserva);
          this.cargarDashboard(); // Recargar datos
        }
      }
    });

    // Pedir permiso para notificaciones si el usuario interactúa (opcional)
    document.addEventListener('click', () => {
      const audio = document.getElementById('notificationSound');
      if (audio) audio.load(); // Preparar audio
    }, { once: true });
  },

  mostrarNotificacionNuevaReserva(reserva) {
    // Sonido
    const audio = document.getElementById('notificationSound');
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log("Audio play blocked by browser"));
    }

    // Visual Alert (Toast)
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fas fa-bell"></i>
      <div class="toast-content">
        <div class="toast-title">NUEVA RESERVA</div>
        <div class="toast-msg"><strong>${reserva.nombre}</strong> - ${reserva.servicio} (${reserva.horario})</div>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.5s forwards';
      setTimeout(() => toast.remove(), 500);
    }, 5000);
  },

  enviarConfirmacionWhatsApp(id) {
    const reserva = SistemaReservas.obtenerReservas().find(r => r.id === id);
    if (!reserva) return;

    const mensaje = SistemaReservas.generarMensajeConfirmacionCliente(reserva);
    const url = `https://wa.me/${reserva.telefono.replace(/\D/g, '')}?text=${mensaje}`;
    window.open(url, '_blank');
  }
};

document.addEventListener('DOMContentLoaded', () => AdminUI.init());

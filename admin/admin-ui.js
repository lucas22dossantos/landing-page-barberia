// ===== ADMIN UI - Interfaz de Administración =====

const AdminUI = {
  tabActual: 'hoy',
  
  init() {
    this.setupEventListeners();
    this.actualizarFechaActual();
    this.configurarFechasFiltro();
  },

  setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.login();
    });

    // Actualizar cada minuto
    setInterval(() => this.actualizarFechaActual(), 60000);
  },

  actualizarFechaActual() {
    const ahora = new Date();
    const opciones = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    document.getElementById('currentDate').textContent = 
      ahora.toLocaleDateString('es-AR', opciones);
  },

  configurarFechasFiltro() {
    const hoy = new Date().toISOString().split('T')[0];
    const treintaDias = new Date();
    treintaDias.setDate(treintaDias.getDate() + 30);
    
    document.getElementById('filtroFechaInicio').value = hoy;
    document.getElementById('filtroFechaFin').value = treintaDias.toISOString().split('T')[0];
  },

  // ===== LOGIN =====
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

  cerrarSesion() {
    if (confirm('¿Seguro que quieres cerrar sesión?')) {
      location.reload();
    }
  },

  // ===== DASHBOARD =====
  cargarDashboard() {
    this.cargarEstadisticas();
    this.cargarAgendaHoy();
    this.cargarTodasReservas();
    this.cargarReservasPendientes();
  },

  cargarEstadisticas() {
    const stats = SistemaReservas.admin.obtenerEstadisticas();
    
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
            <div class="stat-card-icon">
              <i class="fas fa-cut"></i>
            </div>
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
          <div class="stat-card-icon">
            <i class="fas fa-times-circle"></i>
          </div>
        </div>
      </div>
      ${serviciosHTML}
    `;
  },

  // ===== AGENDA HOY =====
  cargarAgendaHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    const reservas = SistemaReservas.admin.obtenerAgendaDia(hoy);
    
    const container = document.getElementById('agendaHoy');
    
    if (!reservas || reservas.length === 0) {
      container.innerHTML = this.emptyState('calendar-times', 'No hay reservas para hoy');
      return;
    }

    container.innerHTML = `
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Duración</th>
              <th>Teléfono</th>
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

  // ===== TODAS LAS RESERVAS =====
  cargarTodasReservas() {
    const reservas = SistemaReservas.admin.obtenerTodasReservas();
    this.mostrarReservas('todasReservas', reservas);
  },

  aplicarFiltros() {
    const fechaInicio = document.getElementById('filtroFechaInicio').value;
    const fechaFin = document.getElementById('filtroFechaFin').value;
    const estado = document.getElementById('filtroEstado').value;
    
    let reservas = SistemaReservas.admin.obtenerReservasPorRango(fechaInicio, fechaFin);
    
    if (estado) {
      reservas = reservas.filter(r => r.estado === estado);
    }
    
    this.mostrarReservas('todasReservas', reservas);
  },

  // ===== RESERVAS PENDIENTES =====
  cargarReservasPendientes() {
    const reservas = SistemaReservas.admin.obtenerTodasReservas({ estado: 'pendiente' });
    this.mostrarReservas('reservasPendientes', reservas);
  },

  // ===== RENDER =====
  mostrarReservas(containerId, reservas) {
    const container = document.getElementById(containerId);
    
    if (!reservas || reservas.length === 0) {
      container.innerHTML = this.emptyState('calendar', 'No se encontraron reservas');
      return;
    }

    // Ordenar por fecha y hora
    reservas.sort((a, b) => {
      if (a.fecha !== b.fecha) {
        return new Date(b.fecha) - new Date(a.fecha);
      }
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
              <th>Servicio</th>
              <th>Teléfono</th>
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

  renderReservaRow(reserva) {
    const estadoBadge = this.getEstadoBadge(reserva.estado);
    const acciones = this.getAcciones(reserva);
    const fechaFormateada = new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    return `
      <tr>
        <td>${fechaFormateada}</td>
        <td><strong>${reserva.horario}</strong></td>
        <td>
          ${reserva.nombreCliente}
          ${reserva.comentarios ? `<br><small style="color: #9a9a9a;">${reserva.comentarios}</small>` : ''}
        </td>
        <td>${reserva.servicio}</td>
        <td>
          <a href="tel:${reserva.telefono}" style="color: #d4af37;">
            ${reserva.telefono}
          </a>
        </td>
        <td>${estadoBadge}</td>
        <td>
          <div class="action-buttons">
            ${acciones}
          </div>
        </td>
      </tr>
    `;
  },

  getEstadoBadge(estado) {
    const badges = {
      'pendiente': '<span class="badge badge-pendiente">Pendiente</span>',
      'confirmada': '<span class="badge badge-confirmada">Confirmada</span>',
      'cancelada': '<span class="badge badge-cancelada">Cancelada</span>',
      'completada': '<span class="badge badge-completada">Completada</span>',
      'bloqueado': '<span class="badge badge-cancelada">Bloqueado</span>'
    };
    return badges[estado] || estado;
  },

  getAcciones(reserva) {
    let acciones = [];

    if (reserva.estado === 'pendiente') {
      acciones.push(`
        <button class="btn-small btn-confirm" onclick="AdminUI.confirmarReserva('${reserva.id}')">
          <i class="fas fa-check"></i> Confirmar
        </button>
      `);
      acciones.push(`
        <button class="btn-small btn-cancel" onclick="AdminUI.cancelarReserva('${reserva.id}')">
          <i class="fas fa-times"></i> Cancelar
        </button>
      `);
    }

    if (reserva.estado === 'confirmada') {
      acciones.push(`
        <button class="btn-small btn-complete" onclick="AdminUI.completarReserva('${reserva.id}')">
          <i class="fas fa-check-double"></i> Completar
        </button>
      `);
      acciones.push(`
        <button class="btn-small btn-cancel" onclick="AdminUI.cancelarReserva('${reserva.id}')">
          <i class="fas fa-times"></i> Cancelar
        </button>
      `);
    }

    if (acciones.length === 0) {
      acciones.push(`<small style="color: #9a9a9a;">Sin acciones</small>`);
    }

    return acciones.join('');
  },

  // ===== ACCIONES =====
  confirmarReserva(id) {
    if (confirm('¿Confirmar esta reserva?')) {
      SistemaReservas.admin.confirmarReserva(id);
      this.cargarDashboard();
      this.mostrarNotificacion('Reserva confirmada', 'success');
    }
  },

  cancelarReserva(id) {
    const motivo = prompt('Motivo de cancelación (opcional):');
    if (motivo !== null) {
      SistemaReservas.admin.cancelarReserva(id, motivo || 'Cancelado por administrador');
      this.cargarDashboard();
      this.mostrarNotificacion('Reserva cancelada', 'error');
    }
  },

  completarReserva(id) {
    if (confirm('¿Marcar como completada?')) {
      SistemaReservas.admin.completarReserva(id);
      this.cargarDashboard();
      this.mostrarNotificacion('Reserva completada', 'success');
    }
  },

  // ===== TABS =====
  cambiarTab(tab) {
    // Actualizar botones
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.closest('.tab').classList.add('active');

    // Actualizar contenido
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    const tabMap = {
      'hoy': 'tabHoy',
      'todas': 'tabTodas',
      'pendientes': 'tabPendientes',
      'estadisticas': 'tabEstadisticas'
    };
    
    document.getElementById(tabMap[tab]).classList.add('active');
    this.tabActual = tab;

    // Recargar datos según tab
    if (tab === 'hoy') this.cargarAgendaHoy();
    if (tab === 'todas') this.cargarTodasReservas();
    if (tab === 'pendientes') this.cargarReservasPendientes();
  },

  // ===== UTILIDADES =====
  emptyState(icon, mensaje) {
    return `
      <div class="empty-state">
        <i class="fas fa-${icon}"></i>
        <p>${mensaje}</p>
      </div>
    `;
  },

  mostrarNotificacion(mensaje, tipo) {
    // Simple alert por ahora, puedes mejorar con un sistema de notificaciones
    const emojis = {
      'success': '✅',
      'error': '❌',
      'info': 'ℹ️'
    };
    alert(`${emojis[tipo] || ''} ${mensaje}`);
  }
};

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
  AdminUI.init();
});

// ===== ADMIN UI - Interfaz de Administración (API UNIFICADA) =====

const AdminUI = {
  tabActual: 'hoy',

  init() {
    this.setupEventListeners();
    this.actualizarFechaActual();
    this.configurarFechasFiltro();
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
        <td>${r.nombreCliente}<br><small>${r.telefono}</small></td>
        <td><span class="badge badge-confirmada">${r.barbero || 'N/A'}</span></td>
        <td>${r.servicio}</td>
        <td><span class="${badgeClass}">${r.estado}</span></td>
        <td><div class="action-buttons">${acciones}</div></td>
      </tr>
    `;
  },

  renderAcciones(r) {
    if (r.estado === 'pendiente') {
      return `
        <button class="btn-small btn-confirm" onclick="AdminUI.cambiarEstado('${r.id}', 'confirmada')"><i class="fas fa-check"></i></button>
        <button class="btn-small btn-cancel" onclick="AdminUI.cambiarEstado('${r.id}', 'cancelada')"><i class="fas fa-times"></i></button>
      `;
    }
    if (r.estado === 'confirmada') {
      return `
        <button class="btn-small btn-complete" onclick="AdminUI.cambiarEstado('${r.id}', 'completada')"><i class="fas fa-check-double"></i></button>
        <button class="btn-small btn-cancel" onclick="AdminUI.cambiarEstado('${r.id}', 'cancelada')"><i class="fas fa-times"></i></button>
      `;
    }
    return '<small>Sin acciones</small>';
  },

  cambiarEstado(id, nuevoEstado) {
    if (confirm(`¿Cambiar estado a ${nuevoEstado}?`)) {
      SistemaReservas.actualizarEstado(id, nuevoEstado);
      this.cargarDashboard();
    }
  },

  cambiarTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.closest('.tab').classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const tabMap = { 'hoy': 'tabHoy', 'todas': 'tabTodas', 'pendientes': 'tabPendientes', 'estadisticas': 'tabEstadisticas' };
    document.getElementById(tabMap[tab]).classList.add('active');

    if (tab === 'hoy') this.cargarAgendaHoy();
    if (tab === 'todas') this.cargarTodasReservas();
    if (tab === 'pendientes') this.cargarReservasPendientes();
  }
};

document.addEventListener('DOMContentLoaded', () => AdminUI.init());

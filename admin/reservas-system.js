// ===== SISTEMA DE RESERVAS - BARBERÍA PREMIUM =====
// Simula una base de datos usando localStorage como JSON

// ===== CONFIGURACIÓN =====
const RESERVAS_CONFIG = {
  whatsappNumber: '5491123456789',
  diasAdelante: 30,
  duracionServicios: {
    'Corte Premium': 60,
    'Barba Profesional': 45,
    'Combo Completo': 90,
    'Color & Tinte': 90
  },
  horarios: {
    lunes: { inicio: '09:00', fin: '20:00', bloqueados: ['13:00'] },
    martes: { inicio: '09:00', fin: '20:00', bloqueados: ['13:00'] },
    miercoles: { inicio: '09:00', fin: '20:00', bloqueados: ['13:00'] },
    jueves: { inicio: '09:00', fin: '20:00', bloqueados: ['13:00'] },
    viernes: { inicio: '09:00', fin: '20:00', bloqueados: ['13:00'] },
    sabado: { inicio: '09:00', fin: '18:00', bloqueados: [] },
    domingo: { cerrado: true }
  },
  capacidadSimultanea: 2, // 2 barberos trabajando
  adminPassword: 'admin123' // En producción esto debería estar en backend
};

// ===== BASE DE DATOS SIMULADA (JSON en localStorage) =====
class DatabaseJSON {
  constructor() {
    this.initializeDB();
  }

  initializeDB() {
    // Inicializar si no existe
    if (!localStorage.getItem('barberia_reservas')) {
      const initialData = {
        reservas: [],
        clientes: [],
        configuracion: RESERVAS_CONFIG,
        estadisticas: {
          totalReservas: 0,
          reservasConfirmadas: 0,
          reservasCanceladas: 0,
          serviciosMasReservados: {}
        }
      };
      localStorage.setItem('barberia_reservas', JSON.stringify(initialData));
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem('barberia_reservas'));
  }

  saveData(data) {
    localStorage.setItem('barberia_reservas', JSON.stringify(data));
  }

  // CRUD de Reservas
  crearReserva(reserva) {
    const data = this.getData();
    const nuevaReserva = {
      id: this.generarID(),
      ...reserva,
      estado: 'pendiente', // pendiente, confirmada, cancelada, completada
      creadaEl: new Date().toISOString(),
      confirmadaEl: null,
      canceladaEl: null
    };
    
    data.reservas.push(nuevaReserva);
    data.estadisticas.totalReservas++;
    this.saveData(data);
    return nuevaReserva;
  }

  obtenerReservas(filtros = {}) {
    const data = this.getData();
    let reservas = data.reservas;

    // Filtrar por fecha
    if (filtros.fecha) {
      reservas = reservas.filter(r => r.fecha === filtros.fecha);
    }

    // Filtrar por estado
    if (filtros.estado) {
      reservas = reservas.filter(r => r.estado === filtros.estado);
    }

    // Filtrar por cliente
    if (filtros.clienteId) {
      reservas = reservas.filter(r => r.clienteId === filtros.clienteId);
    }

    return reservas;
  }

  obtenerReservaPorId(id) {
    const data = this.getData();
    return data.reservas.find(r => r.id === id);
  }

  actualizarReserva(id, cambios) {
    const data = this.getData();
    const index = data.reservas.findIndex(r => r.id === id);
    
    if (index !== -1) {
      data.reservas[index] = { ...data.reservas[index], ...cambios };
      
      // Actualizar estadísticas
      if (cambios.estado === 'confirmada' && data.reservas[index].estado !== 'confirmada') {
        data.estadisticas.reservasConfirmadas++;
      }
      if (cambios.estado === 'cancelada' && data.reservas[index].estado !== 'cancelada') {
        data.estadisticas.reservasCanceladas++;
      }
      
      this.saveData(data);
      return data.reservas[index];
    }
    return null;
  }

  cancelarReserva(id, motivo = '') {
    return this.actualizarReserva(id, {
      estado: 'cancelada',
      canceladaEl: new Date().toISOString(),
      motivoCancelacion: motivo
    });
  }

  confirmarReserva(id) {
    return this.actualizarReserva(id, {
      estado: 'confirmada',
      confirmadaEl: new Date().toISOString()
    });
  }

  // CRUD de Clientes
  crearCliente(cliente) {
    const data = this.getData();
    const nuevoCliente = {
      id: this.generarID(),
      ...cliente,
      registradoEl: new Date().toISOString(),
      totalReservas: 0,
      ultimaVisita: null
    };
    
    data.clientes.push(nuevoCliente);
    this.saveData(data);
    return nuevoCliente;
  }

  obtenerClientePorTelefono(telefono) {
    const data = this.getData();
    return data.clientes.find(c => c.telefono === telefono);
  }

  obtenerClientePorId(id) {
    const data = this.getData();
    return data.clientes.find(c => c.id === id);
  }

  actualizarCliente(id, cambios) {
    const data = this.getData();
    const index = data.clientes.findIndex(c => c.id === id);
    
    if (index !== -1) {
      data.clientes[index] = { ...data.clientes[index], ...cambios };
      this.saveData(data);
      return data.clientes[index];
    }
    return null;
  }

  // Utilidades
  generarID() {
    return 'ID-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  obtenerEstadisticas() {
    const data = this.getData();
    return data.estadisticas;
  }

  resetearBaseDatos() {
    localStorage.removeItem('barberia_reservas');
    this.initializeDB();
  }
}

// ===== GESTOR DE DISPONIBILIDAD =====
class GestorDisponibilidad {
  constructor(db) {
    this.db = db;
  }

  obtenerHorariosDisponibles(fecha, servicio) {
    const diaSemana = this.obtenerDiaSemana(fecha);
    const config = RESERVAS_CONFIG.horarios[diaSemana];
    
    // Si está cerrado
    if (config.cerrado) {
      return [];
    }

    // Generar todos los horarios posibles
    const todosHorarios = this.generarHorarios(config.inicio, config.fin, servicio);
    
    // Filtrar bloqueados
    const horariosSinBloqueos = todosHorarios.filter(h => !config.bloqueados.includes(h));
    
    // Obtener reservas del día
    const reservasDelDia = this.db.obtenerReservas({ 
      fecha,
      estado: ['pendiente', 'confirmada'] // Solo contar reservas activas
    });
    
    // Filtrar según disponibilidad
    const horariosDisponibles = horariosSinBloqueos.filter(horario => {
      return this.hayDisponibilidad(horario, fecha, servicio, reservasDelDia);
    });

    return horariosDisponibles;
  }

  hayDisponibilidad(horario, fecha, servicio, reservasDelDia) {
    const duracion = RESERVAS_CONFIG.duracionServicios[servicio];
    const horarioInicio = this.convertirHoraAMinutos(horario);
    const horarioFin = horarioInicio + duracion;

    // Contar cuántas reservas se superponen con este horario
    const reservasSuperpuestas = reservasDelDia.filter(reserva => {
      const reservaInicio = this.convertirHoraAMinutos(reserva.horario);
      const reservaDuracion = RESERVAS_CONFIG.duracionServicios[reserva.servicio];
      const reservaFin = reservaInicio + reservaDuracion;

      // Verificar si hay superposición
      return !(horarioFin <= reservaInicio || horarioInicio >= reservaFin);
    });

    // Hay disponibilidad si no se excede la capacidad
    return reservasSuperpuestas.length < RESERVAS_CONFIG.capacidadSimultanea;
  }

  generarHorarios(inicio, fin, servicio) {
    const horarios = [];
    const duracion = RESERVAS_CONFIG.duracionServicios[servicio];
    let actual = this.convertirHoraAMinutos(inicio);
    const finMinutos = this.convertirHoraAMinutos(fin) - duracion;

    while (actual <= finMinutos) {
      horarios.push(this.convertirMinutosAHora(actual));
      actual += 30; // Intervalos de 30 minutos
    }

    return horarios;
  }

  obtenerDiaSemana(fecha) {
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const date = new Date(fecha + 'T00:00:00');
    return dias[date.getDay()];
  }

  convertirHoraAMinutos(hora) {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }

  convertirMinutosAHora(minutos) {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  esFechaValida(fecha) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const maxFecha = new Date();
    maxFecha.setDate(maxFecha.getDate() + RESERVAS_CONFIG.diasAdelante);

    return fechaSeleccionada >= hoy && fechaSeleccionada <= maxFecha;
  }
}

// ===== GESTOR DE RESERVAS (Lógica de Negocio) =====
class GestorReservas {
  constructor() {
    this.db = new DatabaseJSON();
    this.disponibilidad = new GestorDisponibilidad(this.db);
  }

  // Cliente hace una reserva
  crearReserva(datosReserva) {
    const { nombre, telefono, email, servicio, fecha, horario, comentarios } = datosReserva;

    // Validaciones
    if (!this.validarDatos(datosReserva)) {
      return { exito: false, error: 'Datos incompletos o inválidos' };
    }

    // Verificar disponibilidad
    const horariosDisponibles = this.disponibilidad.obtenerHorariosDisponibles(fecha, servicio);
    if (!horariosDisponibles.includes(horario)) {
      return { exito: false, error: 'Horario no disponible' };
    }

    // Buscar o crear cliente
    let cliente = this.db.obtenerClientePorTelefono(telefono);
    if (!cliente) {
      cliente = this.db.crearCliente({ nombre, telefono, email });
    }

    // Crear reserva
    const reserva = this.db.crearReserva({
      clienteId: cliente.id,
      nombreCliente: nombre,
      telefono,
      email,
      servicio,
      fecha,
      horario,
      comentarios: comentarios || '',
      duracion: RESERVAS_CONFIG.duracionServicios[servicio]
    });

    // Actualizar cliente
    this.db.actualizarCliente(cliente.id, {
      totalReservas: (cliente.totalReservas || 0) + 1
    });

    return { exito: true, reserva };
  }

  // Obtener reservas del cliente
  obtenerReservasCliente(telefono) {
    const cliente = this.db.obtenerClientePorTelefono(telefono);
    if (!cliente) {
      return [];
    }
    
    return this.db.obtenerReservas({ clienteId: cliente.id });
  }

  // Cliente cancela su reserva
  cancelarReserva(reservaId, telefono, motivo) {
    const reserva = this.db.obtenerReservaPorId(reservaId);
    
    if (!reserva) {
      return { exito: false, error: 'Reserva no encontrada' };
    }

    // Verificar que el teléfono coincida
    if (reserva.telefono !== telefono) {
      return { exito: false, error: 'No autorizado' };
    }

    // No se puede cancelar si ya está completada
    if (reserva.estado === 'completada') {
      return { exito: false, error: 'No se puede cancelar una reserva completada' };
    }

    // Calcular si puede cancelar (mínimo 2 horas antes)
    const ahora = new Date();
    const fechaReserva = new Date(reserva.fecha + 'T' + reserva.horario);
    const horasRestantes = (fechaReserva - ahora) / (1000 * 60 * 60);

    if (horasRestantes < 2) {
      return { exito: false, error: 'Debe cancelar con al menos 2 horas de anticipación' };
    }

    this.db.cancelarReserva(reservaId, motivo);
    return { exito: true };
  }

  // Modificar reserva
  modificarReserva(reservaId, telefono, nuevaFecha, nuevoHorario) {
    const reserva = this.db.obtenerReservaPorId(reservaId);
    
    if (!reserva || reserva.telefono !== telefono) {
      return { exito: false, error: 'Reserva no encontrada o no autorizada' };
    }

    // Verificar nueva disponibilidad
    const horariosDisponibles = this.disponibilidad.obtenerHorariosDisponibles(
      nuevaFecha, 
      reserva.servicio
    );

    if (!horariosDisponibles.includes(nuevoHorario)) {
      return { exito: false, error: 'Nuevo horario no disponible' };
    }

    this.db.actualizarReserva(reservaId, {
      fecha: nuevaFecha,
      horario: nuevoHorario,
      modificadaEl: new Date().toISOString()
    });

    return { exito: true };
  }

  validarDatos(datos) {
    const { nombre, telefono, servicio, fecha, horario } = datos;
    
    if (!nombre || nombre.length < 3) return false;
    if (!telefono || telefono.length < 10) return false;
    if (!servicio || !RESERVAS_CONFIG.duracionServicios[servicio]) return false;
    if (!fecha || !this.disponibilidad.esFechaValida(fecha)) return false;
    if (!horario) return false;

    return true;
  }

  // Generar mensaje de WhatsApp
  generarMensajeWhatsApp(reserva) {
    const mensaje = `
¡Hola! Quiero confirmar mi reserva:

📅 Fecha: ${this.formatearFecha(reserva.fecha)}
🕐 Horario: ${reserva.horario}
✂️ Servicio: ${reserva.servicio}
👤 Nombre: ${reserva.nombreCliente}
📱 Teléfono: ${reserva.telefono}
${reserva.comentarios ? `💬 Comentarios: ${reserva.comentarios}` : ''}

ID de Reserva: ${reserva.id}
    `.trim();

    return encodeURIComponent(mensaje);
  }

  formatearFecha(fecha) {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// ===== PANEL DE ADMINISTRACIÓN =====
class PanelAdmin {
  constructor(gestorReservas) {
    this.gestor = gestorReservas;
    this.autenticado = false;
  }

  autenticar(password) {
    this.autenticado = password === RESERVAS_CONFIG.adminPassword;
    return this.autenticado;
  }

  // Ver todas las reservas
  obtenerTodasReservas(filtros = {}) {
    if (!this.autenticado) return null;
    return this.gestor.db.obtenerReservas(filtros);
  }

  // Ver reservas del día
  obtenerReservasHoy() {
    if (!this.autenticado) return null;
    const hoy = new Date().toISOString().split('T')[0];
    return this.gestor.db.obtenerReservas({ fecha: hoy });
  }

  // Ver reservas por rango de fechas
  obtenerReservasPorRango(fechaInicio, fechaFin) {
    if (!this.autenticado) return null;
    const todasReservas = this.gestor.db.obtenerReservas();
    return todasReservas.filter(r => r.fecha >= fechaInicio && r.fecha <= fechaFin);
  }

  // Confirmar reserva
  confirmarReserva(reservaId) {
    if (!this.autenticado) return null;
    return this.gestor.db.confirmarReserva(reservaId);
  }

  // Cancelar reserva (admin)
  cancelarReserva(reservaId, motivo) {
    if (!this.autenticado) return null;
    return this.gestor.db.cancelarReserva(reservaId, motivo);
  }

  // Marcar como completada
  completarReserva(reservaId) {
    if (!this.autenticado) return null;
    return this.gestor.db.actualizarReserva(reservaId, {
      estado: 'completada',
      completadaEl: new Date().toISOString()
    });
  }

  // Bloquear horario
  bloquearHorario(fecha, horario, motivo) {
    if (!this.autenticado) return null;
    
    // Crear una "reserva" de bloqueo
    return this.gestor.db.crearReserva({
      clienteId: 'BLOQUEADO',
      nombreCliente: 'BLOQUEADO',
      telefono: 'N/A',
      servicio: 'Combo Completo', // Usa la duración más larga
      fecha,
      horario,
      comentarios: motivo,
      estado: 'bloqueado'
    });
  }

  // Obtener estadísticas
  obtenerEstadisticas() {
    if (!this.autenticado) return null;
    
    const stats = this.gestor.db.obtenerEstadisticas();
    const reservas = this.gestor.db.obtenerReservas();
    
    // Calcular más estadísticas
    const hoy = new Date().toISOString().split('T')[0];
    const reservasHoy = reservas.filter(r => r.fecha === hoy).length;
    
    const serviciosMasReservados = reservas.reduce((acc, r) => {
      acc[r.servicio] = (acc[r.servicio] || 0) + 1;
      return acc;
    }, {});

    return {
      ...stats,
      reservasHoy,
      serviciosMasReservados,
      totalClientes: this.gestor.db.getData().clientes.length
    };
  }

  // Obtener agenda del día
  obtenerAgendaDia(fecha) {
    if (!this.autenticado) return null;
    
    const reservas = this.gestor.db.obtenerReservas({ fecha });
    
    // Ordenar por horario
    return reservas.sort((a, b) => {
      const horaA = a.horario.split(':').map(Number);
      const horaB = b.horario.split(':').map(Number);
      return (horaA[0] * 60 + horaA[1]) - (horaB[0] * 60 + horaB[1]);
    });
  }

  // Exportar datos
  exportarDatos() {
    if (!this.autenticado) return null;
    return this.gestor.db.getData();
  }

  // Importar datos
  importarDatos(datos) {
    if (!this.autenticado) return null;
    this.gestor.db.saveData(datos);
  }
}

// ===== EXPORTAR PARA USO GLOBAL =====
const SistemaReservas = {
  gestor: new GestorReservas(),
  admin: null,
  
  inicializar() {
    this.admin = new PanelAdmin(this.gestor);
    console.log('Sistema de reservas inicializado');
  },
  
  // Métodos para cliente
  crearReserva(datos) {
    return this.gestor.crearReserva(datos);
  },
  
  obtenerHorariosDisponibles(fecha, servicio) {
    return this.gestor.disponibilidad.obtenerHorariosDisponibles(fecha, servicio);
  },
  
  obtenerReservasCliente(telefono) {
    return this.gestor.obtenerReservasCliente(telefono);
  },
  
  cancelarReserva(reservaId, telefono, motivo) {
    return this.gestor.cancelarReserva(reservaId, telefono, motivo);
  },
  
  modificarReserva(reservaId, telefono, nuevaFecha, nuevoHorario) {
    return this.gestor.modificarReserva(reservaId, telefono, nuevaFecha, nuevoHorario);
  },
  
  generarMensajeWhatsApp(reserva) {
    return this.gestor.generarMensajeWhatsApp(reserva);
  },
  
  // Métodos para admin
  autenticarAdmin(password) {
    return this.admin.autenticar(password);
  }
};

// Inicializar al cargar
if (typeof window !== 'undefined') {
  window.SistemaReservas = SistemaReservas;
  SistemaReservas.inicializar();
}

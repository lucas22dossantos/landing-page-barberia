// ===== SISTEMA DE RESERVAS - BARBERÍA PREMIUM (UNIFICADO) =====
// Simula una base de datos usando localStorage para persistencia real entre vistas.

const RESERVAS_CONFIG = {
  whatsappNumber: '5491123456789',
  diasAdelante: 30,
  barbers: [
    { id: 1, name: 'Juan', shift: { start: 9, end: 17 }, label: 'Juan (Mañana)' },
    { id: 2, name: 'Pedro', shift: { start: 13, end: 21 }, label: 'Pedro (Tarde)' },
    { id: 3, name: 'Lucas', shift: { start: 10, end: 19 }, label: 'Lucas (Todo el día)' }
  ],
  services: {
    'Corte Premium': 45,
    'Barba Profesional': 30,
    'Combo Completo': 75,
    'Color & Tinte': 90,
    'Perfilado de Cejas': 15,
    'Tratamiento Facial': 30
  },
  adminPassword: 'admin123'
};

class DatabaseJSON {
  constructor() {
    this.initializeDB();
  }

  initializeDB() {
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

  crearReserva(reserva) {
    const data = this.getData();
    const nuevaReserva = {
      id: 'ID-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      ...reserva,
      estado: 'pendiente',
      creadaEl: new Date().toISOString()
    };
    data.reservas.push(nuevaReserva);
    data.estadisticas.totalReservas++;
    this.saveData(data);
    return nuevaReserva;
  }

  obtenerReservas(filtros = {}) {
    const data = this.getData();
    let reservas = data.reservas;
    if (filtros.fecha) reservas = reservas.filter(r => r.fecha === filtros.fecha);
    if (filtros.estado) reservas = reservas.filter(r => r.estado === filtros.estado);
    if (filtros.barberoId) reservas = reservas.filter(r => r.barberoId === filtros.barberoId);
    return reservas;
  }

  actualizarReserva(id, cambios) {
    const data = this.getData();
    const index = data.reservas.findIndex(r => r.id === id);
    if (index !== -1) {
      data.reservas[index] = { ...data.reservas[index], ...cambios };
      if (cambios.estado === 'confirmada') data.estadisticas.reservasConfirmadas++;
      if (cambios.estado === 'cancelada') data.estadisticas.reservasCanceladas++;
      this.saveData(data);
      return data.reservas[index];
    }
    return null;
  }
}

class GestorDisponibilidad {
  constructor(db) {
    this.db = db;
  }

  obtenerHorariosDisponibles(fecha, servicio, barberoSeleccionado = 'Cualquiera') {
    const day = new Date(fecha + 'T00:00:00').getDay();
    if (day === 0) return [];

    const duration = RESERVAS_CONFIG.services[servicio] || 30;
    const slotInterval = 30;
    const reservasDelDia = this.db.obtenerReservas({ fecha });
    let slotSet = new Set();

    const targetBarbers = barberoSeleccionado === 'Cualquiera'
      ? RESERVAS_CONFIG.barbers
      : RESERVAS_CONFIG.barbers.filter(b => b.name === barberoSeleccionado);

    targetBarbers.forEach(barber => {
      let startMin = barber.shift.start * 60;
      let endMin = barber.shift.end * 60;

      for (let time = startMin; time + duration <= endMin; time += slotInterval) {
        const isBusy = reservasDelDia.some(appt => {
          if (appt.barberoId !== barber.id || appt.estado === 'cancelada') return false;
          const apptStart = this.convertirHoraAMinutos(appt.horario);
          const apptDuration = RESERVAS_CONFIG.services[appt.servicio] || 30;
          return (time < apptStart + apptDuration && time + duration > apptStart);
        });
        if (!isBusy) slotSet.add(this.convertirMinutosAHora(time));
      }
    });

    return Array.from(slotSet).sort();
  }

  convertirHoraAMinutos(hora) {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  convertirMinutosAHora(minutos) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
}

class GestorReservas {
  constructor() {
    this.db = new DatabaseJSON();
    this.disponibilidad = new GestorDisponibilidad(this.db);
  }

  crearReserva(datos) {
    // Validar disponibilidad
    const disponibles = this.disponibilidad.obtenerHorariosDisponibles(datos.fecha, datos.servicio, datos.barbero);
    if (!disponibles.includes(datos.horario)) return { exito: false, error: 'Horario no disponible' };

    // Asignar barberoId
    let idBarbero = null;
    if (datos.barbero !== 'Cualquiera') {
      idBarbero = RESERVAS_CONFIG.barbers.find(b => b.name === datos.barbero).id;
    } else {
      // Asignación automática al primero disponible
      const duration = RESERVAS_CONFIG.services[datos.servicio] || 30;
      const timeMin = this.disponibilidad.convertirHoraAMinutos(datos.horario);
      const reservas = this.db.obtenerReservas({ fecha: datos.fecha });
      const barberoDisponible = RESERVAS_CONFIG.barbers.find(b => {
        let bStart = b.shift.start * 60;
        let bEnd = b.shift.end * 60;
        if (timeMin < bStart || timeMin + duration > bEnd) return false;
        return !reservas.some(r => {
          if (r.barberoId !== b.id || r.estado === 'cancelada') return false;
          const rStart = this.disponibilidad.convertirHoraAMinutos(r.horario);
          const rDur = RESERVAS_CONFIG.services[r.servicio] || 30;
          return (timeMin < rStart + rDur && timeMin + duration > rStart);
        });
      });
      idBarbero = barberoDisponible ? barberoDisponible.id : 1;
    }

    const reserva = this.db.crearReserva({
      ...datos,
      barberoId: idBarbero,
      barbero: RESERVAS_CONFIG.barbers.find(b => b.id === idBarbero).name
    });

    return { exito: true, reserva };
  }
}

const SistemaReservas = {
  gestor: new GestorReservas(),

  crearReserva(datos) { return this.gestor.crearReserva(datos); },
  obtenerHorariosDisponibles(fecha, servicio, barbero) {
    return this.gestor.disponibilidad.obtenerHorariosDisponibles(fecha, servicio, barbero);
  },
  autenticarAdmin(pass) { return pass === RESERVAS_CONFIG.adminPassword; },
  obtenerReservas(filtros) { return this.gestor.db.obtenerReservas(filtros); },
  actualizarEstado(id, estado) { return this.gestor.db.actualizarReserva(id, { estado }); },
  obtenerEstadisticas() {
    const data = this.gestor.db.getData();
    const hoy = new Date().toISOString().split('T')[0];
    return {
      ...data.estadisticas,
      totalClientes: data.clientes.length,
      reservasHoy: data.reservas.filter(r => r.fecha === hoy).length
    };
  },

  generarMensajeWhatsApp(reserva) {
    const fechaFmt = new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
    return encodeURIComponent(`*BARBERÍA PREMIUM - NUEVA RESERVA*\n\nHola *${reserva.nombre}*, confirmamos los detalles de tu turno:\n\n📅 *Fecha:* ${fechaFmt}\n🕐 *Hora:* ${reserva.horario} hs\n✂️ *Servicio:* ${reserva.servicio}\n👤 *Barbero:* ${reserva.barbero}\n\n_¡Te esperamos en Av. Corrientes 1234!_`);
  },

  obtenerReservasCliente(telefono) {
    const data = this.gestor.db.getData();
    return data.reservas.filter(r => r.telefono === telefono);
  },

  cancelarReserva(id, telefono, motivo) {
    const data = this.gestor.db.getData();
    const index = data.reservas.findIndex(r => r.id === id && r.telefono === telefono);
    if (index !== -1) {
      data.reservas[index].estado = 'cancelada';
      data.reservas[index].motivoCancelacion = motivo;
      data.estadisticas.reservasCanceladas++;
      this.gestor.db.saveData(data);
      return { exito: true };
    }
    return { exito: false, error: 'Reserva no encontrada o datos incorrectos' };
  }
};

if (typeof window !== 'undefined') {
  window.SistemaReservas = SistemaReservas;
}

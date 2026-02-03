# 📅 Sistema de Reservas - Barbería Premium

## 🎯 Descripción General

Sistema completo de gestión de reservas con simulación de base de datos JSON usando localStorage. Incluye funcionalidades para clientes y administradores con lógica robusta de disponibilidad.

---

## 📁 Archivos del Sistema

```
/
├── index.html                    # Sitio web principal (existente)
├── admin.html                    # Panel de administración (NUEVO)
├── script.js                     # JavaScript principal (existente)
├── style.css                     # Estilos (existente)
├── reservas-system.js            # Sistema de reservas (NUEVO)
├── reservas-integration.js       # Integración con formulario (NUEVO)
└── admin-ui.js                   # UI del panel admin (NUEVO)
```

---

## 🚀 Instalación

### 1. Agregar los nuevos archivos

Coloca estos archivos en tu proyecto:
- `reservas-system.js`
- `reservas-integration.js` 
- `admin.html`
- `admin-ui.js`

### 2. Actualizar index.html

Agrega ANTES del cierre de `</body>`:

```html
<!-- Sistema de Reservas -->
<script src="reservas-system.js"></script>
<script src="reservas-integration.js"></script>
```

### 3. Agregar botón "Mis Reservas" (opcional)

En el navbar o footer del index.html:

```html
<button onclick="abrirMisReservas()" class="btn btn--secondary">
  <i class="fas fa-list"></i> Mis Reservas
</button>
```

---

## 👥 Funcionalidades para Clientes

### 1. Crear Reserva

**Flujo:**
1. Cliente hace clic en "Reservar"
2. Completa formulario (nombre, teléfono, servicio, fecha, horario)
3. Sistema valida disponibilidad
4. Se crea la reserva en estado "pendiente"
5. Se muestra confirmación con ID y detalles
6. Botón para confirmar por WhatsApp

**Validaciones:**
- ✅ Fecha dentro de los próximos 30 días
- ✅ Horario disponible según servicio y capacidad
- ✅ Campos obligatorios completos
- ✅ No permite domingos (cerrado)

### 2. Ver Mis Reservas

**Acceso:** Botón "Mis Reservas" ingresando teléfono

**Muestra:**
- Próximas reservas (pendientes/confirmadas)
- Historial (completadas/canceladas)
- Detalles: fecha, hora, servicio, estado, ID

### 3. Cancelar Reserva

**Restricciones:**
- ⏰ Debe cancelar con al menos 2 horas de anticipación
- ❌ No puede cancelar reservas completadas
- 📞 Solo puede cancelar con su número de teléfono

---

## 👨‍💼 Funcionalidades para Administradores

### Acceso al Panel

**URL:** `admin.html`  
**Contraseña:** `admin123` (demo - cambiar en producción)

### Dashboard

**Estadísticas en tiempo real:**
- 📊 Reservas hoy
- 📈 Total de reservas
- 👥 Clientes registrados
- ✅ Reservas confirmadas
- ❌ Reservas canceladas
- 🏆 Servicios más reservados

### Tabs del Panel

#### 1. Hoy
- Agenda del día actual
- Ordenada por horario
- Acciones rápidas (confirmar/cancelar/completar)

#### 2. Todas
- Todas las reservas del sistema
- Filtros:
  - Rango de fechas
  - Estado (pendiente/confirmada/cancelada/completada)
- Tabla completa con todos los detalles

#### 3. Pendientes
- Solo reservas pendientes de confirmación
- Vista prioritaria
- Acciones directas

#### 4. Estadísticas
- Métricas detalladas
- Servicios más populares
- Gráficos de tendencias

### Acciones del Admin

**Confirmar Reserva:**
```javascript
SistemaReservas.admin.confirmarReserva(reservaId)
```

**Cancelar Reserva:**
```javascript
SistemaReservas.admin.cancelarReserva(reservaId, motivo)
```

**Completar Reserva:**
```javascript
SistemaReservas.admin.completarReserva(reservaId)
```

**Bloquear Horario:**
```javascript
SistemaReservas.admin.bloquearHorario(fecha, horario, motivo)
```

---

## ⚙️ Configuración

### Horarios de Atención

En `reservas-system.js`, líneas 12-21:

```javascript
horarios: {
  lunes: { inicio: '09:00', fin: '20:00', bloqueados: ['13:00'] },
  martes: { inicio: '09:00', fin: '20:00', bloqueados: ['13:00'] },
  miercoles: { inicio: '09:00', fin: '20:00', bloqueados: ['13:00'] },
  jueves: { inicio: '09:00', fin: '20:00', bloqueados: ['13:00'] },
  viernes: { inicio: '09:00', fin: '20:00', bloqueados: ['13:00'] },
  sabado: { inicio: '09:00', fin: '18:00', bloqueados: [] },
  domingo: { cerrado: true }
}
```

**bloqueados:** Horarios de almuerzo u otros breaks

### Duración de Servicios

Líneas 7-11:

```javascript
duracionServicios: {
  'Corte Premium': 60,           // minutos
  'Barba Profesional': 45,
  'Combo Completo': 90,
  'Color & Tinte': 90
}
```

### Capacidad Simultánea

Línea 22:

```javascript
capacidadSimultanea: 2  // 2 barberos trabajando
```

**Ejemplo:**
- Con capacidad 2, se pueden atender 2 clientes al mismo tiempo
- Si hay 2 reservas a las 10:00, NO se mostrará ese horario disponible
- Si hay 1 reserva a las 10:00, TODAVÍA se puede reservar

### Días de Anticipación

Línea 6:

```javascript
diasAdelante: 30  // Permitir reservas hasta 30 días adelante
```

### WhatsApp

Línea 5:

```javascript
whatsappNumber: '5491123456789'  // CAMBIAR POR TU NÚMERO
```

Formato: código país + código área + número (sin espacios ni guiones)

### Contraseña de Admin

Línea 23:

```javascript
adminPassword: 'admin123'  // ⚠️ CAMBIAR EN PRODUCCIÓN
```

---

## 🗄️ Base de Datos (localStorage)

### Estructura JSON

```json
{
  "reservas": [
    {
      "id": "ID-1234567890-abc123",
      "clienteId": "ID-0987654321-xyz789",
      "nombreCliente": "Juan Pérez",
      "telefono": "1234567890",
      "email": "juan@email.com",
      "servicio": "Corte Premium",
      "fecha": "2026-02-10",
      "horario": "14:00",
      "duracion": 60,
      "comentarios": "Preferencia por estilo clásico",
      "estado": "confirmada",
      "creadaEl": "2026-02-03T10:30:00.000Z",
      "confirmadaEl": "2026-02-03T11:00:00.000Z",
      "canceladaEl": null,
      "completadaEl": null
    }
  ],
  "clientes": [
    {
      "id": "ID-0987654321-xyz789",
      "nombre": "Juan Pérez",
      "telefono": "1234567890",
      "email": "juan@email.com",
      "registradoEl": "2026-02-03T10:30:00.000Z",
      "totalReservas": 1,
      "ultimaVisita": null
    }
  ],
  "configuracion": { /* ... */ },
  "estadisticas": {
    "totalReservas": 1,
    "reservasConfirmadas": 1,
    "reservasCanceladas": 0,
    "serviciosMasReservados": {
      "Corte Premium": 1
    }
  }
}
```

### Estados de Reserva

- **pendiente:** Recién creada, esperando confirmación admin
- **confirmada:** Admin confirmó la reserva
- **cancelada:** Cancelada por cliente o admin
- **completada:** Servicio realizado
- **bloqueado:** Horario bloqueado por admin (no es reserva real)

---

## 🔧 API del Sistema

### Para Uso en el Cliente

```javascript
// Crear reserva
const resultado = SistemaReservas.crearReserva({
  nombre: 'Juan Pérez',
  telefono: '1234567890',
  email: 'juan@email.com',
  servicio: 'Corte Premium',
  fecha: '2026-02-10',
  horario: '14:00',
  comentarios: 'Comentario opcional'
});

// Obtener horarios disponibles
const horarios = SistemaReservas.obtenerHorariosDisponibles(
  '2026-02-10',  // fecha
  'Corte Premium' // servicio
);
// Retorna: ['09:00', '09:30', '10:00', ...]

// Ver reservas del cliente
const reservas = SistemaReservas.obtenerReservasCliente('1234567890');

// Cancelar reserva
const resultado = SistemaReservas.cancelarReserva(
  'ID-1234567890-abc123',  // reservaId
  '1234567890',            // telefono
  'Motivo de cancelación'
);

// Generar mensaje WhatsApp
const mensaje = SistemaReservas.generarMensajeWhatsApp(reserva);
```

### Para Uso del Admin

```javascript
// Autenticar
SistemaReservas.autenticarAdmin('admin123');

// Ver todas las reservas
const todas = SistemaReservas.admin.obtenerTodasReservas();

// Ver reservas filtradas
const pendientes = SistemaReservas.admin.obtenerTodasReservas({ 
  estado: 'pendiente' 
});

// Ver reservas de hoy
const hoy = SistemaReservas.admin.obtenerReservasHoy();

// Ver por rango
const rango = SistemaReservas.admin.obtenerReservasPorRango(
  '2026-02-01',
  '2026-02-28'
);

// Confirmar
SistemaReservas.admin.confirmarReserva('ID-123...');

// Cancelar
SistemaReservas.admin.cancelarReserva('ID-123...', 'Motivo');

// Completar
SistemaReservas.admin.completarReserva('ID-123...');

// Bloquear horario
SistemaReservas.admin.bloquearHorario(
  '2026-02-10',
  '14:00',
  'Reunión importante'
);

// Estadísticas
const stats = SistemaReservas.admin.obtenerEstadisticas();

// Agenda del día
const agenda = SistemaReservas.admin.obtenerAgendaDia('2026-02-10');

// Exportar/Importar datos
const datos = SistemaReservas.admin.exportarDatos();
SistemaReservas.admin.importarDatos(datos);
```

---

## 🧪 Testing y Debugging

### Consola del Navegador

```javascript
// Ver base de datos completa
console.log(SistemaReservas.gestor.db.getData());

// Resetear base de datos (⚠️ ELIMINA TODO)
SistemaReservas.gestor.db.resetearBaseDatos();

// Ver localStorage directamente
console.log(localStorage.getItem('barberia_reservas'));

// Crear reserva de prueba
SistemaReservas.crearReserva({
  nombre: 'Cliente Test',
  telefono: '1111111111',
  servicio: 'Corte Premium',
  fecha: '2026-02-10',
  horario: '10:00'
});
```

---

## 🎨 Personalización de UI

### Cambiar Colores del Admin Panel

En `admin.html`, sección `<style>`:

```css
/* Color primario (dorado) */
--color-accent: #d4af37;

/* Color de fondo */
background: #0a0a0a;

/* Bordes */
border-color: #333;
```

### Agregar Nuevo Estado

1. En `reservas-system.js`, usar el estado en la lógica
2. En `admin-ui.js`, agregar badge:

```javascript
const badges = {
  'pendiente': '...',
  'tu_nuevo_estado': '<span class="badge badge-custom">Tu Estado</span>'
};
```

3. En `admin.html`, agregar estilos:

```css
.badge-custom {
  background: rgba(YOUR_COLOR);
  color: YOUR_COLOR;
}
```

---

## 🔒 Seguridad (Importante para Producción)

### ⚠️ Limitaciones de localStorage

**NO usar en producción real sin backend:**
- ❌ Los datos están en el navegador del cliente
- ❌ Cualquiera puede editar localStorage
- ❌ Se pierden si se limpia caché
- ❌ No hay autenticación real

### ✅ Para Producción Real

1. **Backend necesario:**
   - Node.js + Express
   - Python + Flask/Django
   - PHP + Laravel
   - Base de datos real (MySQL, PostgreSQL, MongoDB)

2. **Autenticación:**
   - JWT tokens
   - OAuth
   - Sessions con cookies seguras

3. **Validación:**
   - Validar SIEMPRE en backend
   - Sanitizar inputs
   - Rate limiting

---

## 📊 Flujo Completo del Sistema

```
CLIENTE
  │
  ├─> Hace clic en "Reservar"
  │
  ├─> Completa formulario
  │     │
  │     ├─> Selecciona fecha → Sistema muestra horarios disponibles
  │     ├─> Selecciona horario
  │     └─> Envía formulario
  │
  ├─> Sistema valida:
  │     ├─> Campos completos
  │     ├─> Fecha válida (hoy hasta +30 días)
  │     ├─> Horario disponible
  │     └─> No excede capacidad
  │
  ├─> Crea reserva en estado "pendiente"
  │
  ├─> Muestra confirmación con ID
  │
  └─> Cliente confirma por WhatsApp

ADMIN
  │
  ├─> Accede a admin.html
  │
  ├─> Ingresa contraseña
  │
  ├─> Ve dashboard con estadísticas
  │
  ├─> Revisa reservas pendientes
  │
  ├─> Confirma o cancela reservas
  │
  ├─> Marca como completadas después del servicio
  │
  └─> Consulta estadísticas y reportes
```

---

## 🚀 Próximas Mejoras Sugeridas

### Funcionalidades
- [ ] Notificaciones por email
- [ ] SMS automáticos
- [ ] Recordatorios 24h antes
- [ ] Sistema de puntos/fidelidad
- [ ] Promociones y descuentos
- [ ] Multi-barberos (asignar barbero específico)
- [ ] Servicios combinados personalizados
- [ ] Lista de espera
- [ ] Reprogramación automática
- [ ] Exportar a PDF/Excel

### Técnicas
- [ ] Backend real (Node.js/Python/PHP)
- [ ] Base de datos real
- [ ] Autenticación JWT
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Integración con Google Calendar
- [ ] Pagos online
- [ ] Sistema de calificaciones
- [ ] Chat en vivo

---

## 📞 Soporte

Para dudas o problemas:
1. Revisar esta documentación
2. Verificar consola del navegador (F12)
3. Revisar comentarios en el código
4. Testear con datos de prueba

---

**Desarrollado con ❤️ para Barbería Premium**  
**Versión:** 1.0.0  
**Última actualización:** Febrero 2026

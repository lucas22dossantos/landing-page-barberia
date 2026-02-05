# 💈 Barbería - Sitio Web

Sitio web profesional y responsive para barbería con diseño elegante y sistema de reservas inteligente.

🔗 **[Ver sitio en vivo](https://landing-barberia.netlify.app/)**

## Descripción

Sitio web moderno desarrollado para una barbería que combina estética clásica con funcionalidad contemporánea. Diseñado para ofrecer una experiencia de alta calidad tanto en desktop como en dispositivos móviles, con animaciones suaves y un panel de administración profesional.

## Arquitectura y Flujo de Reservas

El sistema permite una gestión integral desde la solicitud del cliente hasta la confirmación del barbero.

### Proceso de Reserva:
1. **Cliente**: Reserva desde la web. Ve un mensaje de confirmación en pantalla informando que su turno está pendiente.
2. **Admin**: Recibe una alerta sonora y visual en tiempo real en el panel de gestión.
3. **Gestión**: El administrador confirma el turno desde el panel, lo que dispara automáticamente la opción de enviar la confirmación oficial por WhatsApp al número del cliente.

## Características

- **Panel de Administración** en tiempo real con estadísticas y alertas.
- **Notificaciones automáticas** vía WhatsApp para reservas y confirmaciones.
- **Diseño responsive** adaptado a todos los dispositivos.
- **Cálculo de disponibilidad** automático según servicios y barberos.
- **Temas visuales** premium con estética dark y acentos dorados.

## Tecnologías utilizadas

- **HTML5**, **CSS3** (Vanilla) y **JavaScript** (Vanilla).
- **LocalStorage**: Simulación de base de datos para persistencia de datos.
- **Mermaid.js**: Para diagramas de procesos.
- **Font Awesome** y **Google Fonts**.

## Estructura del Proyecto

- `index.html`: Web pública para clientes.
- `script.js`: Lógica de interacción del cliente.
- `admin/admin.html`: Panel de control para el barbero.
- `admin/admin-ui.js`: Lógica del dashboard y alertas.
- `admin/reservas-system.js`: Núcleo unificado de datos y reglas de negocio.

---

Desarrollado para ofrecer una solución completa de gestión y presencia digital para barberías.

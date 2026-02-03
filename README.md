# Barbería Premium - Sitio Web Optimizado

## 🚀 Características

- ✅ **100% Responsive** - Adaptado para móviles, tablets y desktop
- ✅ **Performance optimizado** - Carga rápida y animaciones suaves
- ✅ **SEO friendly** - Estructura semántica y meta tags
- ✅ **Accesibilidad** - ARIA labels y navegación por teclado
- ✅ **Touch optimizado** - Gestos swipe y feedback háptico
- ✅ **Cross-browser** - Compatible con todos los navegadores modernos

## 📱 Adaptación Móvil

### Optimizaciones implementadas:

1. **Viewport Heights dinámicos** - Soluciona problemas de altura en iOS
2. **Touch gestures** - Swipe en testimonios, tap optimizado
3. **Auto-hide navigation** - El nav se oculta al hacer scroll down en móvil
4. **Haptic feedback** - Vibraciones sutiles en dispositivos compatibles
5. **Responsive images** - Lazy loading y tamaños optimizados
6. **Touch targets** - Áreas táctiles de mínimo 44px
7. **Orientación adaptativa** - Manejo de cambios de orientación

### Breakpoints:

- **Desktop**: > 992px
- **Tablet**: 768px - 992px
- **Mobile Large**: 481px - 768px
- **Mobile**: 360px - 480px
- **Mobile Small**: < 360px

## ⚙️ Configuración

### 1. Cambiar número de WhatsApp

En `script.js`, línea 7:

```javascript
const CONFIG = {
  whatsappNumber: '5491123456789', // CAMBIAR POR TU NÚMERO
  // ...
};
```

### 2. Personalizar colores

En `style.css`, líneas 6-14:

```css
:root {
  --color-primary: #0a0a0a;
  --color-accent: #d4af37; /* Color dorado - CAMBIAR AQUÍ */
  --color-accent-light: #e8c55b;
  /* ... */
}
```

### 3. Actualizar información de contacto

En `index.html`, buscar la sección `id="contacto"` y actualizar:
- Dirección
- Teléfono
- Horarios
- Enlaces de redes sociales

### 4. Cambiar imágenes

Reemplazar las URLs de Unsplash en `index.html`:

```html
<!-- Hero background -->
<div class="hero__bg"></div>
<!-- En style.css, buscar: background: url('...') -->

<!-- Gallery -->
<img src="TU_IMAGEN_AQUI.jpg" alt="...">
```

### 5. Modificar servicios

En `index.html`, sección `id="servicios"`:
- Editar títulos, descripciones y precios
- Ajustar íconos (Font Awesome classes)
- Modificar tiempos de duración

## 📂 Estructura de archivos

```
/
├── index.html          # Estructura HTML
├── style.css           # Estilos CSS
├── script.js           # Funcionalidad JavaScript
└── README.md           # Este archivo
```

## 🎨 Tipografía

- **Headings**: Cinzel (serif elegante)
- **Body**: Cormorant Garamond (serif clásica)

Para cambiar las fuentes, modificar en `index.html` y `style.css`:

```css
--font-heading: 'TuFuente', serif;
--font-body: 'OtraFuente', serif;
```

## 🔧 Funcionalidades JavaScript

### Navegación
- Scroll suave a secciones
- Menu hamburguesa en móvil
- Auto-hide en scroll (solo móvil)
- Progress bar

### Animaciones
- Fade in elements al hacer scroll
- Counter animation en estadísticas
- Smooth transitions

### Testimonios
- Auto-rotate cada 5 segundos
- Navegación con flechas/dots
- Swipe en móviles
- Keyboard navigation (←→)

### Reservas
- Modal interactivo
- Validación de fechas
- Integración con WhatsApp
- Horarios dinámicos según día

## 🚀 Deployment

### Opción 1: GitHub Pages
1. Sube los archivos a un repo
2. Ve a Settings > Pages
3. Selecciona la rama main

### Opción 2: Netlify/Vercel
1. Conecta tu repo
2. Deploy automático

### Opción 3: Hosting tradicional
1. Sube via FTP
2. Asegúrate que index.html esté en la raíz

## 📊 Performance Tips

1. **Optimiza imágenes**:
   - Usa WebP cuando sea posible
   - Comprime con TinyPNG o similar
   - Usa dimensiones apropiadas

2. **Carga asíncrona**:
   - Las fuentes ya están optimizadas
   - Considera agregar un Service Worker

3. **Caché**:
   - Configura headers de caché en el servidor
   - Versiona tus archivos CSS/JS

## 🐛 Troubleshooting

### El menú móvil no funciona
- Verificar que el JavaScript esté cargando
- Revisar la consola del navegador

### Las animaciones no se ven suaves
- Verificar que el navegador soporte IntersectionObserver
- Considerar reducir animaciones en dispositivos antiguos

### Problemas con WhatsApp
- Verificar el formato del número: `5491123456789`
- No usar espacios ni guiones
- Incluir código de país

## 📱 Testing

### Desktop
- Chrome, Firefox, Safari, Edge

### Mobile
- iOS Safari (iPhone)
- Chrome Mobile (Android)
- Samsung Internet

### Herramientas
- Chrome DevTools (Device Mode)
- [BrowserStack](https://www.browserstack.com)
- [Responsive Design Checker](https://responsivedesignchecker.com)

## 🎯 Mejoras futuras sugeridas

- [ ] Sistema de reservas con backend
- [ ] Panel de administración
- [ ] Blog integrado
- [ ] Galería con lightbox
- [ ] Google Reviews API
- [ ] Chat en vivo
- [ ] PWA completa
- [ ] Dark/Light mode toggle

## 📝 Licencia

Código libre para uso comercial y personal.

## 💬 Soporte

Para dudas o problemas, consulta la documentación o revisa los comentarios en el código.

---

**Desarrollado con 🔥 y optimizado para la mejor experiencia móvil**

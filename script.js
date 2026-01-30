// ===== PARTICLE BACKGROUND =====
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;

  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${x}%;
      top: ${y}%;
      animation: particleFloat ${duration}s ${delay}s infinite ease-in-out;
      pointer-events: none;
    `;

    particlesContainer.appendChild(particle);
  }

  // Add particle animation styles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes particleFloat {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0.3;
      }
      25% {
        transform: translate(30px, -30px) scale(1.2);
        opacity: 0.6;
      }
      50% {
        transform: translate(-30px, -60px) scale(0.8);
        opacity: 0.4;
      }
      75% {
        transform: translate(20px, -30px) scale(1.1);
        opacity: 0.5;
      }
    }
  `;
  document.head.appendChild(style);
}

// ===== MOBILE MENU TOGGLE =====
function toggleMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");

  // Prevent body scroll when menu is open
  if (navLinks.classList.contains("active")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

// Close menu when a link is clicked
document.addEventListener("DOMContentLoaded", function () {
  createParticles();

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const hamburger = document.getElementById("hamburger");
      const navLinksContainer = document.getElementById("nav-links");
      hamburger.classList.remove("active");
      navLinksContainer.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Initialize counters
  initCounters();

  // Initialize scroll reveals
  initScrollReveal();
  
  // Initialize reservas demo
  inicializarReservasDemo();
});

// ===== INITIALIZE AOS =====
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
  easing: "ease-out-cubic",
  delay: 50,
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Hide navbar on scroll down, show on scroll up
  if (currentScroll > lastScroll && currentScroll > 500) {
    navbar.style.transform = "translateY(-100%)";
  } else {
    navbar.style.transform = "translateY(0)";
  }

  lastScroll = currentScroll;
});

// ===== SCROLL PROGRESS BAR =====
function updateScrollProgress() {
  const scrollProgressBar = document.querySelector(".scroll-progress-bar");
  if (scrollProgressBar) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    // Calculate percentage, ensuring it's between 0 and 100
    let scrollPercent = 0;
    if (docHeight > 0) {
      scrollPercent = (scrollTop / docHeight) * 100;
      scrollPercent = Math.min(100, Math.max(0, scrollPercent));
    }

    scrollProgressBar.style.width = scrollPercent + "%";
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", updateScrollProgress);

// Update on scroll
window.addEventListener("scroll", updateScrollProgress);

// ===== SMOOTH SCROLL FUNCTIONS =====
// scrollToReservar ahora abre el modal de reservas (ver línea 700+)

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const counters = document.querySelectorAll(".stat-number[data-target]");

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  };

  updateCounter();
}

// ===== TESTIMONIAL SLIDER =====
let currentTestimonialIndex = 0;
const testimonials = document.querySelectorAll(".testimonial-card");
const dots = document.querySelectorAll(".dot");

function showTestimonial(index) {
  testimonials.forEach((testimonial) => {
    testimonial.classList.remove("active");
  });

  dots.forEach((dot) => {
    dot.classList.remove("active");
  });

  if (testimonials[index]) {
    testimonials[index].classList.add("active");
    if (dots[index]) {
      dots[index].classList.add("active");
    }
    currentTestimonialIndex = index;
  }
}

function changeTestimonial(direction) {
  let newIndex = currentTestimonialIndex + direction;

  if (newIndex < 0) {
    newIndex = testimonials.length - 1;
  } else if (newIndex >= testimonials.length) {
    newIndex = 0;
  }

  showTestimonial(newIndex);
}

function currentTestimonial(index) {
  showTestimonial(index);
}

// Auto-rotate testimonials
let testimonialInterval = setInterval(() => {
  changeTestimonial(1);
}, 5000);

// Pause auto-rotation on hover
const testimonialSlider = document.querySelector(".testimonial-slider");
if (testimonialSlider) {
  testimonialSlider.addEventListener("mouseenter", () => {
    clearInterval(testimonialInterval);
  });

  testimonialSlider.addEventListener("mouseleave", () => {
    testimonialInterval = setInterval(() => {
      changeTestimonial(1);
    }, 5000);
  });
}

// Keyboard navigation for testimonials
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    changeTestimonial(-1);
    clearInterval(testimonialInterval);
  } else if (e.key === "ArrowRight") {
    changeTestimonial(1);
    clearInterval(testimonialInterval);
  }
});

// ===== FAQ ACCORDION =====
function toggleFaq(button) {
  const faqItem = button.parentElement;
  const isActive = faqItem.classList.contains("active");

  // Close all other FAQ items
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Toggle current item
  if (!isActive) {
    faqItem.classList.add("active");
  }
}

// ===== WHATSAPP FUNCTION =====
function openWhatsApp() {
  const phoneNumber = "5491112345678"; // Replace with actual phone number
  const message = encodeURIComponent(
    "¡Hola! Me gustaría reservar un turno en Barbería Premium.",
  );
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappURL, "_blank");
}

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// ===== INTERSECTION OBSERVER FOR SCROLL REVEAL =====
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for scroll reveal
  document
    .querySelectorAll(
      ".service-card, .gallery-item, .about-feature-item, .contact-item",
    )
    .forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      element.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      observer.observe(element);
    });
}

// ===== BUTTON RIPPLE EFFECT =====
document
  .querySelectorAll("button, .btn-service, .btn-hero")
  .forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

// Add CSS for ripple effect
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
  button, .btn-service, .btn-hero {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// ===== PARALLAX EFFECT REMOVED =====
// Parallax effect removed for better user experience

// ===== LAZY LOADING FOR IMAGES =====
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// ===== GALLERY LIGHTBOX EFFECT =====
document.querySelectorAll(".gallery-btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    const galleryItem = this.closest(".gallery-item");
    const img = galleryItem.querySelector("img");
    if (img) {
      // Create lightbox
      const lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <img src="${img.src}" alt="${img.alt}">
          <button class="lightbox-close">&times;</button>
        </div>
      `;

      document.body.appendChild(lightbox);
      document.body.style.overflow = "hidden";

      // Add lightbox styles
      if (!document.getElementById("lightbox-styles")) {
        const lightboxStyles = document.createElement("style");
        lightboxStyles.id = "lightbox-styles";
        lightboxStyles.textContent = `
          .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
            cursor: zoom-out;
          }
          
          .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
          }
          
          .lightbox-content img {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 10px;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
          }
          
          .lightbox-close {
            position: absolute;
            top: -50px;
            right: 0;
            background: rgba(212, 175, 55, 0.9);
            color: #0a0a0a;
            border: none;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            font-size: 2rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }
          
          .lightbox-close:hover {
            background: #f4d03f;
            transform: scale(1.1) rotate(90deg);
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `;
        document.head.appendChild(lightboxStyles);
      }

      // Close lightbox
      lightbox.addEventListener("click", function () {
        lightbox.remove();
        document.body.style.overflow = "";
      });

      lightbox
        .querySelector(".lightbox-close")
        .addEventListener("click", function (e) {
          e.stopPropagation();
          lightbox.remove();
          document.body.style.overflow = "";
        });
    }
  });
});

// ===== SCROLL INDICATOR CLICK =====
const scrollIndicator = document.querySelector(".scroll-indicator");
if (scrollIndicator) {
  scrollIndicator.addEventListener("click", () => {
    const servicesSection = document.getElementById("servicios");
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

// ===== PERFORMANCE MONITORING =====
window.addEventListener("load", function () {
  const loadTime =
    performance.timing.loadEventEnd - performance.timing.navigationStart;
  console.log(
    `%c✂️ Barbería Premium`,
    "color: #d4af37; font-size: 24px; font-weight: bold;",
  );
  console.log(
    `%cPágina cargada en ${loadTime}ms`,
    "color: #e0e0e0; font-size: 14px;",
  );
  console.log(
    `%cTu mejor versión empieza aquí`,
    "color: #d4af37; font-size: 12px; font-style: italic;",
  );
});

// ===== ACTIVE SECTION HIGHLIGHTING IN NAV =====
const sections = document.querySelectorAll("section[id]");

function highlightNavLink() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(`a[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink?.classList.add("active");
    } else {
      navLink?.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", highlightNavLink);

// ===== CURSOR EFFECT REMOVED =====
// Custom cursor removed for better usability and compatibility

// ===== FORM VALIDATION (if you add a contact form later) =====
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = "#ff4444";
      input.style.animation = "shake 0.5s";
    } else {
      input.style.borderColor = "";
      input.style.animation = "";
    }
  });

  return isValid;
}

// Add shake animation
const shakeAnimation = document.createElement("style");
shakeAnimation.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;
document.head.appendChild(shakeAnimation);

// ===== ACCESSIBILITY ENHANCEMENTS REMOVED =====
// Removed skip-to-main-content link as requested.

console.log("🎨 All scripts initialized successfully!");

// ===== CONFIGURACIÓN DEMO =====
const CONFIG_DEMO = {
  numeroWhatsApp: "5491112345678", // Número de ejemplo
  diasAdelanto: 30,
  duracionTurno: 60,
};

// ===== RESERVAS DEMO (Simuladas) =====
function inicializarReservasDemo() {
  // Si no hay reservas guardadas, crear algunas de ejemplo
  if (!localStorage.getItem("reservasDemo")) {
    const reservasEjemplo = [
      { fecha: "2026-01-30", horario: "10:00", nombre: "Carlos Martínez" },
      { fecha: "2026-01-30", horario: "15:00", nombre: "Ana García" },
      { fecha: "2026-01-31", horario: "09:00", nombre: "Roberto Díaz" },
      { fecha: "2026-01-31", horario: "11:00", nombre: "María López" },
      { fecha: "2026-02-01", horario: "14:00", nombre: "Juan Pérez" },
    ];
    localStorage.setItem("reservasDemo", JSON.stringify(reservasEjemplo));
  }
}

function getReservasOcupadas() {
  const reservas = localStorage.getItem("reservasDemo");
  return reservas ? JSON.parse(reservas) : [];
}

function agregarReservaDemo(datos) {
  const reservas = getReservasOcupadas();
  reservas.push({
    fecha: datos.fecha,
    horario: datos.horario,
    nombre: datos.nombre,
    servicio: datos.servicio,
    telefono: datos.telefono,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("reservasDemo", JSON.stringify(reservas));
}

function estaDisponible(fecha, horario) {
  const reservas = getReservasOcupadas();
  return !reservas.some((r) => r.fecha === fecha && r.horario === horario);
}

// ===== MODAL DE RESERVA =====
function abrirFormularioReserva() {
  inicializarReservasDemo();

  const modal = document.createElement("div");
  modal.className = "modal-reserva";
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="cerrarModalReserva()">&times;</button>
      
      <div class="modal-header">
        <h2>Reservá tu Turno</h2>
      </div>
      
      <form id="form-reserva" onsubmit="procesarReservaDemo(event)">
        <div class="form-group">
          <label>Nombre Completo</label>
          <input type="text" name="nombre" required placeholder="Juan Pérez">
        </div>
        
        <div class="form-group">
          <label>Servicio</label>
          <select name="servicio" required>
            <option value="">Seleccionar servicio</option>
            <option value="Combo Completo - $12.000">Combo Completo - $12.000</option>
            <option value="Corte Premium - $8.000">Corte Premium - $8.000</option>
            <option value="Barba Profesional - $6.000">Barba Profesional - $6.000</option>
            <option value="Color & Tinte - $10.000">Color & Tinte - $10.000</option>
            <option value="Tratamiento Capilar - $7.000">Tratamiento Capilar - $7.000</option>
          </select>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Fecha</label>
            <input type="date" 
                   name="fecha" 
                   id="fecha-reserva"
                   required 
                   min="${getFechaMinima()}"
                   max="${getFechaMaxima()}"
                   onchange="actualizarHorariosDisponibles()">
          </div>
          
          <div class="form-group">
            <label>Horario</label>
            <select name="horario" id="horario-reserva" required disabled>
              <option value="">Primero selecciona una fecha</option>
            </select>
          </div>
        </div>
        
        <div class="disponibilidad-info" id="disponibilidad-info">
          <div class="info-box">
            Selecciona una fecha para ver los horarios disponibles
          </div>
        </div>
        
        <div class="form-group">
          <label>Teléfono</label>
          <input type="tel" 
                 name="telefono" 
                 required 
                 placeholder="+54 9 11 1234-5678"
                 pattern="[+0-9 -]+">
        </div>
        
        <div class="form-group">
          <label>Comentarios (opcional)</label>
          <textarea name="comentarios" 
                    rows="3" 
                    placeholder="Alguna preferencia especial..."></textarea>
        </div>
        
        <button type="submit" class="btn-submit" id="btn-enviar">
          <i class="fab fa-whatsapp"></i>
          <span>Confirmar Reserva</span>
        </button>
        
        <div class="form-footer">
          <small>Recibirás confirmación inmediata por WhatsApp</small>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";
  setTimeout(() => modal.classList.add("active"), 10);
}

function cerrarModalReserva() {
  const modal = document.querySelector(".modal-reserva");
  if (modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = "";
    }, 300);
  }
}

// ===== ACTUALIZAR HORARIOS DISPONIBLES =====
function actualizarHorariosDisponibles() {
  const fechaInput = document.getElementById("fecha-reserva");
  const horarioSelect = document.getElementById("horario-reserva");
  const infoDiv = document.getElementById("disponibilidad-info");

  if (!fechaInput.value) return;

  const fecha = fechaInput.value;
  const fechaObj = new Date(fecha + "T00:00:00");
  const diaSemana = fechaObj.getDay();
  const nombreDia = fechaObj.toLocaleDateString("es-AR", { weekday: "long" });

  // Verificar si es domingo (cerrado)
  if (diaSemana === 0) {
    horarioSelect.innerHTML = '<option value="">Cerrado los domingos</option>';
    horarioSelect.disabled = true;
    infoDiv.innerHTML = `
      <div class="alert alert-warning">
        <i class="fas fa-exclamation-triangle"></i>
        No abrimos los domingos. Por favor elige otro día.
      </div>
    `;
    return;
  }

  horarioSelect.disabled = false;

  // Horarios según el día
  let horarios;
  if (diaSemana === 6) {
    // Sábado
    horarios = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];
  } else {
    // Lunes a Viernes
    horarios = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
    ];
  }

  // Filtrar horarios disponibles
  const horariosDisponibles = [];
  const horariosOcupados = [];

  horarios.forEach((horario) => {
    if (estaDisponible(fecha, horario)) {
      horariosDisponibles.push(horario);
    } else {
      horariosOcupados.push(horario);
    }
  });

  // Actualizar select
  horarioSelect.innerHTML = '<option value="">Seleccionar horario</option>';

  if (horariosDisponibles.length === 0) {
    horarioSelect.innerHTML =
      '<option value="">😔 No hay turnos disponibles</option>';
    horarioSelect.disabled = true;
    infoDiv.innerHTML = `
      <div class="alert alert-error">
        <i class="fas fa-calendar-times"></i>
        <div>
          <strong>No hay turnos disponibles para ${nombreDia}</strong>
          <p>Todos los horarios están ocupados. Prueba con otra fecha.</p>
        </div>
      </div>
    `;
  } else {
    horariosDisponibles.forEach((horario) => {
      const option = document.createElement("option");
      option.value = horario;
      option.textContent = horario;
      horarioSelect.appendChild(option);
    });

    const disponibles = horariosDisponibles.length;
    const total = horarios.length;
    const porcentaje = Math.round((disponibles / total) * 100);

    let alertClass = "alert-success";
    let icon = "fa-check-circle";
    if (porcentaje < 30) {
      alertClass = "alert-warning";
      icon = "fa-exclamation-circle";
    }

    infoDiv.innerHTML = `
      <div class="alert ${alertClass}">
        <i class="fas ${icon}"></i>
        <div>
          <strong>${disponibles} de ${total} horarios disponibles</strong>
          ${
            horariosOcupados.length > 0
              ? `<p style="font-size: 0.85rem; margin-top: 0.3rem;">
              Ocupados: ${horariosOcupados.join(", ")}
            </p>`
              : ""
          }
        </div>
      </div>
      <div class="horarios-grid">
        ${horarios
          .map(
            (h) => `
          <div class="horario-item ${estaDisponible(fecha, h) ? "disponible" : "ocupado"}">
            <span class="hora">${h}</span>
            <span class="estado">${estaDisponible(fecha, h) ? "Disponible" : "Ocupado"}</span>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  }
}

// ===== PROCESAR RESERVA DEMO =====
function procesarReservaDemo(event) {
  event.preventDefault();

  const btnEnviar = document.getElementById("btn-enviar");
  const textoOriginal = btnEnviar.innerHTML;
  btnEnviar.disabled = true;
  btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

  const form = event.target;
  const datos = {
    nombre: form.nombre.value.trim(),
    servicio: form.servicio.value,
    fecha: form.fecha.value,
    horario: form.horario.value,
    telefono: form.telefono.value.trim(),
    comentarios: form.comentarios.value.trim(),
  };

  // Verificar disponibilidad una vez más
  if (!estaDisponible(datos.fecha, datos.horario)) {
    mostrarNotificacion(
      "Este horario acaba de ser reservado. Por favor elige otro.",
      "error",
    );
    btnEnviar.disabled = false;
    btnEnviar.innerHTML = textoOriginal;
    actualizarHorariosDisponibles();
    return;
  }

  // Simular delay de procesamiento
  setTimeout(() => {
    // Guardar la reserva
    agregarReservaDemo(datos);

    mostrarNotificacion("Reserva confirmada exitosamente", "success");

    // Mostrar confirmación
    mostrarConfirmacionReserva(datos);

    // Simular envío a WhatsApp (en demo solo se abre)
    setTimeout(() => {
      enviarPorWhatsAppDemo(datos);
    }, 1500);
  }, 1000);
}

function enviarPorWhatsAppDemo(datos) {
  const fechaFormateada = new Date(
    datos.fecha + "T00:00:00",
  ).toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mensaje = `
*NUEVA RESERVA - BARBERÍA PREMIUM*

*Nombre:* ${datos.nombre}
*Servicio:* ${datos.servicio}
*Fecha:* ${fechaFormateada}
*Horario:* ${datos.horario}
*Teléfono:* ${datos.telefono}
${datos.comentarios ? `\n*Comentarios:* ${datos.comentarios}` : ""}

_Reserva realizada desde la web_
  `.trim();

  const url = `https://wa.me/${CONFIG_DEMO.numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// ===== CONFIRMACIÓN VISUAL =====
function mostrarConfirmacionReserva(datos) {
  const modal = document.querySelector(".modal-content");

  const fechaFormateada = new Date(
    datos.fecha + "T00:00:00",
  ).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  modal.innerHTML = `
    <div class="confirmacion-reserva">
      <div class="confirmacion-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h2>¡Reserva Confirmada!</h2>
      <p class="confirmacion-subtitle">Tu turno ha sido agendado exitosamente</p>
      
      <div class="confirmacion-detalles">
        <div class="detalle-item">
          <i class="fas fa-user"></i>
          <div>
            <span class="label">Cliente</span>
            <span class="value">${datos.nombre}</span>
          </div>
        </div>
        
        <div class="detalle-item">
          <i class="fas fa-cut"></i>
          <div>
            <span class="label">Servicio</span>
            <span class="value">${datos.servicio}</span>
          </div>
        </div>
        
        <div class="detalle-item highlight">
          <i class="fas fa-calendar-check"></i>
          <div>
            <span class="label">Fecha y Hora</span>
            <span class="value">${fechaFormateada} a las ${datos.horario}</span>
          </div>
        </div>
        
        <div class="detalle-item">
          <i class="fas fa-phone"></i>
          <div>
            <span class="label">Teléfono</span>
            <span class="value">${datos.telefono}</span>
          </div>
        </div>
      </div>
      
      <div class="confirmacion-mensaje">
        <i class="fab fa-whatsapp"></i>
        <p>Te estamos redirigiendo a WhatsApp para confirmar tu reserva...</p>
      </div>
      
      <button class="btn-cerrar" onclick="cerrarModalReserva()">
        <i class="fas fa-times"></i>
        Cerrar
      </button>
    </div>
  `;
}

// ===== UTILIDADES =====
function getFechaMinima() {
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 1);
  return hoy.toISOString().split("T")[0];
}

function getFechaMaxima() {
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + CONFIG_DEMO.diasAdelanto);
  return hoy.toISOString().split("T")[0];
}

function mostrarNotificacion(mensaje, tipo = "info") {
  const notif = document.createElement("div");
  notif.className = `notificacion notif-${tipo}`;

  const iconos = {
    success: "fa-check-circle",
    error: "fa-times-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  };

  notif.innerHTML = `
    <i class="fas ${iconos[tipo]}"></i>
    <span>${mensaje}</span>
  `;

  document.body.appendChild(notif);
  setTimeout(() => notif.classList.add("show"), 100);

  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

// ===== FUNCIÓN PARA BOTONES DE RESERVA =====
function scrollToReservar() {
  abrirFormularioReserva();
}

// ===== INICIALIZAR =====
// Ya inicializado en el DOMContentLoaded principal (línea 75+)

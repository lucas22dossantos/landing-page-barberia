// ===== BARBERÍA PREMIUM - OPTIMIZED JAVASCRIPT =====

// ===== CONFIGURATION =====
const CONFIG = {
  whatsappNumber: '5493765371474', // Cambia este número
  animationOffset: 100,
  scrollThreshold: 50,
  testimonialInterval: 5000,
  reservaDaysAhead: 30
};

// ===== STATE =====
const state = {
  currentTestimonial: 0,
  testimonialTimer: null,
  isMenuOpen: false,
  reservas: [],
  lastScrollY: 0,
  touchStartY: 0
};

// ===== UTILITY FUNCTIONS =====
const utils = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  formatDate(date) {
    return new Date(date).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  isWeekday(date) {
    const day = new Date(date).getDay();
    return day !== 0; // 0 = Domingo
  },

  getAvailableHours(date) {
    const day = new Date(date).getDay();

    // Domingo cerrado
    if (day === 0) return [];

    // Sábado
    if (day === 6) {
      return ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    }

    // Lunes a Viernes
    return ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  },

  isMobile() {
    return window.innerWidth <= 768;
  },

  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
};

// ===== DOM ELEMENTS =====
const elements = {
  nav: document.getElementById('nav'),
  navToggle: document.getElementById('navToggle'),
  navMenu: document.getElementById('navMenu'),
  progressBar: document.getElementById('progressBar'),
  reservaModal: document.getElementById('reservaModal'),
  reservaForm: document.getElementById('reservaForm')
};

// ===== MOBILE OPTIMIZATIONS =====
const mobileOptimizations = {
  init() {
    this.handleTouchEvents();
    this.optimizeScrollPerformance();
    this.handleOrientation();
  },

  // func preventZoom elimated for accessibility

  handleTouchEvents() {
    // Mejorar scroll en iOS
    document.addEventListener('touchstart', (e) => {
      state.touchStartY = e.touches[0].clientY;
    }, { passive: true });

    // Prevenir scroll cuando el menú está abierto
    document.addEventListener('touchmove', (e) => {
      if (state.isMenuOpen && !elements.navMenu.contains(e.target)) {
        e.preventDefault();
      }
    }, { passive: false });
  },

  optimizeScrollPerformance() {
    // Usar requestAnimationFrame para scroll suave
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          navigation.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  },

  handleOrientation() {
    // Manejar cambios de orientación
    window.addEventListener('orientationchange', () => {
      // Cerrar menú al rotar
      if (state.isMenuOpen) {
        elements.navToggle.click();
      }

      // Recalcular alturas
      setTimeout(() => {
        document.documentElement.style.setProperty(
          '--vh',
          `${window.innerHeight * 0.01}px`
        );
      }, 100);
    });
  }
};

// ===== NAVIGATION =====
const navigation = {
  init() {
    this.handleScroll();
    this.handleToggle();
    this.handleLinks();
    this.handleClickOutside();

    // Usar throttle en lugar de debounce para mejor respuesta en móvil
    if (utils.isMobile()) {
      window.addEventListener('scroll', utils.throttle(() => this.handleScroll(), 100), { passive: true });
    } else {
      window.addEventListener('scroll', utils.debounce(() => this.handleScroll(), 10), { passive: true });
    }
  },

  handleScroll() {
    const scrolled = window.pageYOffset > CONFIG.scrollThreshold;
    elements.nav.classList.toggle('scrolled', scrolled);

    // Update progress bar con throttle
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled_percent = Math.min(100, (winScroll / height) * 100);
    elements.progressBar.style.width = scrolled_percent + '%';

    // Auto-hide nav en móvil al hacer scroll down
    if (utils.isMobile()) {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY > state.lastScrollY && currentScrollY > 100) {
        elements.nav.style.transform = 'translateY(-100%)';
      } else {
        elements.nav.style.transform = 'translateY(0)';
      }
      state.lastScrollY = currentScrollY;
    }
  },

  handleToggle() {
    elements.navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });
  },

  toggleMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    elements.navToggle.classList.toggle('active', state.isMenuOpen);
    elements.navMenu.classList.toggle('active', state.isMenuOpen);
    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';

    // Agregar haptic feedback en dispositivos compatibles
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  },

  handleLinks() {
    const links = document.querySelectorAll('.nav__link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        const section = document.querySelector(target);

        if (section) {
          // Offset para la navegación fija
          const offset = utils.isMobile() ? 70 : 80;
          const targetPosition = section.offsetTop - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }

        // Close mobile menu
        if (state.isMenuOpen) {
          this.toggleMenu();
        }

        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(5);
        }
      });
    });
  },

  handleClickOutside() {
    document.addEventListener('click', (e) => {
      if (state.isMenuOpen &&
        !elements.navMenu.contains(e.target) &&
        !elements.navToggle.contains(e.target)) {
        this.toggleMenu();
      }
    });
  }
};

// ===== ANIMATIONS =====
const animations = {
  init() {
    this.observeElements();
    this.animateCounters();
  },

  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, {
      threshold: utils.isMobile() ? 0.05 : 0.1,
      rootMargin: utils.isMobile() ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
    });

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });
  },

  animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  },

  animateCounter(element) {
    const target = parseFloat(element.dataset.count);
    const isDecimal = element.dataset.decimal !== undefined;
    const duration = utils.isMobile() ? 1500 : 2000; // Más rápido en móvil
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
      }
    };

    updateCounter();
  }
};

// ===== TESTIMONIALS =====
const testimonials = {
  init() {
    this.elements = {
      items: document.querySelectorAll('.testimonial-card'),
      dotsContainer: document.getElementById('testimonialDots'),
      slider: document.querySelector('.testimonials__track')
    };

    if (this.elements.items.length > 0) {
      this.generateDots();
      this.show(0);
      this.startAutoRotate();
      this.handleKeyboard();
      this.handleSwipe();
    }
  },

  generateDots() {
    if (!this.elements.dotsContainer) return;
    this.elements.dotsContainer.innerHTML = '';
    this.elements.items.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Ver testimonio ${index + 1}`);
      dot.onclick = () => {
        this.show(index);
        this.stopAutoRotate();
      };
      this.elements.dotsContainer.appendChild(dot);
    });
    this.elements.dots = this.elements.dotsContainer.querySelectorAll('button');
  },

  show(index) {
    this.elements.items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    if (this.elements.dots && this.elements.dots.length) {
      this.elements.dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    state.currentTestimonial = index;
  },

  change(direction) {
    const total = this.elements.items.length;
    let newIndex = state.currentTestimonial + direction;

    if (newIndex < 0) newIndex = total - 1;
    if (newIndex >= total) newIndex = 0;

    this.show(newIndex);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  },

  startAutoRotate() {
    state.testimonialTimer = setInterval(() => {
      this.change(1);
    }, CONFIG.testimonialInterval);
  },

  stopAutoRotate() {
    if (state.testimonialTimer) {
      clearInterval(state.testimonialTimer);
    }
  },

  handleKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.change(-1);
        this.stopAutoRotate();
      } else if (e.key === 'ArrowRight') {
        this.change(1);
        this.stopAutoRotate();
      }
    });
  },

  handleSwipe() {
    if (!utils.isTouchDevice() || !this.elements.slider) return;

    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;

    this.elements.slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    this.elements.slider.addEventListener('touchmove', (e) => {
      distX = e.touches[0].clientX - startX;
      distY = e.touches[0].clientY - startY;
    }, { passive: true });

    this.elements.slider.addEventListener('touchend', () => {
      // Verificar que el swipe es horizontal
      if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 50) {
        if (distX > 0) {
          this.change(-1); // Swipe right
        } else {
          this.change(1); // Swipe left
        }
        this.stopAutoRotate();
      }
      distX = 0;
      distY = 0;
    });
  }
};

// Make testimonial functions global for HTML onclick
window.changeTestimonial = (direction) => testimonials.change(direction);
window.goToTestimonial = (index) => testimonials.show(index);
window.previousTestimonial = () => testimonials.change(-1);
window.nextTestimonial = () => testimonials.change(1);

// ===== MOCK SCHEDULER (Sincronizado con Admin) =====
const MockScheduler = {
  getAvailableSlots(dateStr, serviceName, selectedBarberName = 'Cualquiera') {
    if (typeof SistemaReservas === 'undefined') return { slots: [], duration: 30 };

    // Obtener horarios desde el sistema unificado
    const slots = SistemaReservas.obtenerHorariosDisponibles(dateStr, serviceName, selectedBarberName);
    return {
      slots: slots,
      duration: 30
    };
  }
};

// ===== MOCK API SYSTEM (Sincronizado con Admin) =====
const api = {
  submitBooking(data) {
    console.log('--- ENVIANDO RESERVA AL SISTEMA UNIFICADO ---');
    console.table(data);

    return new Promise((resolve) => {
      setTimeout(() => {
        if (typeof SistemaReservas !== 'undefined') {
          const result = SistemaReservas.crearReserva({
            nombre: data.nombre,
            telefono: data.telefono,
            barbero: data.barbero,
            servicio: data.servicio,
            fecha: data.fecha,
            horario: data.horario,
            comentarios: data.comentarios
          });

          if (result.exito) {
            resolve({ success: true, bookingId: result.reserva.id });
          } else {
            console.error("Error en SistemaReservas:", result.error);
            resolve({ success: false, error: result.error });
          }
        } else {
          resolve({ success: true, bookingId: 'OFFLINE-' + Math.random().toString(36).substr(2, 5).toUpperCase() });
        }
      }, 1000);
    });
  }
};

// ===== RESERVA MODAL =====
const reservaModal = {
  init() {
    this.setupDateInput();
    this.setupFormHandlers();
  },

  setupDateInput() {
    const fechaInput = document.getElementById('fecha');
    if (!fechaInput) return;

    // Set min and max dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    fechaInput.min = tomorrow.toISOString().split('T')[0];

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + CONFIG.reservaDaysAhead);
    fechaInput.max = maxDate.toISOString().split('T')[0];

    // Al cambiar fecha, intentar buscar
    fechaInput.addEventListener('change', () => {
      this.checkAvailability();
    });
  },

  setupFormHandlers() {
    const formsRefs = ['servicio', 'barbero', 'fecha'];
    formsRefs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => {
        if (id === 'servicio') this.updateSummary();
        this.checkAvailability();
      });
    });

    if (window.selectedService) {
      document.getElementById('servicio').value = window.selectedService;
      this.updateSummary();
    }
  },

  checkAvailability() {
    const fechaInput = document.getElementById('fecha');
    const servicioSelect = document.getElementById('servicio');
    const barberoSelect = document.getElementById('barbero');

    if (fechaInput.value && servicioSelect.value) {
      this.updateAvailableHours(fechaInput.value, servicioSelect.value, barberoSelect.value);
    }
  },

  updateAvailableHours(date, serviceName, barberName) {
    const horarioSelect = document.getElementById('horario');
    const feedbackMsg = document.getElementById('availabilityFeedback') || this.createFeedbackElement(horarioSelect);

    if (!horarioSelect) return;

    horarioSelect.innerHTML = '<option value="">Consultando...</option>';
    horarioSelect.disabled = true;
    feedbackMsg.textContent = '⏳ Verificando agenda...';
    feedbackMsg.className = 'availability-feedback loading';
    feedbackMsg.style.display = 'block';

    setTimeout(() => {
      const result = MockScheduler.getAvailableSlots(date, serviceName, barberName);
      horarioSelect.innerHTML = '<option value="">Seleccionar horario</option>';
      horarioSelect.disabled = false;

      if (result.error) {
        feedbackMsg.textContent = `🚫 ${result.error}`;
        feedbackMsg.className = 'availability-feedback error';
        return;
      }

      const hours = result.slots;
      if (!hours || hours.length === 0) {
        feedbackMsg.textContent = '⚠️ Sin cupos para esta selección.';
        feedbackMsg.className = 'availability-feedback error';

        const option = document.createElement('option');
        option.textContent = "Sin disponibilidad";
        option.disabled = true;
        horarioSelect.appendChild(option);
      } else {
        hours.forEach(hour => {
          const option = document.createElement('option');
          option.value = hour;
          option.textContent = hour;
          horarioSelect.appendChild(option);
        });
        feedbackMsg.textContent = `✅ ${hours.length} turnos encontrados (${result.duration}m)`;
        feedbackMsg.className = 'availability-feedback success';
      }
    }, 600);
  },

  createFeedbackElement(referenceElement) {
    const div = document.createElement('div');
    div.id = 'availabilityFeedback';
    div.style.fontSize = '0.85rem';
    div.style.marginTop = '0.5rem';
    div.style.fontWeight = '500';
    div.style.transition = 'all 0.3s ease';
    referenceElement.parentNode.appendChild(div);
    return div;
  },

  updateSummary() {
    const servicioSelect = document.getElementById('servicio');
    const summaryService = document.getElementById('summaryService');
    const summaryPrice = document.getElementById('summaryPrice');

    if (!servicioSelect || !summaryService || !summaryPrice) return;

    const selectedOption = servicioSelect.options[servicioSelect.selectedIndex];

    if (servicioSelect.value) {
      // Extraer nombre y precio del texto de la opción (ej: "Corte - $8.000")
      const text = selectedOption.text;
      const parts = text.split(' - ');

      if (parts.length >= 2) {
        summaryService.textContent = parts[0];
        summaryPrice.textContent = parts[1];

        // Animación sutil
        summaryPrice.style.transform = 'scale(1.1)';
        setTimeout(() => summaryPrice.style.transform = 'scale(1)', 200);
      } else {
        summaryService.textContent = text;
        summaryPrice.textContent = '-';
      }
    } else {
      summaryService.textContent = 'Seleccione un servicio';
      summaryPrice.textContent = '-';
    }
  },

  open() {
    elements.reservaModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus en el primer input en desktop
    if (!utils.isMobile()) {
      setTimeout(() => {
        const firstInput = elements.reservaModal.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 300);
    }

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  },

  close() {
    elements.reservaModal.classList.remove('active');
    document.body.style.overflow = '';

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  },

  handleSubmit(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

    const formData = new FormData(event.target);
    const data = {
      nombre: formData.get('nombre'),
      telefono: formData.get('telefono'),
      barbero: formData.get('barbero'),
      servicio: formData.get('servicio'),
      fecha: formData.get('fecha'),
      horario: formData.get('horario'),
      comentarios: formData.get('comentarios'),
      submittedAt: new Date().toISOString()
    };

    api.submitBooking(data).then(response => {
      this.close();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      window.lastBookingData = data;

      // Mostrar confirmación en el modal de éxito
      // Nota: Ya no se abre WhatsApp automáticamente para evitar confusiones al cliente.
      // El barbero recibirá la alerta en el panel y confirmará desde allí.
      this.showConfirmation(data, response.bookingId);
    });
  },

  showConfirmation(data, id) {
    const modal = document.getElementById('successModal');
    const details = document.getElementById('successDetails');

    details.innerHTML = `
      <div class="success-detail-item">
        <span class="success-detail-label">ID Reserva:</span>
        <span class="success-detail-value">#${id}</span>
      </div>
      <div class="success-detail-item">
        <span class="success-detail-label">Servicio:</span>
        <span class="success-detail-value">${data.servicio}</span>
      </div>
      <div class="success-detail-item">
        <span class="success-detail-label">Barbero:</span>
        <span class="success-detail-value">${data.barbero}</span>
      </div>
      <div class="success-detail-item">
        <span class="success-detail-label">Día:</span>
        <span class="success-detail-value">${utils.formatDate(data.fecha)}</span>
      </div>
      <div class="success-detail-item">
        <span class="success-detail-label">Hora:</span>
        <span class="success-detail-value">${data.horario} hs</span>
      </div>
    `;

    modal.classList.add('active');
    if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
  }
};

// Global helpers for success modal
window.closeSuccessModal = () => document.getElementById('successModal').classList.remove('active');
window.confirmBookingWhatsApp = () => {
  const data = window.lastBookingData;
  if (!data) return;

  const mensaje = [
    "*CONFIRMACIÓN DE TURNO*",
    "Hola! He reservado vía web y quiero confirmar los detalles:",
    "",
    `*Nombre:* ${data.nombre}`,
    `*Barbero:* ${data.barbero}`,
    `*Servicio:* ${data.servicio}`,
    `*Fecha:* ${utils.formatDate(data.fecha)}`,
    `*Horario:* ${data.horario} hs`,
    "",
    "_¡Nos vemos pronto!_"
  ].join('\n');

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
};


// Make modal functions global for HTML onclick
window.openReservaModal = () => reservaModal.open();
window.closeReservaModal = () => reservaModal.close();
window.handleReserva = (e) => reservaModal.handleSubmit(e);

// ===== SERVICE SELECTION =====
window.selectService = (serviceName) => {
  window.selectedService = serviceName;
  reservaModal.open();
};

// ===== WHATSAPP =====
window.openWhatsApp = () => {
  const mensaje = '¡Hola! Me gustaría consultar sobre los servicios de la barbería.';
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');

  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
};

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = utils.isMobile() ? 70 : 80;
      const targetPosition = target.offsetTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== INITIALIZATION =====
const init = () => {
  navigation.init();
  animations.init();
  testimonials.init();
  reservaModal.init();

  // Mobile-specific optimizations
  if (utils.isMobile() || utils.isTouchDevice()) {
    mobileOptimizations.init();
  }

  // Set CSS custom property for viewport height (fix iOS)
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVH();
  window.addEventListener('resize', utils.debounce(setVH, 100));

  setVH();
  window.addEventListener('resize', utils.debounce(setVH, 100));
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: utils.isMobile() ? '50px' : '100px'
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Prevenir zoom accidental en inputs en iOS
if (utils.isMobile() && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport) {
    viewport.setAttribute('content',
      'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
    );
  }
}

// Service Worker registration (optional - for PWA)
if ('serviceWorker' in navigator && !utils.isMobile()) {
  window.addEventListener('load', () => {
    // Uncomment if you have a service worker
    // navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

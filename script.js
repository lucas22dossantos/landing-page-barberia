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
window.addEventListener("scroll", function () {
  const scrollProgressBar = document.querySelector(".scroll-progress-bar");
  if (scrollProgressBar) {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgressBar.style.width = scrolled + "%";
  }
});

// ===== SMOOTH SCROLL FUNCTIONS =====
function scrollToReservar() {
  const contactSection = document.getElementById("contacto");
  if (contactSection) {
    contactSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

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
    "¡Hola! Me gustaría reservar un turno en Barbería Premium."
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
      ".service-card, .gallery-item, .about-feature-item, .contact-item"
    )
    .forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      element.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      observer.observe(element);
    });
}

// ===== BUTTON RIPPLE EFFECT =====
document.querySelectorAll("button, .btn-service, .btn-hero").forEach((button) => {
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

      lightbox.querySelector(".lightbox-close").addEventListener("click", function (e) {
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
    "color: #d4af37; font-size: 24px; font-weight: bold;"
  );
  console.log(
    `%cPágina cargada en ${loadTime}ms`,
    "color: #e0e0e0; font-size: 14px;"
  );
  console.log(
    `%cTu mejor versión empieza aquí`,
    "color: #d4af37; font-size: 12px; font-style: italic;"
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

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Add skip to main content link
const skipLink = document.createElement("a");
skipLink.href = "#servicios";
skipLink.textContent = "Saltar al contenido principal";
skipLink.className = "skip-link";
skipLink.style.cssText = `
  position: absolute;
  top: -40px;
  left: 0;
  background: #d4af37;
  color: #0a0a0a;
  padding: 8px;
  text-decoration: none;
  z-index: 10000;
  font-weight: 600;
`;
skipLink.addEventListener("focus", function () {
  this.style.top = "0";
});
skipLink.addEventListener("blur", function () {
  this.style.top = "-40px";
});
document.body.insertBefore(skipLink, document.body.firstChild);

console.log("🎨 All scripts initialized successfully!");

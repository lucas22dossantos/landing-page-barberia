// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
  easing: "ease-in-out",
});

// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Smooth scroll function
function scrollToReservar() {
  const reservarSection = document.getElementById("reservar");
  if (reservarSection) {
    reservarSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Testimonial slider
let currentTestimonialIndex = 0;
const testimonials = document.querySelectorAll(".testimonial-card");
const dots = document.querySelectorAll(".dot");

function showTestimonial(index) {
  // Hide all testimonials
  testimonials.forEach((testimonial) => {
    testimonial.classList.remove("active");
  });

  // Remove active class from all dots
  dots.forEach((dot) => {
    dot.classList.remove("active");
  });

  // Show selected testimonial
  if (testimonials[index]) {
    testimonials[index].classList.add("active");
    dots[index].classList.add("active");
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
const testimonialContainer = document.querySelector(".testimonial-container");
if (testimonialContainer) {
  testimonialContainer.addEventListener("mouseenter", () => {
    clearInterval(testimonialInterval);
  });

  testimonialContainer.addEventListener("mouseleave", () => {
    testimonialInterval = setInterval(() => {
      changeTestimonial(1);
    }, 5000);
  });
}

// WhatsApp function
function openWhatsApp() {
  const phoneNumber = "5491112345678"; // Replace with actual phone number
  const message = encodeURIComponent("Hola! Me gustaría reservar un turno.");
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappURL, "_blank");
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Intersection Observer for fade-in animations on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe service cards for additional animations
document.querySelectorAll(".service-card, .feature-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});

// Gallery image hover effect
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("mouseenter", function () {
    this.style.zIndex = "10";
  });

  item.addEventListener("mouseleave", function () {
    this.style.zIndex = "1";
  });
});

// Add click effect to buttons
document.querySelectorAll("button, .btn-service").forEach((button) => {
  button.addEventListener("click", function (e) {
    // Create ripple effect
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
const style = document.createElement("style");
style.textContent = `
    button, .btn-service {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
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
document.head.appendChild(style);

// Form validation (if you add a contact form later)
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = "#ff4444";
    } else {
      input.style.borderColor = "";
    }
  });

  return isValid;
}

// Lazy loading for images (when you add real images)
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

// Console welcome message
console.log(
  "%c✂️ Barbería Premium",
  "color: #d4af37; font-size: 24px; font-weight: bold;",
);
console.log(
  "%cTu mejor versión empieza aquí",
  "color: #e0e0e0; font-size: 14px;",
);

// Performance monitoring
window.addEventListener("load", function () {
  const loadTime =
    performance.timing.loadEventEnd - performance.timing.navigationStart;
  console.log(`Page loaded in ${loadTime}ms`);
});

// FAQ Accordion function
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

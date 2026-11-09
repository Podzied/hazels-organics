/* ========================================
   Hazel Organics — main.js
   Scroll animations, parallax, nav, mobile menu
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // — Scroll reveal (Intersection Observer) —
  const revealElements = document.querySelectorAll('.reveal, .reveal-image');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // — Nav scroll state —
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero');
  let navScrolled = false;

  function updateNav() {
    const scrollY = window.scrollY;
    const threshold = hero ? hero.offsetHeight * 0.7 : 100;

    if (scrollY > threshold && !navScrolled) {
      nav.classList.add('scrolled');
      navScrolled = true;
    } else if (scrollY <= threshold && navScrolled) {
      nav.classList.remove('scrolled');
      navScrolled = false;
    }
  }

  // — Parallax on hero bg and product images —
  const heroBg = document.querySelector('.hero-bg');
  const parallaxImages = document.querySelectorAll('.product-img-inner, .story-img-inner');

  function updateParallax() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    if (heroBg) {
      const heroProgress = Math.min(scrollY / vh, 1);
      heroBg.style.transform = `translateY(${heroProgress * 80}px) scale(${1 + heroProgress * 0.05})`;
    }

    parallaxImages.forEach(img => {
      const rect = img.parentElement.getBoundingClientRect();
      const visible = rect.top < vh && rect.bottom > 0;

      if (visible) {
        const progress = (vh - rect.top) / (vh + rect.height);
        const offset = (progress - 0.5) * 60;
        img.style.transform = `translateY(${offset}px)`;
      }
    });
  }

  // — Smooth scroll for anchor links —
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // — Mobile menu —
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  let menuOpen = false;

  function openMobileMenu() {
    menuOpen = true;
    toggle.classList.add('active');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    menuOpen = false;
    toggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      menuOpen ? closeMobileMenu() : openMobileMenu();
    });
  }

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // — RAF scroll handler —
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNav();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  updateNav();
  updateParallax();
});

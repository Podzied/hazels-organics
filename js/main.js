/* ========================================
   Hazels Organics — main.js
   Scroll reveals, nav, mobile menu, parallax
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // — Scroll Reveal (IntersectionObserver) —
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // — Nav scroll state —
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero');
  const announcement = document.querySelector('.announcement');
  let navScrolled = false;

  function updateNav() {
    const scrollY = window.scrollY;
    const threshold = hero ? hero.offsetHeight * 0.6 : 100;

    if (scrollY > threshold && !navScrolled) {
      nav.classList.add('scrolled');
      navScrolled = true;
    } else if (scrollY <= threshold && navScrolled) {
      nav.classList.remove('scrolled');
      navScrolled = false;
    }

    if (announcement) {
      if (scrollY > 40) {
        document.body.classList.remove('has-announcement');
      } else {
        document.body.classList.add('has-announcement');
      }
    }
  }

  // — Hero parallax —
  const heroBg = document.querySelector('.hero-bg');

  function updateParallax() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    if (heroBg && scrollY < vh) {
      const progress = scrollY / vh;
      heroBg.style.transform = `translateY(${progress * 60}px) scale(${1 + progress * 0.04})`;
    }
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
        const offset = nav.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
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
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    menuOpen = false;
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
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

  // — Newsletter form —
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
      input.value = '';
      input.placeholder = "You're in!";
      btn.textContent = 'Done';
      btn.style.background = 'var(--accent)';
    });
  }

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

/* =========================================================
   DURAI V — PORTFOLIO SCRIPT
   Handles: mobile nav, active-link highlighting, scroll
   reveal, terminal typing effect, back-to-top, contact form
   validation (front-end only).
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is tapped (mobile)
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active nav-link highlighting on scroll ---------- */
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const setActiveLink = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Terminal typing effect ---------- */
  const typedLine = document.getElementById('typedLine');
  const phrases = [
    'build --project "portfolio"',
    'open-to work: true',
    'learning: always'
  ];

  if (typedLine && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        typedLine.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1600);
          return;
        }
      } else {
        charIndex--;
        typedLine.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 35 : 65);
    };

    setTimeout(type, 500);
  } else if (typedLine) {
    typedLine.textContent = phrases[0];
  }

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 480);
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    const fields = {
      name: { el: document.getElementById('cf-name'), err: document.getElementById('err-name') },
      email: { el: document.getElementById('cf-email'), err: document.getElementById('err-email') },
      subject: { el: document.getElementById('cf-subject'), err: document.getElementById('err-subject') },
      message: { el: document.getElementById('cf-message'), err: document.getElementById('err-message') }
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (key) => {
      const { el, err } = fields[key];
      const value = el.value.trim();
      let message = '';

      if (!value) {
        message = 'This field is required.';
      } else if (key === 'email' && !emailPattern.test(value)) {
        message = 'Enter a valid email address.';
      } else if (key === 'message' && value.length < 10) {
        message = 'Message should be at least 10 characters.';
      }

      err.textContent = message;
      el.closest('.form-row').classList.toggle('invalid', Boolean(message));
      return !message;
    };

    Object.keys(fields).forEach(key => {
      fields[key].el.addEventListener('blur', () => validateField(key));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successMsg.textContent = '';

      const results = Object.keys(fields).map(validateField);
      const allValid = results.every(Boolean);

      if (allValid) {
        successMsg.textContent =
          'Thanks! This is a front-end demo, so nothing was sent yet — connect a backend or form service to enable real delivery.';
        form.reset();
      } else {
        successMsg.textContent = '';
        const firstInvalid = form.querySelector('.form-row.invalid input, .form-row.invalid textarea');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

});

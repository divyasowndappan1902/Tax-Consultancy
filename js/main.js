/**
 * STERLING & CO. TAX ADVISORS - MAIN CLIENT ENGINE
 * Handles: Lenis Smooth Scroll, Custom Cursor & Magnetic Buttons,
 * Page Transitions, Preloader, Navbar Shrink, Mobile Menu,
 * Text Splitting, GSAP ScrollTrigger Orchestration, Toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Initialize Theme (White Mode default)
  initTheme();

  // 1. Initialize Lenis Smooth Scroll
  initSmoothScroll();

  // 2. Preloader Animation
  initPreloader();

  // 3. Custom Cursor & Magnetic Elements
  initCustomCursor();

  // 4. Navbar Scroll & Mobile Menu
  initNavbar();

  // 5. Page Transitions
  initPageTransitions();

  // 6. GSAP Scroll Animations & Reveals
  initScrollAnimations();

  // 7. General Micro-interactions & Toasts
  initGlobalEvents();
});

/* --------------------------------------------------------------------------
   0. THEME TOGGLE ENGINE (White Mode / Dark Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem('sterling_theme');
  // Default to 'light' (White Mode) as requested
  const currentTheme = savedTheme ? savedTheme : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const active = document.documentElement.getAttribute('data-theme');
      const newTheme = active === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sterling_theme', newTheme);

      if (typeof showToast === 'function') {
        showToast(
          newTheme === 'light' 
            ? 'Switched to White Luxury Mode' 
            : 'Switched to Midnight Navy Mode', 
          'info'
        );
      }
    });
  });
}

/* --------------------------------------------------------------------------
   1. LENIS SMOOTH SCROLL
   -------------------------------------------------------------------------- */
let lenis = null;
function initSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize Lenis with GSAP ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }
}

/* --------------------------------------------------------------------------
   2. PRELOADER
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.querySelector('.preloader-bar');
  const percentEl = document.querySelector('.preloader-percent');

  if (!preloader) {
    triggerHeroReveal();
    return;
  }

  // Check if session has already seen preloader
  const hasVisited = sessionStorage.getItem('sterling_visited');
  let progress = 0;
  const speed = hasVisited ? 15 : 25; // faster if already visited

  const timer = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress > 100) progress = 100;

    if (bar) bar.style.width = `${progress}%`;
    if (percentEl) percentEl.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        preloader.classList.add('loaded');
        sessionStorage.setItem('sterling_visited', 'true');
        // Trigger hero animations once preloader is hidden
        triggerHeroReveal();
      }, 350);
    }
  }, speed);
}

/* --------------------------------------------------------------------------
   3. CUSTOM CURSOR & MAGNETIC EFFECT
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  // Only initialize on devices that support hover
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Smooth lerp for ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .glass-card, .clickable');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Magnetic Button Effect on .btn-gold & .magnetic
  const magneticEls = document.querySelectorAll('.btn-gold, .btn-login-outline, .magnetic');
  magneticEls.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   4. NAVBAR SCROLL & FULLSCREEN MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = toggleBtn.classList.toggle('is-active');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      if (isOpen && typeof gsap !== 'undefined') {
        gsap.fromTo(
          '.mobile-nav-link',
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
        );
      }
    });

    // Close menu when clicking link
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('is-active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   5. PAGE TRANSITIONS (Overlay Curtain)
   -------------------------------------------------------------------------- */
function initPageTransitions() {
  const transitionOverlay = document.getElementById('page-transition');
  if (!transitionOverlay) return;

  // Intercept internal links
  const links = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetUrl = link.getAttribute('href');
      if (!targetUrl) return;

      // Check if it links to an HTML file
      if (targetUrl.includes('.html')) {
        const [targetPath, targetHash] = targetUrl.split('#');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        // If linking to an anchor on the current page, let browser/Lenis handle scroll without page wipe
        if (targetPath === currentPath || (currentPath === '' && targetPath === 'index.html')) {
          if (targetHash) {
            const anchorTarget = document.getElementById(targetHash);
            if (anchorTarget) {
              e.preventDefault();
              if (lenis) {
                lenis.scrollTo(anchorTarget);
              } else {
                anchorTarget.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }
          return;
        }

        e.preventDefault();
        if (typeof gsap !== 'undefined') {
          gsap.timeline()
            .set(transitionOverlay, { display: 'flex', y: '100%' })
            .to(transitionOverlay, {
              y: '0%',
              duration: 0.5,
              ease: 'power3.inOut',
              onComplete: () => {
                window.location.href = targetUrl;
              }
            });
        } else {
          window.location.href = targetUrl;
        }
      }
    });
  });

  // Page Entry Wipe
  if (typeof gsap !== 'undefined') {
    gsap.timeline()
      .set(transitionOverlay, { display: 'flex', y: '0%' })
      .to(transitionOverlay, {
        y: '-100%',
        duration: 0.65,
        ease: 'power3.inOut',
        delay: 0.1,
        onComplete: () => {
          gsap.set(transitionOverlay, { display: 'none' });
        }
      });
  }
}

/* --------------------------------------------------------------------------
   6. GSAP SCROLL ANIMATIONS & REVEALS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Split-text utility for headings with data-split while preserving child markup
  document.querySelectorAll('[data-split]').forEach((heading) => {
    // If element doesn't have complex nested markup, split by word
    // Helper to wrap text nodes in animated spans
    function splitTextNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return; // whitespace only
        const words = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();
        words.forEach((part) => {
          if (part.trim() === '') {
            fragment.appendChild(document.createTextNode(part));
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'split-word';
            wordSpan.style.display = 'inline-block';
            wordSpan.style.overflow = 'hidden';
            wordSpan.style.verticalAlign = 'top';

            const innerSpan = document.createElement('span');
            innerSpan.className = 'split-inner';
            innerSpan.style.display = 'inline-block';
            innerSpan.textContent = part;

            wordSpan.appendChild(innerSpan);
            fragment.appendChild(wordSpan);
          }
        });
        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(splitTextNodes);
      }
    }

    splitTextNodes(heading);

    // If it's a section heading (not in hero), animate with ScrollTrigger
    if (!heading.closest('.hero-home')) {
      const inners = heading.querySelectorAll('.split-inner');
      if (inners.length > 0) {
        gsap.fromTo(
          inners,
          { y: '100%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }
  });

  // Staggered card entrances
  document.querySelectorAll('.stagger-grid').forEach((grid) => {
    const cards = grid.children;
    gsap.from(cards, {
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    });
  });

  // Image Reveals (Clip-path Wipe)
  const imageWrappers = document.querySelectorAll('.image-reveal-wrapper');
  imageWrappers.forEach((wrapper) => {
    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top 80%',
      onEnter: () => wrapper.classList.add('revealed')
    });
  });

  // Parallax subtle floating elements
  document.querySelectorAll('[data-parallax-speed]').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.2;
    gsap.to(el, {
      y: () => -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

// Trigger hero split-text and badges once preloader finishes
function triggerHeroReveal() {
  if (typeof gsap === 'undefined') return;

  const heroHeadlineInners = document.querySelectorAll('.hero-headline .split-inner');
  if (heroHeadlineInners.length > 0) {
    gsap.fromTo(
      heroHeadlineInners,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.9, stagger: 0.05, ease: 'power4.out' }
    );
  }

  gsap.fromTo(
    ['.hero-badge', '.hero-lead', '.hero-ctas', '.hero-stats-row'],
    { y: 25, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
  );

  gsap.fromTo(
    '.hero-image-card',
    { scale: 0.92, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.3 }
  );
}

/* --------------------------------------------------------------------------
   7. GLOBAL INTERACTIONS & TOAST SYSTEM
   -------------------------------------------------------------------------- */
function initGlobalEvents() {
  // Global Toast Container creation if needed
  if (!document.getElementById('toast-container')) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Newsletter Forms
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value.trim() && input.checkValidity()) {
        showToast('Thank you for subscribing to Sterling & Co. Executive Briefs.', 'success');
        input.value = '';
      } else {
        showToast('Please enter a valid executive email address.', 'error');
      }
    });
  });
}

/**
 * Universal Toast Notification Function
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconSvg = type === 'success' 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#289E84" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A24B" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-show'));

  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

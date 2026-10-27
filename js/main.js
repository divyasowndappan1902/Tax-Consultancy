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

  // 2. GSAP Scroll Animations & Reveals (Split headings first so elements are ready)
  initScrollAnimations();

  // 3. Preloader Animation
  initPreloader();

  // 4. Custom Cursor & Magnetic Elements
  initCustomCursor();

  // 5. Navbar Scroll & Mobile Menu
  initNavbar();

  // 6. Page Transitions
  initPageTransitions();

  // 7. General Micro-interactions & Toasts
  initGlobalEvents();

  // 8. Hero Slideshow Carousel (Stackly Reference Style)
  initHeroCarousel();

  // 9. Safety hero reveal trigger if preloader was dismissed
  setTimeout(() => {
    const headline = document.querySelector('.hero-headline');
    if (headline && !headline.classList.contains('is-revealed')) {
      triggerHeroReveal();
    }
  }, 1200);
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

  // Heading selector for all section titles across every page
  const sectionHeadings = document.querySelectorAll(
    '[data-split], .section-header h2, .section-header h3, .section-title, .story-text h2, .featured-post-content h2, .cta-banner-card h2'
  );

  sectionHeadings.forEach((heading) => {
    // If element already has split spans or is pre-split, mark and skip re-splitting
    if (heading.classList.contains('is-split') || heading.querySelector('.split-word')) {
      heading.classList.add('is-split');
      return;
    }
    heading.classList.add('is-split');

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

    // If it's a section heading (not in hero-home or page-hero), animate with ScrollTrigger
    if (!heading.closest('.hero-home') && !heading.closest('.page-hero')) {
      const inners = heading.querySelectorAll('.split-inner');
      if (inners.length > 0) {
        gsap.fromTo(
          inners,
          {
            y: '110%',
            rotate: 2,
            opacity: 0
          },
          {
            y: '0%',
            rotate: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.035,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 88%',
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
    gsap.fromTo(
      cards,
      { y: 30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'all'
      }
    );
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
  const headline = document.querySelector('.hero-headline');
  const heroHeadlineInners = document.querySelectorAll('.hero-headline .split-inner');
  const pageHeroInners = document.querySelectorAll('.page-hero h1 .split-inner');

  if (typeof gsap !== 'undefined') {
    // 1. Home Page Hero Animation
    if (heroHeadlineInners.length > 0) {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: () => {
          if (headline) headline.classList.add('is-revealed');
        }
      });

      // Luxury Badge subtle entrance
      tl.fromTo(
        '.hero-badge',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        0.05
      );

      // Headline Words Staggered Reveal Upward Through Mask
      tl.fromTo(
        heroHeadlineInners,
        { y: '115%', rotate: 2.5, opacity: 0 },
        {
          y: '0%',
          rotate: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.055
        },
        0.1
      );

      // Lead description & CTAs & Stats
      tl.fromTo(
        ['.hero-lead', '.hero-ctas', '.hero-stats-row', '.hero-rail'],
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power3.out' },
        0.45
      );

      // Hero carousel / image card
      tl.fromTo(
        ['.hero-image-card', '.hero-media', '.hero-carousel-container'],
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.05, ease: 'power3.out' },
        0.25
      );
    }

    // 2. Secondary Pages Hero Animation (about.html, services.html, blog.html, contact.html)
    if (pageHeroInners.length > 0) {
      const pageTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      pageTl.fromTo(
        ['.page-hero .badge-luxury', '.page-hero .badge-emerald'],
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.05
      );
      pageTl.fromTo(
        pageHeroInners,
        { y: '110%', rotate: 2, opacity: 0 },
        { y: '0%', rotate: 0, opacity: 1, duration: 0.95, stagger: 0.035 },
        0.12
      );
      pageTl.fromTo(
        '.page-hero-lead',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.35
      );
    }

    // 3. Refresh ScrollTrigger so all section headings calibrate accurately after preloader dissolves
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  } else {
    // Pure CSS fallback
    if (headline) headline.classList.add('is-revealed');
    document.querySelectorAll('.hero-badge, .hero-lead, .hero-ctas, .hero-stats-row, .hero-rail, .hero-image-card, .page-hero .badge-luxury, .page-hero h1, .page-hero-lead').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
}

/* --------------------------------------------------------------------------
   6.5 HERO CAROUSEL ROTATION (Stackly Reference Style)
   -------------------------------------------------------------------------- */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const counter = document.getElementById('heroCounter');
  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;
  const ROTATE_INTERVAL = 3500;

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function setSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === currentIndex);
    });
    dots.forEach((dot, i) => {
      const active = i === currentIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    if (counter) {
      counter.textContent = `${pad(currentIndex + 1)} / ${pad(slides.length)}`;
    }
  }

  function startRotation() {
    stopRotation();
    timer = setInterval(() => {
      setSlide(currentIndex + 1);
    }, ROTATE_INTERVAL);
  }

  function stopRotation() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      setSlide(i);
      startRotation();
    });
  });

  const mediaEl = document.getElementById('heroMedia');
  if (mediaEl) {
    mediaEl.addEventListener('mouseenter', stopRotation);
    mediaEl.addEventListener('mouseleave', startRotation);
  }

  startRotation();
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
    ? `<i class="fa-solid fa-circle-check" style="color:#289E84; font-size:1.25rem;"></i>`
    : `<i class="fa-solid fa-circle-exclamation" style="color:#C9A24B; font-size:1.25rem;"></i>`;

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

/**
 * STERLING & CO. TAX ADVISORS - COMPONENT MODULES
 * Testimonial Slider, Animated Counters, Process Sequence,
 * FAQ Accordion, Blog Category Filter, Tax Deadlines Calendar,
 * Consultation Scheduler, Live World Clocks.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTestimonialsSlider();
  initAnimatedCounters();
  initProcessHorizontalScroll();
  initFAQAccordion();
  initBlogFilters();
  initCalendarWidget();
  initConsultationScheduler();
  initWorldClocks();
  initPricingToggle();
});

/* --------------------------------------------------------------------------
   0. PROCESS HORIZONTAL CONTINUOUS MOVING SEQUENCE
   -------------------------------------------------------------------------- */
function initProcessHorizontalScroll() {
  // Pinned scroll removed in favor of GPU-accelerated continuous moving marquee animation
}

/* --------------------------------------------------------------------------
   1. TESTIMONIALS SLIDER
   -------------------------------------------------------------------------- */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-card-single');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dots = document.querySelectorAll('.slider-dot');
  if (slides.length === 0) return;

  let current = 0;

  function showSlide(index) {
    slides.forEach((s) => s.classList.remove('active'));
    dots.forEach((d) => d.classList.remove('active'));

    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1));

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => showSlide(idx));
  });

  // Auto rotation every 7 seconds
  setInterval(() => {
    showSlide(current + 1);
  }, 7000);
}

/* --------------------------------------------------------------------------
   2. ANIMATED NUMBER COUNTERS
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const counterCards = document.querySelectorAll('.counter-card');
  if (counterCards.length === 0 || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  counterCards.forEach((card) => {
    const numEl = card.querySelector('.counter-number');
    if (!numEl) return;

    const target = parseFloat(numEl.getAttribute('data-target')) || 0;
    const decimals = parseInt(numEl.getAttribute('data-decimals')) || 0;

    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: 'power3.out',
          onUpdate: () => {
            numEl.textContent = decimals > 0 
              ? obj.val.toFixed(decimals) 
              : Math.round(obj.val).toLocaleString();
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. FAQ ACCORDION WITH LIVE SEARCH
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  const faqSearch = document.getElementById('faq-search-input');

  accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (header && content) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other accordions
        accordionItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherContent = other.querySelector('.accordion-content');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });

        // Toggle current
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = null;
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 30 + 'px';
        }
      });
    }
  });

  // Optional FAQ Search Filter
  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      accordionItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(q)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   4. BLOG CATEGORY FILTER & SEARCH
   -------------------------------------------------------------------------- */
function initBlogFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const blogPosts = document.querySelectorAll('.blog-filterable-card');
  const blogSearch = document.getElementById('blog-search-input');
  const clearBtn = document.getElementById('blog-search-clear');
  const noResults = document.getElementById('blog-no-results');
  const resetBtn = document.getElementById('reset-filters-btn');

  if (filterBtns.length === 0 && !blogSearch) return;

  let currentCategory = 'all';

  function applyFilters() {
    const searchQuery = blogSearch ? blogSearch.value.toLowerCase().trim() : '';

    if (clearBtn) {
      clearBtn.style.display = searchQuery ? 'block' : 'none';
    }

    let visibleCount = 0;

    blogPosts.forEach((post) => {
      const postCat = post.getAttribute('data-category') || 'all';
      const postText = post.textContent.toLowerCase();

      const matchesCat = currentCategory === 'all' || postCat === currentCategory;
      const matchesSearch = !searchQuery || postText.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        post.style.display = 'flex';
        visibleCount++;
      } else {
        post.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (blogSearch) {
    blogSearch.addEventListener('input', applyFilters);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      blogSearch.value = '';
      applyFilters();
      blogSearch.focus();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (blogSearch) blogSearch.value = '';
      currentCategory = 'all';
      filterBtns.forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
      });
      applyFilters();
    });
  }
}

/* --------------------------------------------------------------------------
   5. TAX DEADLINES CALENDAR WIDGET
   -------------------------------------------------------------------------- */
function initCalendarWidget() {
  const monthSelector = document.getElementById('calendar-month-select');
  const calendarItems = document.querySelectorAll('.calendar-deadline-card');
  if (!monthSelector || calendarItems.length === 0) return;

  monthSelector.addEventListener('change', (e) => {
    const selectedMonth = e.target.value;
    calendarItems.forEach((item) => {
      const itemMonth = item.getAttribute('data-month');
      if (selectedMonth === 'all' || itemMonth === selectedMonth) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. CONSULTATION SCHEDULER (Interactive Booking)
   -------------------------------------------------------------------------- */
function initConsultationScheduler() {
  const scheduler = document.getElementById('booking-scheduler');
  if (!scheduler) return;

  const dateInput = scheduler.querySelector('#booking-date');
  const slotButtons = scheduler.querySelectorAll('.slot-btn');
  const advisorSelect = scheduler.querySelector('#booking-advisor');
  const bookingForm = scheduler.querySelector('#booking-form');

  // Set default min date to tomorrow
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  let selectedSlot = '10:00 AM EST';

  slotButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      slotButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSlot = btn.textContent.trim();
    });
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = bookingForm.querySelector('#booking-name').value;
      const email = bookingForm.querySelector('#booking-email').value;
      const advisor = advisorSelect ? advisorSelect.value : 'Senior Partner';
      const date = dateInput ? dateInput.value : 'Upcoming Date';

      if (typeof showToast === 'function') {
        showToast(`Consultation requested for ${name} on ${date} at ${selectedSlot} with ${advisor}. Our executive team will confirm shortly.`, 'success');
      }
      bookingForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   7. LIVE WORLD CLOCKS (Financial Hubs)
   -------------------------------------------------------------------------- */
function initWorldClocks() {
  const clockNY = document.getElementById('clock-ny');
  const clockLondon = document.getElementById('clock-london');
  const clockZurich = document.getElementById('clock-zurich');
  const clockSingapore = document.getElementById('clock-singapore');
  const clockDubai = document.getElementById('clock-dubai');

  if (!clockNY && !clockLondon) return;

  function updateClocks() {
    const now = new Date();

    const timeNY = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false });
    const timeLondon = now.toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: false });
    const timeZurich = now.toLocaleTimeString('en-US', { timeZone: 'Europe/Zurich', hour: '2-digit', minute: '2-digit', hour12: false });
    const timeSingapore = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', hour12: false });
    const timeDubai = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: false });

    if (clockNY) clockNY.textContent = `${timeNY} EST`;
    if (clockLondon) clockLondon.textContent = `${timeLondon} GMT`;
    if (clockZurich) clockZurich.textContent = `${timeZurich} CET`;
    if (clockSingapore) clockSingapore.textContent = `${timeSingapore} SGT`;
    if (clockDubai) clockDubai.textContent = `${timeDubai} GST`;
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}

/* --------------------------------------------------------------------------
   8. PRICING BILLING SWITCHER (Monthly vs Annual with 20% discount)
   -------------------------------------------------------------------------- */
function initPricingToggle() {
  const switchToggle = document.querySelector('.toggle-switch');
  const amounts = document.querySelectorAll('.pricing-amount');
  const periods = document.querySelectorAll('.pricing-period');

  if (!switchToggle) return;

  let isAnnual = false;

  switchToggle.addEventListener('click', () => {
    isAnnual = !isAnnual;
    switchToggle.classList.toggle('annual', isAnnual);

    amounts.forEach((amt) => {
      const monthlyPrice = parseInt(amt.getAttribute('data-monthly')) || 0;
      const annualPrice = parseInt(amt.getAttribute('data-annual')) || 0;

      amt.textContent = isAnnual ? annualPrice.toLocaleString() : monthlyPrice.toLocaleString();
    });

    periods.forEach((p) => {
      p.textContent = isAnnual ? '/ billed annually' : '/ per month';
    });
  });
}

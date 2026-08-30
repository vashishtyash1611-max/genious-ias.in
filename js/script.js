/* ==========================================================================
   GENIOUS IAS — SCRIPT.JS
   Vanilla JS only. Modular functions, initialized on DOMContentLoaded.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initPreloader();
  initNavbar();
  initMobileNav();
  initDropdowns();
  initActiveNav();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initBackToTop();
  initCourseToggles();
  initAccordion();
  initResultsFilter();
  initGalleryLightbox();
  initContactForm();
});

/* ---------- Preloader ---------- */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('hidden');
    }, 400);
  });
  // Fallback in case load event is delayed
  setTimeout(function () { preloader.classList.add('hidden'); }, 2500);
}

/* ---------- Navbar scroll style ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  function onScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile Nav ---------- */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.nav-overlay');
  const closeBtn = document.querySelector('.mobile-nav-close');
  if (!hamburger || !mobileNav) return;

  function openNav() {
    hamburger.classList.add('active');
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    mobileNav.classList.contains('open') ? closeNav() : openNav();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  if (overlay) overlay.addEventListener('click', closeNav);

  // Mobile dropdown accordions
  document.querySelectorAll('.mobile-nav-item.has-dropdown > .mobile-nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const item = link.closest('.mobile-nav-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.mobile-nav-item.open').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Close on escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });
}

/* ---------- Desktop Dropdowns ---------- */
function initDropdowns() {
  const navItems = document.querySelectorAll('.nav-item.has-dropdown');
  navItems.forEach(function (item) {
    const link = item.querySelector('.nav-link');
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 960) return;
      e.preventDefault();
      const isOpen = item.classList.contains('open');
      navItems.forEach(function (i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item.has-dropdown')) {
      navItems.forEach(function (i) { i.classList.remove('open'); });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      navItems.forEach(function (i) { i.classList.remove('open'); });
    }
  });
}

/* ---------- Active Nav Link (based on current page) ---------- */
function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link, .dropdown a, .mobile-dropdown a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
      const parentDropdown = link.closest('.nav-item, .mobile-nav-item');
      if (parentDropdown && !parentDropdown.querySelector('.nav-link')?.classList.contains('active')) {
        const parentLink = parentDropdown.querySelector(':scope > .nav-link, :scope > .mobile-nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });
}

/* ---------- Smooth Scroll for in-page anchors ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
}

/* ---------- Scroll Reveal via IntersectionObserver ---------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { observer.observe(el); });
}

/* ---------- Animated Counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { observer.observe(el); });
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + suffix;
    }
  }
  requestAnimationFrame(step);
}

/* ---------- Back to Top ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Course Card Expand/Collapse ---------- */
function initCourseToggles() {
  document.querySelectorAll('.course-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const card = btn.closest('.course-card');
      card.classList.toggle('expanded');
      const expanded = card.classList.contains('expanded');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      const label = btn.querySelector('span');
      if (label) label.textContent = expanded ? 'View Less' : 'View Details';
    });
  });
}

/* ---------- FAQ Accordion ---------- */
function initAccordion() {
  document.querySelectorAll('.accordion-head').forEach(function (head) {
    head.addEventListener('click', function () {
      const item = head.closest('.accordion-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item.open').forEach(function (i) {
        i.classList.remove('open');
      });
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ---------- Results Filter ---------- */
function initResultsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.result-card');
  if (!filterBtns.length) return;
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ---------- Gallery Lightbox ---------- */
function initGalleryLightbox() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.querySelector('.lightbox');
  if (!items.length || !lightbox) return;

  const content = lightbox.querySelector('.lightbox-content');
  const caption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;

  function renderItem(index) {
    content.querySelectorAll('img, video').forEach(function (el) { el.remove(); });
    const item = items[index];
    const type = item.getAttribute('data-type');
    const src = item.getAttribute('data-src');
    const label = item.getAttribute('data-caption') || '';

    if (type === 'video') {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      content.insertBefore(video, caption);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = label;
      content.insertBefore(img, caption);
    }
    caption.textContent = label;
    currentIndex = index;
  }

  function openLightbox(index) {
    renderItem(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    content.querySelectorAll('video').forEach(function (v) { v.pause(); });
  }

  function showNext() {
    const nextIndex = (currentIndex + 1) % items.length;
    renderItem(nextIndex);
  }
  function showPrev() {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    renderItem(prevIndex);
  }

  items.forEach(function (item, index) {
    item.addEventListener('click', function () { openLightbox(index); });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(index); }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Gallery tabs (image/video/all filter) if present
  const tabs = document.querySelectorAll('.gallery-tab');
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');
        items.forEach(function (item) {
          const type = item.getAttribute('data-type');
          if (filter === 'all' || type === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
}

/* ---------- Contact Form Validation ---------- */
function initContactForm() {
  const form = document.querySelector('#registrationForm');
  if (!form) return;

  const feedback = document.querySelector('.form-feedback');

  const validators = {
    fullName: function (v) { return v.trim().length >= 3 && v.trim().length <= 60; },
    mobile: function (v) { return /^[6-9]\d{9}$/.test(v.trim()); },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
    course: function (v) { return v.trim().length > 0; },
    branch: function (v) { return v.trim().length > 0; },
    qualification: function (v) { return v.trim().length > 0; },
    city: function (v) { return v.trim().length >= 2 && v.trim().length <= 40; },
    mode: function (v) { return v.trim().length > 0; },
    message: function (v) { return v.trim().length <= 500; }
  };

  const errorMessages = {
    fullName: 'Please enter your full name (3–60 characters).',
    mobile: 'Enter a valid 10-digit Indian mobile number.',
    email: 'Please enter a valid email address.',
    course: 'Please select a course.',
    branch: 'Please select a branch.',
    qualification: 'Please select your qualification.',
    city: 'Please enter a valid city name.',
    mode: 'Please select a preferred mode.',
    message: 'Message should be under 500 characters.'
  };

  function validateField(field) {
    const name = field.name;
    const validator = validators[name];
    if (!validator) return true;
    const group = field.closest('.form-group');
    const valid = validator(field.value);
    if (group) {
      if (valid) {
        group.classList.remove('error');
      } else {
        group.classList.add('error');
        const errEl = group.querySelector('.error-message span');
        if (errEl) errEl.textContent = errorMessages[name];
      }
    }
    return valid;
  }

  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      const group = field.closest('.form-group');
      if (group && group.classList.contains('error')) validateField(field);
    });
  });

  function validateMode() {
    const checked = form.querySelector('input[name="mode"]:checked');
    const group = document.getElementById('modeGroup') ? document.getElementById('modeGroup').closest('.form-group') : null;
    const valid = !!checked;
    if (group) {
      group.classList.toggle('error', !valid);
    }
    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let allValid = true;
    form.querySelectorAll('input[name], select[name], textarea[name]').forEach(function (field) {
      if (field.type === 'radio') return;
      if (validators[field.name] && !validateField(field)) {
        allValid = false;
      }
    });
    if (form.querySelector('input[name="mode"]') && !validateMode()) {
      allValid = false;
    }

    feedback.classList.remove('show', 'success', 'error');

    if (!allValid) {
      feedback.classList.add('show', 'error');
      feedback.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i><span>Please correct the highlighted fields and try again.</span>';
      feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // No backend — simulate a successful frontend submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

    setTimeout(function () {
      feedback.classList.add('show', 'success');
      feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Thank you! Your registration has been received. Our counsellor will contact you shortly.</span>';
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 900);
  });
}

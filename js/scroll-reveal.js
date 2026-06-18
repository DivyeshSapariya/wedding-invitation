/**
 * Smooth scroll + scroll-reveal utilities
 */
(function () {
  let scrollAnimId = null;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function getScrollOffset(target) {
    const id = target.id;
    if (id === 'hero') return 0;

    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    return Math.max(0, target.getBoundingClientRect().top + window.scrollY - margin);
  }

  window.smoothScrollTo = function smoothScrollTo(y, options = {}) {
    const instant = options.instant || prefersReducedMotion();
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetY = Math.min(maxY, Math.max(0, y));

    if (scrollAnimId) {
      cancelAnimationFrame(scrollAnimId);
      scrollAnimId = null;
    }

    if (instant || Math.abs(window.scrollY - targetY) < 2) {
      window.scrollTo(0, targetY);
      return;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = Math.min(1000, Math.max(450, Math.abs(distance) * 0.55));
    let startTime = null;

    function step(now) {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));

      if (progress < 1) {
        scrollAnimId = requestAnimationFrame(step);
      } else {
        scrollAnimId = null;
      }
    }

    scrollAnimId = requestAnimationFrame(step);
  };

  window.scrollToSection = function scrollToSection(target, options = {}) {
    if (!target) return;
    const y = getScrollOffset(target);
    window.smoothScrollTo(y, options);
  };

  window.initScrollReveal = function initScrollReveal() {
    if (prefersReducedMotion()) {
      document.querySelectorAll('.reveal, [data-reveal-stagger] .reveal').forEach((el) => {
        el.classList.add('visible');
      });
      return;
    }

    const staggerContainers = document.querySelectorAll('[data-reveal-stagger]');
    const staggerChildren = new Set();

    staggerContainers.forEach((container) => {
      const items = container.querySelectorAll('.reveal');
      const step = parseInt(container.dataset.revealStagger || '120', 10);

      items.forEach((item, index) => {
        staggerChildren.add(item);
        item.style.setProperty('--reveal-delay', `${index * step}ms`);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target;

          if (target.hasAttribute('data-reveal-stagger')) {
            target.classList.add('visible');
            target.querySelectorAll('.reveal').forEach((item) => item.classList.add('visible'));
          } else {
            const delay = parseInt(target.dataset.delay || '0', 10);
            if (delay > 0) {
              setTimeout(() => target.classList.add('visible'), delay);
            } else {
              target.classList.add('visible');
            }
          }

          observer.unobserve(target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    staggerContainers.forEach((container) => observer.observe(container));

    document.querySelectorAll('.reveal').forEach((el) => {
      if (!staggerChildren.has(el) && !el.closest('.hero')) {
        observer.observe(el);
      }
    });
  };

  window.initSmoothScroll = function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;

        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        window.scrollToSection(target);

        const navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.classList.remove('open');

        if (history.replaceState) {
          history.replaceState(null, '', id);
        } else {
          location.hash = id;
        }
      });
    });
  };

  window.initHashScroll = function initHashScroll() {
    const hash = window.location.hash;
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    requestAnimationFrame(() => {
      window.scrollToSection(target, { instant: prefersReducedMotion() });
    });
  };

  window.initHeroEntrance = function initHeroEntrance() {
    const portrait = document.querySelector('.hero__portrait');
    const reduced = prefersReducedMotion();
    const fromIntro = document.body.classList.contains('site-reveal')
      && !document.body.classList.contains('intro-complete');
    const delay = reduced ? 0 : (fromIntro ? 750 : 150);

    if (reduced) {
      portrait?.classList.add('hero__portrait--visible');
      return;
    }

    setTimeout(() => portrait?.classList.add('hero__portrait--visible'), delay);
  };
})();

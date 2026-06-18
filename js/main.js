const WEDDING_DATE = new Date('2027-02-11T16:00:00');

function initSite() {
  initMandalaCloud('mandala-cloud-container');
  initMandalaSvg('mandala-svg');
  initHeroEntrance();
  initScrollReveal();
  initSmoothScroll();
  initNavScrollSpy();
  initHandTouchSection();
  initKankotriBook();
  initEventCards();
  initCountdown(WEDDING_DATE);
  initHeroSparklesText();
  initHashScroll();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('intro-complete')) {
    document.body.classList.add('site-reveal');
    initSite();
    return;
  }

  window.addEventListener('intro:exiting', () => {
    initSite();
  }, { once: true });

  window.addEventListener('intro:complete', () => {
    document.body.classList.add('intro-complete');
  }, { once: true });

  // Fallback if intro markup is missing
  setTimeout(() => {
    if (!document.body.classList.contains('intro-complete')) {
      document.getElementById('space-intro')?.remove();
      document.documentElement.classList.remove('intro-active');
      document.body.classList.remove('intro-active');
      document.body.classList.add('site-reveal');
      document.body.classList.add('intro-complete');
      initSite();
    }
  }, 8000);
});

function initHeroSparklesText() {
  initSparklesText('heroSparklesText', {
    text: 'દિવ્યેશ અને બિનલ',
    sparklesCount: window.innerWidth <= 520 ? 10 : 14,
    colors: {
      first: '#f0d78c',
      second: '#ffb8c8',
    },
  });
}

const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function setNavOpen(isOpen) {
  if (!navLinks || !navToggle) return;
  navLinks.classList.toggle('open', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  navToggle.setAttribute('aria-label', isOpen ? 'મેનૂ બંધ કરો' : 'મેનૂ ખોલો');
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setNavOpen(!navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavOpen(false));
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.classList.contains('open')) return;
    if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
    setNavOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNavOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setNavOpen(false);
  });
}

function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = navLinks?.querySelectorAll('a[href^="#"]');
  if (!sections.length || !links?.length) return;

  const setActive = (hash) => {
    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;
      const id = visible[0].target.getAttribute('id');
      if (id) setActive(`#${id}`);
    },
    {
      root: null,
      threshold: [0.15, 0.35, 0.55],
      rootMargin: '-20% 0px -55% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}

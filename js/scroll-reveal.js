window.initScrollReveal = function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal, [data-reveal-stagger] .reveal').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const staggerContainers = document.querySelectorAll('[data-reveal-stagger]');
  const staggerChildren = new Set();

  staggerContainers.forEach(container => {
    const items = container.querySelectorAll('.reveal');
    const step = parseInt(container.dataset.revealStagger || '120', 10);

    items.forEach((item, index) => {
      staggerChildren.add(item);
      item.style.setProperty('--reveal-delay', `${index * step}ms`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const target = entry.target;

        if (target.hasAttribute('data-reveal-stagger')) {
          target.classList.add('visible');
          target.querySelectorAll('.reveal').forEach(item => item.classList.add('visible'));
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

  staggerContainers.forEach(container => observer.observe(container));

  document.querySelectorAll('.reveal').forEach(el => {
    if (!staggerChildren.has(el) && !el.closest('.hero')) {
      observer.observe(el);
    }
  });
};

window.initSmoothScroll = function () {
  const nav = document.getElementById('nav');
  const navHeight = () => (nav ? nav.offsetHeight : 0);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight() + 4;

      window.scrollTo({ top, behavior: 'smooth' });

      const navLinks = document.getElementById('navLinks');
      if (navLinks) navLinks.classList.remove('open');
    });
  });
};

window.initHeroEntrance = function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const portrait = document.querySelector('.hero__portrait');
  const names = document.querySelector('.hero__names');

  if (prefersReducedMotion) {
    portrait?.classList.add('hero__portrait--visible');
    names?.classList.add('hero__names--visible');
    return;
  }

  setTimeout(() => portrait?.classList.add('hero__portrait--visible'), 150);
  setTimeout(() => names?.classList.add('hero__names--visible'), 750);
};

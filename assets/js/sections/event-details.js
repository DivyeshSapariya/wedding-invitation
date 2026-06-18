window.initEventCards = function () {
  const timeline = document.querySelector('.event-timeline');
  const items = document.querySelectorAll('.event-tl');
  if (!items.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  items.forEach((item, index) => {
    item.style.setProperty('--float-delay', `${index * 0.65}s`);
  });

  if (timeline) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          timeline.classList.toggle('is-active', entry.isIntersecting);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );
    timelineObserver.observe(timeline);
  }

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-active', entry.isIntersecting);
      });
    },
    { threshold: 0.45, rootMargin: '-10% 0px -10% 0px' }
  );

  items.forEach((item) => activeObserver.observe(item));

  if (reduced || !canHover) return;

  items.forEach((item) => {
    const panel = item.querySelector('.event-tl__panel');
    if (!panel) return;

    item.addEventListener('mousemove', (e) => {
      const rect = panel.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      panel.style.setProperty('--panel-tilt-x', `${x * 8}deg`);
      panel.style.setProperty('--panel-tilt-y', `${y * -6}deg`);
    });

    item.addEventListener('mouseleave', () => {
      panel.style.setProperty('--panel-tilt-x', '0deg');
      panel.style.setProperty('--panel-tilt-y', '0deg');
    });
  });
};

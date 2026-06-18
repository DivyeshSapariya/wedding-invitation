window.initEventCards = function () {
  const cards = document.querySelectorAll('.event-card');
  if (!cards.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  cards.forEach((card, index) => {
    card.style.setProperty('--float-delay', `${index * 0.7}s`);

    if (reduced || !window.matchMedia('(hover: hover)').matches) return;

    const inner = card.querySelector('.event-card__inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      inner.style.setProperty('--px', `${x * 14}px`);
      inner.style.setProperty('--py', `${y * -10}px`);
      inner.style.setProperty('--ry', `${x * 6}deg`);
    });

    card.addEventListener('mouseleave', () => {
      inner.style.setProperty('--px', '0px');
      inner.style.setProperty('--py', '0px');
      inner.style.setProperty('--ry', '0deg');
    });
  });
};

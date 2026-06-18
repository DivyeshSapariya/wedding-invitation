window.initCountdown = function (weddingDate) {
  const ids = ['days', 'hours', 'minutes', 'seconds'];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    const padded = String(value).padStart(2, '0');
    if (el.textContent === padded) return;

    if (!reduced) {
      el.classList.remove('countdown__num--tick');
      void el.offsetWidth;
      el.textContent = padded;
      el.classList.add('countdown__num--tick');
    } else {
      el.textContent = padded;
    }
  }

  function update() {
    const diff = weddingDate - new Date();

    if (diff <= 0) {
      ids.forEach((id) => setValue(id, 0));
      return;
    }

    setValue('days', Math.floor(diff / (1000 * 60 * 60 * 24)));
    setValue('hours', Math.floor((diff / (1000 * 60 * 60)) % 24));
    setValue('minutes', Math.floor((diff / (1000 * 60)) % 60));
    setValue('seconds', Math.floor((diff / 1000) % 60));
  }

  update();
  setInterval(update, 1000);

  if (reduced || !canHover) return;

  document.querySelectorAll('.countdown__card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${x * 10}deg`);
      card.style.setProperty('--tilt-y', `${y * -8}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
};

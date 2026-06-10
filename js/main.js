const WEDDING_DATE = new Date('2027-02-11T16:00:00');

document.addEventListener('DOMContentLoaded', () => {
  initMandalaCloud('mandala-cloud-container');
  initMandalaSvg('mandala-svg');
  initSandAnimation('sandCanvas', 'countdownSand', { mode: 'cycle' });
  initHeroEntrance();
  initScrollReveal();
  initSmoothScroll();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  setTimeout(() => {
    initSandAnimation('heroSandCanvas', 'heroNamesSand', {
      mode: 'hero',
      startText: 'Divyesh & Binal',
      hiddenText: '',
      fontFamily: '"Great Vibes", cursive',
      fontWeight: '400',
      fontSizeWidthRatio: 0.19,
      fontSizeHeightRatio: 0.82,
      fontSizeMax: 88,
      textYRatio: 0.52,
      cellSize: 2,
      grainColorBright: 'rgba(212, 175, 55, 0.92)',
      reformDurationSeconds: 2
    });
  }, 900);
});

const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

function updateCountdown() {
  const diff = WEDDING_DATE - new Date();
  const ids = ['days', 'hours', 'minutes', 'seconds'];

  if (diff <= 0) {
    ids.forEach(id => { document.getElementById(id).textContent = '00'; });
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

document.querySelectorAll('.timeline__item').forEach(item => {
  const time = item.querySelector('.timeline__time')?.textContent;
  const content = item.querySelector('.timeline__content');
  if (time && content) content.setAttribute('data-time', time);
});

const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.querySelectorAll('a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
});

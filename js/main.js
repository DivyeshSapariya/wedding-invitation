const WEDDING_DATE = new Date('2027-02-11T16:00:00');

document.addEventListener('DOMContentLoaded', () => {
  initMandalaCloud('mandala-cloud-container');
  initMandalaSvg('mandala-svg');
  initHeroEntrance();
  initScrollReveal();
  initSmoothScroll();
  initHandTouchSection();
  initKankotriBook();
  initEventCards();
  initCountdown(WEDDING_DATE);

  initHeroSandText();
});

async function initHeroSandText() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const isMobile = window.innerWidth <= 520;

  try {
    if (document.fonts) {
      await document.fonts.ready;
      await document.fonts.load('400 48px "Great Vibes"');
      await document.fonts.load('400 72px "Great Vibes"');
    }
  } catch (e) { /* font load optional */ }

  await new Promise((resolve) => {
    const ready = () => requestAnimationFrame(() => requestAnimationFrame(resolve));
    if (document.readyState === 'complete') ready();
    else window.addEventListener('load', ready, { once: true });
  });

  await new Promise((resolve) => setTimeout(resolve, isMobile ? 400 : 200));

  initSandAnimation('heroSandCanvas', 'heroNamesSand', {
    mode: 'hero',
    startText: 'Divyesh & Binal',
    hiddenText: '',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '400',
    fontSizeWidthRatio: isMobile ? 0.24 : 0.19,
    fontSizeHeightRatio: isMobile ? 0.9 : 0.82,
    fontSizeMax: isMobile ? 52 : 88,
    textYRatio: 0.52,
    cellSize: isMobile ? 3 : 2,
    grainColorBright: 'rgba(212, 175, 55, 0.92)',
    reformDurationSeconds: isMobile ? 1.7 : 2
  });
}

const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + (nav?.offsetHeight || 0) + 16;
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

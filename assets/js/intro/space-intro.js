/**
 * Vanilla port of SpaceBackground + site intro splash.
 * Shows particle tunnel + logo on load, then reveals the site.
 */
(function () {
  const INTRO_MIN_MS = 3200;
  const INTRO_MAX_MS = 5500;
  const PARTICLE_COUNT = 450;

  function parseRGB(cssColor) {
    if (!cssColor) return null;
    cssColor = cssColor.trim();

    if (cssColor[0] === '#') {
      let hex = cssColor.slice(1);
      if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }

    const m = cssColor.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
      return [parts[0], parts[1], parts[2]];
    }
    return null;
  }

  function luminanceFromRgb([r, g, b]) {
    const srgb = [r / 255, g / 255, b / 255].map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  }

  function detectBackgroundColor(backgroundColor) {
    if (backgroundColor && backgroundColor !== 'transparent') return backgroundColor;

    const candidates = [document.body, document.documentElement];
    for (const el of candidates) {
      if (!el) continue;
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor || cs.background;
      if (!bg) continue;
      const rgb = parseRGB(bg);
      if (!rgb) continue;
      if (/rgba/.test(bg)) {
        const alpha = parseFloat(bg.split(',').pop() || '1');
        if (isNaN(alpha) || alpha === 0) continue;
      }
      return bg;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    return media.matches ? 'black' : 'white';
  }

  function resolveParticleColor(particleColor, backgroundColor) {
    if (particleColor) return particleColor;

    let bg = detectBackgroundColor(backgroundColor);
    if (!bg || bg === 'transparent') {
      bg = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'white';
    }

    const rgb = parseRGB(bg);
    if (rgb) {
      const lum = luminanceFromRgb(rgb);
      return lum < 0.5 ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'rgba(255,255,255,0.85)'
      : 'rgba(0,0,0,0.85)';
  }

  function createSpaceBackground(canvas, options) {
    const {
      particleCount = 450,
      particleColor = 'rgba(252, 239, 215, 0.45)',
      backgroundColor = '#7A1313',
    } = options;

    const ctx = canvas.getContext('2d');
    if (!ctx) return { destroy: () => {} };

    const resolvedColor = resolveParticleColor(particleColor, backgroundColor);
    let ratio = window.innerHeight < 400 ? 0.6 : 1;
    let animationId = null;

    const state = {
      particles: [],
      r: 120,
      counter: 0,
    };

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.setTransform(ratio, 0, 0, -ratio, canvas.width / 2, canvas.height / 2);
    };
    setupCanvas();

    const createParticle = () => {
      state.particles.push({
        color: resolvedColor,
        radius: Math.random() * 5,
        x: Math.cos(Math.random() * 7 + Math.PI) * state.r,
        y: Math.sin(Math.random() * 7 + Math.PI) * state.r,
        ring: Math.random() * state.r * 3,
        move: (Math.random() * 4 + 1) / 500,
        random: Math.random() * 7,
      });
    };

    for (let i = 0; i < particleCount; i++) createParticle();

    const moveParticle = (p) => {
      p.ring = Math.max(p.ring - 1, state.r);
      p.random += p.move;
      p.x = Math.cos(p.random + Math.PI) * p.ring;
      p.y = Math.sin(p.random + Math.PI) * p.ring;
    };

    const resetParticle = (p) => {
      p.ring = Math.random() * state.r * 3;
      p.radius = Math.random() * 5;
    };

    const disappear = (p) => {
      if (p.radius < 0.8) resetParticle(p);
      p.radius *= 0.994;
    };

    const draw = (p) => {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = () => {
      ctx.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);
      if (state.counter < state.particles.length) state.counter++;
      for (let i = 0; i < state.counter; i++) {
        disappear(state.particles[i]);
        moveParticle(state.particles[i]);
        draw(state.particles[i]);
      }
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    const onResize = () => {
      ratio = window.innerHeight < 400 ? 0.6 : 1;
      setupCanvas();
    };
    window.addEventListener('resize', onResize);

    return {
      destroy() {
        window.removeEventListener('resize', onResize);
        if (animationId) cancelAnimationFrame(animationId);
      },
      isFullySpawned() {
        return state.counter >= state.particles.length;
      },
    };
  }

  function finishIntro(introEl, bgInstance) {
    if (!introEl || introEl.classList.contains('is-exiting')) return;

    document.body.classList.add('site-reveal');
    window.dispatchEvent(new Event('intro:exiting'));

    introEl.classList.add('is-exiting');
    document.documentElement.classList.remove('intro-active');
    document.body.classList.remove('intro-active');

    const cleanup = () => {
      bgInstance?.destroy();
      introEl.remove();
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('intro:complete'));
    };

    introEl.addEventListener('transitionend', cleanup, { once: true });
    setTimeout(cleanup, 1200);
  }

  function initSpaceIntro() {
    const introEl = document.getElementById('space-intro');
    const canvas = document.getElementById('space-intro-canvas');
    if (!introEl || !canvas) {
      document.documentElement.classList.remove('intro-active');
      document.body.classList.remove('intro-active');
      window.dispatchEvent(new Event('intro:complete'));
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('intro-active');
    document.body.classList.add('intro-active');

    if (reduced) {
      setTimeout(() => finishIntro(introEl, null), 600);
      return;
    }

    const bg = createSpaceBackground(canvas, {
      particleCount: PARTICLE_COUNT,
      particleColor: 'rgba(252, 239, 215, 0.45)',
      backgroundColor: '#7A1313',
    });

    const startedAt = Date.now();

    const tryFinish = () => {
      const elapsed = Date.now() - startedAt;
      const ready = elapsed >= INTRO_MIN_MS && bg.isFullySpawned();
      const timeout = elapsed >= INTRO_MAX_MS;

      if (ready || timeout) {
        finishIntro(introEl, bg);
      } else {
        requestAnimationFrame(tryFinish);
      }
    };

    requestAnimationFrame(tryFinish);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpaceIntro);
  } else {
    initSpaceIntro();
  }
})();

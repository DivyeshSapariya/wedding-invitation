/**
 * Vanilla port of SparklesText (framer-motion sparkles around text).
 */
(function () {
  const STAR_PATH =
    'M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  function generateStar(colors) {
    return {
      id: `${Math.random().toString(36).slice(2)}-${Date.now()}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: Math.random() > 0.5 ? colors.first : colors.second,
      delay: Math.random() * 2,
      scale: Math.random() * 1 + 0.3,
      lifespan: Math.random() * 10 + 5,
    };
  }

  function createSparkleElement(star) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.classList.add('sparkles-text__sparkle');
    svg.setAttribute('width', '21');
    svg.setAttribute('height', '21');
    svg.setAttribute('viewBox', '0 0 21 21');
    svg.setAttribute('aria-hidden', 'true');
    svg.dataset.id = star.id;
    svg.style.left = `${star.x}%`;
    svg.style.top = `${star.y}%`;
    svg.style.setProperty('--sparkle-scale', String(star.scale));
    svg.style.setProperty('--sparkle-delay', `${star.delay}s`);

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', STAR_PATH);
    path.setAttribute('fill', star.color);
    svg.appendChild(path);

    return { el: svg, star };
  }

  function applyStarToElement(entry, star) {
    entry.star = star;
    entry.el.style.left = `${star.x}%`;
    entry.el.style.top = `${star.y}%`;
    entry.el.style.setProperty('--sparkle-scale', String(star.scale));
    entry.el.style.setProperty('--sparkle-delay', `${star.delay}s`);
    entry.el.querySelector('path')?.setAttribute('fill', star.color);
    entry.el.dataset.id = star.id;
  }

  window.initSparklesText = function initSparklesText(containerId, options = {}) {
    const root = document.getElementById(containerId);
    if (!root) return null;

    const {
      text = '',
      sparklesCount = 12,
      colors = { first: '#f0d78c', second: '#ffb8c8' },
    } = options;

    root.style.setProperty('--sparkles-first-color', colors.first);
    root.style.setProperty('--sparkles-second-color', colors.second);

    const label = root.querySelector('.sparkles-text__label');
    const sparklesHost = root.querySelector('.sparkles-text__sparkles');

    if (label && text) label.textContent = text;
    if (!sparklesHost) return null;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return { destroy() {} };
    }

    let entries = [];
    let intervalId = null;

    function renderSparkles() {
      sparklesHost.innerHTML = '';
      entries = Array.from({ length: sparklesCount }, () => {
        const star = generateStar(colors);
        const entry = createSparkleElement(star);
        sparklesHost.appendChild(entry.el);
        return entry;
      });
    }

    function tick() {
      entries = entries.map((entry) => {
        entry.star.lifespan -= 0.1;
        if (entry.star.lifespan <= 0) {
          applyStarToElement(entry, generateStar(colors));
        }
        return entry;
      });
    }

    renderSparkles();
    intervalId = window.setInterval(tick, 100);

    return {
      destroy() {
        if (intervalId) clearInterval(intervalId);
        sparklesHost.innerHTML = '';
        entries = [];
      },
    };
  };
})();

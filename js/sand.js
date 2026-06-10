/* Sand particle animation — adapted for countdown section */
window.initSandAnimation = function (canvasId, containerId) {
  const canvas = document.getElementById(canvasId);
  const container = document.getElementById(containerId);
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  let w = 0, h = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const settings = {
    cellSize: 3,
    startText: '11 Feb',
    hiddenText: 'Divyesh & Binal',
    releaseTestsPerFrame: 1200,
    releaseChance: 0.022,
    gravity: 850,
    airDrag: 0.992,
    settleStepsPerFrame: 5,
    pileHoldSeconds: 0.8,
    hiddenFadeInSeconds: 0.45,
    reformDurationSeconds: 2,
    reformStaggerSeconds: 0.65,
    revealHoldSeconds: 3,
    revealFadeSeconds: 0.6
  };

  let cols = 0, rows = 0;
  let fixedCodepen, codepenCells = [], looseCells = [];
  let falling = [], pile, reforming = [];
  let hiddenAlpha = 0, phase = 'codepen', phaseTime = 0, lastTime = performance.now();

  function resize() {
    const rect = container.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / settings.cellSize);
    rows = Math.ceil(h / settings.cellSize);
    fixedCodepen = new Uint8Array(cols * rows);
    pile = new Uint8Array(cols * rows);
    codepenCells = []; looseCells = []; falling = []; reforming = [];
    hiddenAlpha = 0; phase = 'codepen'; phaseTime = 0;
    buildCodepenText();
  }

  function index(col, row) { return row * cols + col; }
  function colFromIndex(i) { return i % cols; }
  function rowFromIndex(i) { return Math.floor(i / cols); }
  function inBounds(col, row) { return col >= 0 && col < cols && row >= 0 && row < rows; }
  function rand(min, max) { return min + Math.random() * (max - min); }
  function randInt(min, max) { return Math.floor(min + Math.random() * (max - min + 1)); }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function buildCodepenText() {
    const maskCanvas = document.createElement('canvas');
    const maskCtx = maskCanvas.getContext('2d');
    maskCanvas.width = w; maskCanvas.height = h;
    const fontSize = Math.min(w * 0.18, h * 0.35, 140);
    maskCtx.clearRect(0, 0, w, h);
    maskCtx.fillStyle = '#fff';
    maskCtx.textAlign = 'center';
    maskCtx.textBaseline = 'middle';
    maskCtx.font = `700 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
    maskCtx.fillText(settings.startText, w / 2, h * 0.38);
    const image = maskCtx.getImageData(0, 0, w, h).data;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = Math.floor(col * settings.cellSize + settings.cellSize / 2);
        const y = Math.floor(row * settings.cellSize + settings.cellSize / 2);
        if (image[(y * w + x) * 4 + 3] > 35) {
          const i = index(col, row);
          fixedCodepen[i] = 1;
          codepenCells.push(i);
          looseCells.push(i);
        }
      }
    }
    shuffle(looseCells);
  }

  function resetCycle() {
    fixedCodepen.fill(0); pile.fill(0);
    looseCells = codepenCells.slice(); shuffle(looseCells);
    falling = []; reforming = [];
    codepenCells.forEach(cell => { fixedCodepen[cell] = 1; });
    hiddenAlpha = 0; phase = 'codepen'; phaseTime = 0;
  }

  function releaseOneGrain(cellIndex) {
    const col = colFromIndex(cellIndex), row = rowFromIndex(cellIndex);
    fixedCodepen[cellIndex] = 0;
    falling.push({ x: col * settings.cellSize, y: row * settings.cellSize, vx: rand(-22, 22), vy: rand(40, 150), drift: rand(-55, 55), driftTarget: rand(-85, 85), driftTimer: rand(0.18, 0.9) });
  }

  function releaseCodepen() {
    if (looseCells.length === 0) { phase = 'falling'; phaseTime = 0; return; }
    for (let i = 0; i < settings.releaseTestsPerFrame; i++) {
      if (looseCells.length === 0) break;
      const listIndex = randInt(0, looseCells.length - 1);
      const cellIndex = looseCells[listIndex];
      if (fixedCodepen[cellIndex] === 0) { looseCells.splice(listIndex, 1); continue; }
      const col = colFromIndex(cellIndex), row = rowFromIndex(cellIndex);
      const belowEmpty = row >= rows - 1 || fixedCodepen[index(col, Math.min(row + 1, rows - 1))] === 0;
      const sideEmpty = col <= 0 || col >= cols - 1 || fixedCodepen[index(Math.max(col - 1, 0), row)] === 0 || fixedCodepen[index(Math.min(col + 1, cols - 1), row)] === 0;
      if (Math.random() < settings.releaseChance * (belowEmpty || sideEmpty ? 3.3 : 1)) {
        releaseOneGrain(cellIndex);
        looseCells.splice(listIndex, 1);
      }
    }
  }

  function pileSolid(col, row) { return row >= rows || col < 0 || col >= cols || pile[index(col, row)] === 1; }
  function setPile(col, row) { if (inBounds(col, row)) pile[index(col, row)] = 1; }

  function settleFallingParticle(p) {
    let col = Math.max(0, Math.min(cols - 1, Math.floor(p.x / settings.cellSize)));
    let row = Math.max(0, Math.min(rows - 1, Math.floor(p.y / settings.cellSize)));
    if (!pileSolid(col, row)) { setPile(col, row); return; }
    if (!pileSolid(col - 1, row)) { setPile(col - 1, row); return; }
    if (!pileSolid(col + 1, row)) { setPile(col + 1, row); return; }
    for (let y = row - 1; y >= 0; y--) { if (!pileSolid(col, y)) { setPile(col, y); return; } }
  }

  function updateFalling(dt) {
    for (let i = falling.length - 1; i >= 0; i--) {
      const p = falling[i];
      p.driftTimer -= dt;
      if (p.driftTimer <= 0) { p.driftTarget = rand(-85, 85); p.driftTimer = rand(0.25, 1.2); }
      p.drift += (p.driftTarget - p.drift) * dt * 2;
      p.vx += p.drift * dt; p.vy += settings.gravity * dt;
      p.vx *= settings.airDrag; p.vy *= settings.airDrag;
      p.x += p.vx * dt; p.y += p.vy * dt;
      const col = Math.floor(p.x / settings.cellSize);
      const nextRow = Math.floor((p.y + settings.cellSize) / settings.cellSize);
      if (p.x < -60) p.x = 0;
      if (p.x > w + 60) p.x = w - settings.cellSize;
      if (nextRow >= rows || pileSolid(col, nextRow)) { settleFallingParticle(p); falling.splice(i, 1); }
    }
    if (phase === 'falling' && falling.length === 0) { phase = 'pile'; phaseTime = 0; }
  }

  function settlePileCell(col, row) {
    const current = index(col, row);
    if (pile[current] !== 1) return;
    if (!pileSolid(col, row + 1)) { pile[index(col, row + 1)] = 1; pile[current] = 0; return; }
    const preferLeft = Math.random() > 0.5;
    if (preferLeft) {
      if (!pileSolid(col - 1, row + 1)) { pile[index(col - 1, row + 1)] = 1; pile[current] = 0; return; }
      if (!pileSolid(col + 1, row + 1)) { pile[index(col + 1, row + 1)] = 1; pile[current] = 0; }
    } else {
      if (!pileSolid(col + 1, row + 1)) { pile[index(col + 1, row + 1)] = 1; pile[current] = 0; return; }
      if (!pileSolid(col - 1, row + 1)) { pile[index(col - 1, row + 1)] = 1; pile[current] = 0; }
    }
  }

  function settlePile() {
    const ltr = Math.random() > 0.5;
    for (let row = rows - 2; row >= 0; row--) {
      if (ltr) { for (let col = 1; col < cols - 1; col++) settlePileCell(col, row); }
      else { for (let col = cols - 2; col >= 1; col--) settlePileCell(col, row); }
    }
  }

  function collectPileCells() {
    const cells = [];
    for (let row = rows - 1; row >= 0; row--)
      for (let col = 0; col < cols; col++)
        if (pile[index(col, row)] === 1) cells.push(index(col, row));
    return cells;
  }

  function startReform() {
    const pileCells = collectPileCells();
    const targets = codepenCells.slice();
    pile.fill(0);
    pileCells.sort((a, b) => rowFromIndex(b) - rowFromIndex(a));
    targets.sort((a, b) => rowFromIndex(b) - rowFromIndex(a));
    const count = Math.min(pileCells.length, targets.length);
    for (let i = 0; i < count; i++) {
      const source = pileCells[i], target = targets[i];
      reforming.push({
        sx: colFromIndex(source) * settings.cellSize, sy: rowFromIndex(source) * settings.cellSize,
        tx: colFromIndex(target) * settings.cellSize, ty: rowFromIndex(target) * settings.cellSize,
        x: colFromIndex(source) * settings.cellSize, y: rowFromIndex(source) * settings.cellSize,
        delay: rand(0, settings.reformStaggerSeconds),
        duration: rand(settings.reformDurationSeconds * 0.75, settings.reformDurationSeconds * 1.15),
        wave: rand(-18, 18), phaseOffset: rand(0, Math.PI * 2)
      });
    }
    phase = 'reform'; phaseTime = 0;
  }

  function updateReform(dt) {
    hiddenAlpha = 1;
    let allArrived = true;
    for (const p of reforming) {
      const localTime = phaseTime - p.delay;
      if (localTime <= 0) { p.x = p.sx; p.y = p.sy; allArrived = false; continue; }
      const t = clamp01(localTime / p.duration);
      const eased = easeInOutCubic(t);
      const arc = Math.sin(eased * Math.PI);
      p.x = p.sx + (p.tx - p.sx) * eased + Math.sin(eased * Math.PI * 2 + p.phaseOffset) * p.wave * arc;
      p.y = p.sy + (p.ty - p.sy) * eased - arc * h * 0.08;
      if (t < 1) allArrived = false;
    }
    if (allArrived) {
      codepenCells.forEach(cell => { fixedCodepen[cell] = 1; });
      reforming = []; phase = 'hiddenHold'; phaseTime = 0; hiddenAlpha = 1;
    }
  }

  function updatePhase(dt) {
    phaseTime += dt;
    if (phase === 'codepen') releaseCodepen();
    if (phase === 'pile' && phaseTime >= settings.pileHoldSeconds) { phase = 'hiddenFadeIn'; phaseTime = 0; hiddenAlpha = 0; }
    if (phase === 'hiddenFadeIn') {
      hiddenAlpha = Math.min(1, phaseTime / settings.hiddenFadeInSeconds);
      if (hiddenAlpha >= 1) { hiddenAlpha = 1; startReform(); }
    }
    if (phase === 'reform') updateReform(dt);
    if (phase === 'hiddenHold') {
      hiddenAlpha = 1;
      if (phaseTime >= settings.revealHoldSeconds) { phase = 'hiddenFade'; phaseTime = 0; }
    }
    if (phase === 'hiddenFade') {
      hiddenAlpha = Math.max(0, 1 - phaseTime / settings.revealFadeSeconds);
      if (hiddenAlpha <= 0) { hiddenAlpha = 0; resetCycle(); }
    }
  }

  function drawGrains(data) {
    const size = settings.cellSize;
    ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (data[index(col, row)] === 1) {
          ctx.fillRect(col * size, row * size, size, size);
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    if (hiddenAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = hiddenAlpha * 0.5;
      ctx.fillStyle = 'rgb(212, 175, 55)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `600 ${Math.min(22, w * 0.04)}px "Great Vibes", cursive`;
      ctx.fillText(settings.hiddenText, w / 2, h * 0.72);
      ctx.restore();
    }
    drawGrains(fixedCodepen);
    drawGrains(pile);
    const size = settings.cellSize;
    ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
    falling.forEach(p => ctx.fillRect(p.x, p.y, size, size));
    reforming.forEach(p => ctx.fillRect(p.x, p.y, size, size));
  }

  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.033);
    lastTime = now;
    updatePhase(dt);
    updateFalling(dt);
    if (phase !== 'reform' && phase !== 'hiddenHold' && phase !== 'hiddenFade')
      for (let i = 0; i < settings.settleStepsPerFrame; i++) settlePile();
    draw();
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(tick);
};

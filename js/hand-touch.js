function initHandTouchSection() {
  const wrapper = document.getElementById('handTouchWrapper');
  if (!wrapper) return;

  const sticky = document.getElementById('handTouchSticky');
  const groom = document.getElementById('handTouchGroom');
  const bride = document.getElementById('handTouchBride');
  const groomImg = document.getElementById('handTouchGroomImg');
  const brideImg = document.getElementById('handTouchBrideImg');
  const groomName = document.getElementById('handTouchGroomName');
  const brideName = document.getElementById('handTouchBrideName');
  const centerName = document.getElementById('handTouchCenterName');
  const dateReveal = document.getElementById('handTouchDate');
  const scrollCue = document.getElementById('handTouchScrollCue');
  const topLabel = document.getElementById('handTouchTopLabel');
  const meetPoint = document.getElementById('handTouchMeetPoint');
  const sparkRing = document.getElementById('handTouchSparkRing');
  const sparkRing2 = document.getElementById('handTouchSparkRing2');
  const sparkStream = document.getElementById('handTouchSparkStream');
  const starsBg = document.getElementById('handTouchStars');
  const heartBurst = document.getElementById('handTouchHeartBurst');
  const groomFx = document.getElementById('handTouchGroomFx');
  const brideFx = document.getElementById('handTouchBrideFx');
  const floatPetals = document.getElementById('handTouchPetals');

  if (!groom || !bride || !sticky) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  for (let i = 0; i < 90; i++) {
    const star = document.createElement('div');
    star.className = 'hand-touch__star';
    star.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;
      width:${1 + Math.random() * 2}px;height:${1 + Math.random() * 2}px;
      --d:${2 + Math.random() * 4}s;--dl:${Math.random() * 4}s;--op:${0.2 + Math.random() * 0.6}`;
    starsBg.appendChild(star);
  }

  const burstIcons = ['✦', '♥', '✿', '❋', '♡', '✧', '★', '✨'];
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const r = 55 + Math.random() * 65;
    const r2 = r * 1.75;
    const burst = document.createElement('div');
    burst.className = 'hand-touch__hp';
    burst.textContent = burstIcons[i % burstIcons.length];
    burst.style.cssText = `--hx:${Math.cos(angle) * r}px;--hy:${Math.sin(angle) * r - 30}px;
      --hx2:${Math.cos(angle) * r2}px;--hy2:${Math.sin(angle) * r2 - 80}px;
      --hd:${0.7 + Math.random() * 0.8}s;--hdl:${i * 0.035}s;
      font-size:${14 + Math.random() * 16}px`;
    heartBurst.appendChild(burst);
  }

  const mobileLayout = window.innerWidth < 600;

  function createHandEmitter(container, direction) {
    const icons = ['✦', '♥', '★', '✧', '✿', '❋', '✨', '♡'];
    const dirX = direction === 'right' ? 1 : -1;
    const count = mobileLayout ? 7 : 14;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = 'hand-touch__emit-particle';
      particle.textContent = icons[i % icons.length];
      const spreadX = (20 + Math.random() * 70) * dirX;
      const riseY = -(50 + Math.random() * 110);
      particle.style.cssText = `
        font-size:${11 + Math.random() * 13}px;
        --em-x:${spreadX}px;
        --em-y:${riseY}px;
        --em-rot:${(Math.random() - 0.5) * 80}deg;
        --em-dur:${2 + Math.random() * 2.2}s;
        --em-delay:${Math.random() * 2.5}s`;
      container.appendChild(particle);
    }
  }

  createHandEmitter(groomFx, 'right');
  createHandEmitter(brideFx, 'left');

  for (let i = 0; i < 14; i++) {
    const dot = document.createElement('div');
    dot.className = 'hand-touch__spark-dot';
    dot.style.cssText = `--sx:${(Math.random() - 0.5) * 80}px;
      --sd:${1 + Math.random() * 1.4}s;--sdl:${Math.random() * 1.5}s`;
    sparkStream.appendChild(dot);
  }

  if (!mobileLayout) {
    const petals = ['🌸', '🌺', '🏵️', '✿', '🌼'];
    for (let i = 0; i < 12; i++) {
      const petal = document.createElement('div');
      petal.className = 'hand-touch__fpetal';
      petal.textContent = petals[i % petals.length];
      petal.style.cssText = `left:${10 + Math.random() * 80}%;bottom:${80 + Math.random() * 100}px;
        --fd:${3 + Math.random() * 4}s;--fdl:${Math.random() * 3}s;
        --fx:${(Math.random() - 0.5) * 120}px;--fr:${Math.random() * 360}deg`;
      floatPetals.appendChild(petal);
    }
  }

  const hpEls = heartBurst.querySelectorAll('.hand-touch__hp');
  const fpetalEls = floatPetals.querySelectorAll('.hand-touch__fpetal');

  let startX = 280;
  let groomEndX = 0;
  let brideEndX = 0;
  let touchTriggered = false;
  const isMobile = () => window.matchMedia('(max-width: 600px)').matches;

  function measureHandGap() {
    const groomRect = groomImg.getBoundingClientRect();
    const brideRect = brideImg.getBoundingClientRect();
    const groomHand = groomRect.right - groomRect.width * 0.04;
    const brideHand = brideRect.left + brideRect.width * 0.04;
    return brideHand - groomHand;
  }

  function measureTouchOffsets() {
    const prevGroom = groom.style.transform;
    const prevBride = bride.style.transform;
    const prevGroomImg = groomImg.style.transform;
    const prevBrideImg = brideImg.style.transform;

    groom.style.transform = 'translateX(0px)';
    bride.style.transform = 'translateX(0px)';
    groomImg.style.transform = 'scale(1)';
    brideImg.style.transform = 'scale(1)';
    void groom.offsetWidth;

    const gap = measureHandGap();
    const touchOverlap = isMobile() ? 14 : 8;
    const closeBy = Math.max(0, (gap + touchOverlap) / 2);

    groom.style.transform = prevGroom;
    bride.style.transform = prevBride;
    groomImg.style.transform = prevGroomImg;
    brideImg.style.transform = prevBrideImg;

    return { groomEndX: -closeBy, brideEndX: -closeBy };
  }

  function calcLayout() {
    const vw = window.innerWidth;
    const touch = measureTouchOffsets();
    groomEndX = touch.groomEndX;
    brideEndX = touch.brideEndX;

    if (vw >= 600) {
      startX = 280;
      return;
    }

    const overlap = 12;
    const groomW = groomImg.offsetWidth;
    const brideW = brideImg.offsetWidth;

    if (!groomW || !brideW) {
      startX = Math.min(64, Math.max(36, vw * 0.14));
      return;
    }

    const pairW = groomW + brideW - overlap;
    const room = Math.floor((vw - pairW) / 2 - 4);
    startX = Math.min(72, Math.max(36, room));
  }

  function syncStageHeight() {
    const h = window.innerHeight;
    document.documentElement.style.setProperty('--ht-stage-h', `${h}px`);
    wrapper.style.height = `${Math.round(h * 3.8)}px`;
  }

  function refreshStartX() {
    syncStageHeight();
    calcLayout();
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function placeAt(el, x, y) {
    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  function getHandPositions() {
    const stickyRect = sticky.getBoundingClientRect();
    const groomRect = groomImg.getBoundingClientRect();
    const brideRect = brideImg.getBoundingClientRect();

    const groomHandX = groomRect.right - groomRect.width * 0.04;
    const groomHandY = groomRect.top + groomRect.height * 0.41;
    const brideHandX = brideRect.left + brideRect.width * 0.04;
    const brideHandY = brideRect.top + brideRect.height * 0.41;

    return {
      groom: {
        x: groomHandX - stickyRect.left,
        y: groomHandY - stickyRect.top
      },
      bride: {
        x: brideHandX - stickyRect.left,
        y: brideHandY - stickyRect.top
      },
      meet: {
        x: (groomHandX + brideHandX) / 2 - stickyRect.left,
        y: (groomHandY + brideHandY) / 2 - stickyRect.top
      }
    };
  }

  function updateHandEffects(progress) {
    const hands = getHandPositions();
    placeAt(meetPoint, hands.meet.x, hands.meet.y);
    placeAt(groomFx, hands.groom.x, hands.groom.y);
    placeAt(brideFx, hands.bride.x, hands.bride.y);

    const fxActive = progress > 0.1;
    let fxOpacity = 0;
    if (progress > 0.1) {
      fxOpacity = Math.min(1, 0.3 + ((progress - 0.1) / 0.7) * 0.85);
    }
    groomFx.classList.toggle('active', fxActive);
    brideFx.classList.toggle('active', fxActive);
    groomFx.style.opacity = fxOpacity;
    brideFx.style.opacity = fxOpacity;

    const streamOpacity = progress > 0.2
      ? Math.min(1, 0.2 + ((progress - 0.2) / 0.65) * 0.9)
      : 0;
    sparkStream.style.opacity = streamOpacity;
  }

  function triggerTouch() {
    [sparkRing, sparkRing2].forEach((ring) => {
      ring.classList.remove('burst');
      void ring.offsetWidth;
      ring.classList.add('burst');
    });
    hpEls.forEach((el) => {
      el.classList.remove('burst');
      void el.offsetWidth;
      el.classList.add('burst');
    });
    setTimeout(() => dateReveal.classList.add('show'), 250);
    setTimeout(() => fpetalEls.forEach((p) => p.classList.add('active')), 500);
  }

  let scrollTicking = false;

  function onScrollFrame() {
    scrollTicking = false;
    const rect = wrapper.getBoundingClientRect();
    const stageHeight = window.innerHeight;
    const total = wrapper.offsetHeight - stageHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / total));

    const isPinned = rect.top <= 0 && rect.bottom >= stageHeight;
    const showInstruction = isPinned && progress < 0.68;
    wrapper.classList.toggle('is-pinned', isPinned);
    topLabel.classList.toggle('show', showInstruction);
    scrollCue.classList.toggle('hidden', !showInstruction || progress > 0.14);

    const walkStart = isMobile() ? 0.1 : 0.05;
    const walkSpan = isMobile() ? 0.78 : 0.72;
    const walkP = Math.max(0, Math.min(1, (progress - walkStart) / walkSpan));
    const eased = easeInOut(walkP);
    const curGroomX = lerp(startX, groomEndX, eased);
    const curBrideX = lerp(startX, brideEndX, eased);

    groom.style.transform = `translateX(-${curGroomX}px)`;
    bride.style.transform = `translateX(${curBrideX}px)`;

    const scaleMin = isMobile() ? 0.94 : 0.88;
    const scale = lerp(scaleMin, 1, eased);
    groomImg.style.transform = `scale(${scale})`;
    brideImg.style.transform = `scale(${scale})`;

    const namesVisible = progress > 0.22;
    groomName.classList.toggle('show', namesVisible);
    brideName.classList.toggle('show', namesVisible);
    if (centerName) centerName.classList.toggle('show', namesVisible);

    const glowing = progress > 0.70;
    groomImg.classList.toggle('glow', glowing);
    brideImg.classList.toggle('glow', glowing);

    updateHandEffects(progress);

    const touchResetAt = isMobile() ? 0.62 : 0.70;

    if (progress < touchResetAt && touchTriggered) {
      touchTriggered = false;
      dateReveal.classList.remove('show');
      hpEls.forEach((el) => el.classList.remove('burst'));
      sparkRing.classList.remove('burst');
      sparkRing2.classList.remove('burst');
      fpetalEls.forEach((p) => p.classList.remove('active'));
    }

    const handsAligned = measureHandGap() <= (isMobile() ? 22 : 16);

    if (walkP >= 0.97 && handsAligned && !touchTriggered) {
      touchTriggered = true;
      triggerTouch();
    }

    if (touchTriggered) dateReveal.classList.add('show');
  }

  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(onScrollFrame);
  }

  function onResize() {
    refreshStartX();
    onScroll();
  }

  if (reducedMotion) {
    calcLayout();
    groom.style.transform = `translateX(${-groomEndX}px)`;
    bride.style.transform = `translateX(${brideEndX}px)`;
    groomImg.style.transform = 'scale(1)';
    brideImg.style.transform = 'scale(1)';
    groomName.classList.add('show');
    brideName.classList.add('show');
    if (centerName) centerName.classList.add('show');
    topLabel.classList.add('show');
    scrollCue.classList.add('hidden');
    dateReveal.classList.add('show');
    updateHandEffects(1);
    return;
  }

  [groomImg, brideImg].forEach((img) => {
    if (img.complete) refreshStartX();
    else img.addEventListener('load', () => { refreshStartX(); onScroll(); }, { once: true });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  refreshStartX();
  onScroll();
}

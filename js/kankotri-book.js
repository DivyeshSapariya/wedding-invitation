window.initKankotriBook = function () {
  const host = document.getElementById('kankotriBookHost');
  if (!host) return;

  const COVER = `
    <figure class="cover-ganpati">
      <img class="crest crest--ganpati" src="images/ganpati-bappa.svg" alt="શ્રી ગણપતિ બાપ્પા" width="108" height="132" decoding="async" />
      <figcaption class="cover-ganpati__label">॥ શ્રી ગણેશાય નમઃ ॥</figcaption>
    </figure>
    <p class="shloka">વક્રતુંડ મહાકાય સૂર્યકોટિ સમપ્રભઃ ।<br>નિર્વિઘ્નં કુરુ મે દેવ સર્વકાર્યેષુ સર્વદા ॥</p>
    <h1 class="cover-shubh">॥ શુભ વિવાહ ॥</h1>
    <div class="divider"><span class="l"></span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2 4 6 6 10 6-4 2-8 4-10 14-2-10-6-12-10-14 4 0 8-2 10-6z"/></svg><span class="l r"></span></div>
    <p class="cover-date">સોમવાર, તા. ૨૮/૧૧/૨૦૨૨</p>
    <div class="couple cov"><span class="nm">ચિ. દિવ્યેશ</span><span class="amp">સંગ</span><span class="nm">ચિ. બિનલ</span></div>
    <p class="shriman">શ્રીમાન <span class="blank"></span></p>
    <p class="nimantrak-lbl">:: નિમંત્રક ::</p>
    <p class="nimantrak">શ્રી જગદીશભાઈ રામજીભાઈ સાપરીયા<br>અ.સૌ. ગીતાબેન જગદીશભાઈ સાપરીયા</p>
    <p class="addr">એ-૧૦, મેઘમલ્હાર વાટીકા સોસાયટી, ગેટ નં.૧,<br>સુભાષ ગાર્ડનની પાસે, ડો. પાર્ક રોડ,<br>જહાંગીરપુરા, સુરત.</p>
    <p class="mob">મો. ૯૮૨૫૬ ૫૨૬૮૪, ૯૭૨૪૪ ૬૮૦૪૨</p>`;

  const MANGALIK = `
    <div class="top3"><span>॥ જય ગુરુદેવ ॥</span><span>॥ શ્રી ગણેશાય નમઃ ॥</span><span>॥ જય સુરાપુરા<br>(નાનજી) બાપા ॥</span></div>
    <h2 class="mang-title">॥ માંગલીક અવસરો ॥</h2>
    <div class="divider"><span class="l"></span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2 4 6 6 10 6-4 2-8 4-10 14-2-10-6-12-10-14 4 0 8-2 10-6z"/></svg><span class="l r"></span></div>
    <div class="evgrid">
      <div class="evc"><p class="et">મંડપ મુહૂર્ત</p><p class="ed">માગશર સુદ-૪<br>તા. ૨૭/૧૧/૨૦૨૨, રવિવાર</p><p class="etime">સવારે ૭.૩૦ કલાકે</p></div>
      <div class="evc"><p class="et">ભોજન સમારંભ</p><p class="ed">માગશર સુદ-૪<br>તા. ૨૭/૧૧/૨૦૨૨, રવિવાર</p><p class="etime">બપોરે ૧૧.૩૦ કલાકે</p></div>
      <div class="evc"><p class="et">રાસ ગરબા</p><p class="ed">માગશર સુદ-૪<br>તા. ૨૭/૧૧/૨૦૨૨, રવિવાર</p><p class="etime">સાંજે ૮.૦૦ કલાકે</p></div>
      <div class="evc"><p class="et">જાન પ્રસ્થાન</p><p class="ed">માગશર સુદ-૫<br>તા. ૨૮/૧૧/૨૦૨૨, સોમવાર</p><p class="etime">સવારે ૬.૦૦ કલાકે</p></div>
      <div class="evc full"><p class="et">હસ્ત મેળાપ</p><p class="ed">માગશર સુદ-૫ • તા. ૨૮/૧૧/૨૦૨૨, સોમવાર</p><p class="etime">બપોરે ૧.૩૦ કલાકે</p></div>
    </div>
    <p class="grp-h">॥ દર્શનાભિલાષી ॥</p>
    <div class="ncol">
      <span>શ્રી સુનિલ કાંતિલાલ સાપરીયા</span><span>શ્રી હિરેન લવજીભાઈ સાપરીયા</span>
      <span>શ્રી નિરવ હસમુખભાઈ સાપરીયા</span><span>શ્રી નિખીલ દિનેશભાઈ સાપરીયા</span>
    </div>
    <p class="grp-h">॥ મોસાળ પક્ષ ॥</p>
    <div class="ncol">
      <span>સ્વ. બચુભાઈ જુઠાભાઈ ચોટલીયા</span><span>સ્વ. દેવબેન બચુભાઈ ચોટલીયા</span>
      <span>શ્રી અમરશીભાઈ બચુભાઈ ચોટલીયા</span><span>અ.સૌ. દિવાળીબેન અમરશીભાઈ ચોટલીયા</span>
      <span>શ્રી દયાલજીભાઈ બચુભાઈ ચોટલીયા</span><span>સ્વ. નિતાબેન દયાલજીભાઈ ચોટલીયા</span>
    </div>
    <p class="grp-h">॥ ફઈ-ફુવા ॥</p>
    <p class="grp1">અ.સૌ. હેમબેન જેન્તીલાલ ગોહિલ<br>ગં.સ્વ. મુક્તાબેન ચુનીલાલ રામપરીયા</p>
    <p class="grp-h">॥ બેન-બનેવી ॥</p>
    <div class="ncol">
      <span>અ.સૌ. રીનાબેન અમરકુમાર ચોટલીયા</span><span>શ્રી અમરકુમાર જગદિશભાઈ ચોટલીયા</span>
      <span>અ.સૌ. મિતલબેન શૈલેષકુમાર રાઘવાણી</span><span>શ્રી શૈલેષકુમાર વેલજીભાઈ રાઘવાણી</span>
    </div>
    <p class="grp-h">॥ મધુર કલરવ ॥</p>
    <p class="poem">વાંસલડી વિના કાન અધુરો, માન વિના પ્રેમ અધુરો,<br>ફૂલ વિના બગીચો અધુરો, મહેમાન વિના અવસર અધુરો...<br>..... કાજલ, નિલમ, શિત્તલ, મિલન, દિવ્યેશ, પાર્થ .....<br>મારા મામાના લગ્નમાં જરૂરને જરૂર આવજો હો..ને...<br>... કિયાંશ (ભાણેજ) ...</p>`;

  const INVITE = `
    <div class="topgods"><span>॥ શ્રી ગણેશાય નમઃ ॥</span><span>હે ઘોરી<br>ધજાવાળા મામા</span><span>॥ શ્રી ચામુંડા<br>માતાય નમઃ ॥</span></div>
    <p class="swajan">સ્નેહી સ્વજન શ્રી, <span class="blank"></span></p>
    <p class="invite-para">સહર્ષ ખુશાલી સાથ જણાવવાનું કે અમારા કુળદેવી શ્રી ચામુંડા માતાજીની અસીમ કૃપાથી હિરાપર નિવાસી (હાલ સુરત) અ.સૌ. ગીતાબેન તથા શ્રી જગદીશભાઈ રામજીભાઈ સાપરીયા ના સુપુત્ર</p>
    <div class="couple2"><span class="nm">ચિ. દિવ્યેશ</span><span class="mid">ના શુભ લગ્ન</span><span class="nm">ચિ. બિનલ</span></div>
    <p class="invite-para">પડાણા નિવાસી (હાલ ચીખલી) અ.સૌ. ભાવનાબેન તથા શ્રી રામજીભાઈ રણછોડભાઈ ગોહિલની સુપુત્રી સાથે સંવત ૨૦૭૯ ના માગશર સુદ-૫ ને સોમવાર, તા. ૨૮-૧૧-૨૦૨૨ ના શુભદિને નિર્ધાર્ય છે, તો આ શુભ પ્રસંગે નવદંપતિને આશીર્વાદ આપવા સહ પરિવાર પધારવા અમો આપને ભાવભર્યું નિમંત્રણ પાઠવીએ છીએ.</p>
    <p class="snehadhin">॥ સ્નેહાધીન ॥</p>
    <div class="ncol">
      <span>શ્રી રામજીભાઈ હીરજીભાઈ સાપરીયા</span><span>અ.સૌ. કાશીબેન રામજીભાઈ સાપરીયા</span>
      <span>શ્રી નાગજીભાઈ હીરજીભાઈ સાપરીયા</span><span>સ્વ. પ્રભાબેન નાગજીભાઈ સાપરીયા</span>
      <span>શ્રી લક્ષ્મણભાઈ હીરજીભાઈ સાપરીયા</span><span>સ્વ. ગોદાવરીબેન લક્ષ્મણભાઈ સાપરીયા</span>
      <span>શ્રી જગદીશભાઈ રામજીભાઈ સાપરીયા</span><span>અ.સૌ. ગીતાબેન જગદીશભાઈ સાપરીયા</span>
      <span>શ્રી હસમુખભાઈ રામજીભાઈ સાપરીયા</span><span>અ.સૌ. કાંતાબેન હસમુખભાઈ સાપરીયા</span>
      <span>સ્વ. કાંતિલાલ રામજીભાઈ સાપરીયા</span><span>અ.સૌ. કંચનબેન કાંતિલાલ સાપરીયા</span>
      <span>શ્રી લવજીભાઈ રામજીભાઈ સાપરીયા</span><span>અ.સૌ. વનિતાબેન લવજીભાઈ સાપરીયા</span>
      <span>શ્રી રમેશભાઈ નાગજીભાઈ સાપરીયા</span><span>અ.સૌ. ભાનુબેન રમેશભાઈ સાપરીયા</span>
      <span>શ્રી ચમનભાઈ નાગજીભાઈ સાપરીયા</span><span>અ.સૌ. મૈયાબેન ચમનભાઈ સાપરીયા</span>
      <span>શ્રી ગીરધરભાઈ નાગજીભાઈ સાપરીયા</span><span>અ.સૌ. રમાબેન ગીરધરભાઈ સાપરીયા</span>
      <span>શ્રી અમરશીભાઈ નાગજીભાઈ સાપરીયા</span><span>અ.સૌ. ગીતાબેન અમરશીભાઈ સાપરીયા</span>
      <span>શ્રી દિનેશભાઈ લક્ષ્મણભાઈ સાપરીયા</span><span>સ્વ. ગૌરીબેન દિનેશભાઈ સાપરીયા</span>
    </div>
    <div class="venues">
      <div><p class="vh">॥ શુભ સ્થળ ॥</p><p class="vbody">શ્રી જગદીશભાઈ રામજીભાઈ સાપરીયા<br>એ-૧૦, મેઘમલ્હાર વાટીકા સોસાયટી, ગેટ નં.૧, સુભાષ ગાર્ડનની પાસે, ડો. પાર્ક રોડ, જહાંગીરપુરા, સુરત.</p></div>
      <div><p class="vh">॥ લગ્ન સ્થળ ॥</p><p class="vbody">શ્રી રામજીભાઈ રણછોડભાઈ ગોહિલ<br>કોળી પટેલ સમાજની વાડી, સમરોલી, જુના વલસાડ રોડ, ચીખલી, જિ. નવસારી.</p></div>
    </div>`;

  const THANKYOU = `
    <div class="ty-em">🙏</div>
    <h1 class="thankyou">Thank You</h1>
    <p class="ty-sub">॥ આભાર ॥</p>
    <p class="ty-pad">પધારશો જી</p>`;

  const PAGE_DECOR = [
    '<div class="pg-deco" aria-hidden="true">',
    '<span class="pg-deco__mandala pg-deco__mandala--right"></span>',
    '<span class="pg-deco__mandala pg-deco__mandala--top"></span>',
    '<span class="pg-deco__mandala pg-deco__mandala--br"></span>',
    '<span class="pg-deco__garland"></span>',
    '</div>',
  ].join('');
  const wrap = (inner, num, side, variant) =>
    `<div class="pg ${side || ''} ${variant || ''}"><div class="frame">${PAGE_DECOR}<div class="area"><div class="fitbox">${inner}</div></div><p class="pg-num" style="display:none;">${num}</p></div></div>`;

  const PAGES = [
    [COVER, '૧', 'pg--cover'],
    [MANGALIK, '૨', 'pg--mangalik'],
    [INVITE, '૩', 'pg--invite'],
    [THANKYOU, '૪', 'pg--thanks'],
  ];
  const guj = ['૧', '૨', '૩', '૪'];
  const spreadLabels = ['પાનું ૧', 'પાનું ૨–૩', 'પાનું ૪'];

  let used = false;
  function markUsed() {
    if (used) return;
    used = true;
    host.querySelectorAll('.edge-arrow.pulse').forEach((a) => a.classList.remove('pulse'));
  }

  function fitPages() {
    host.querySelectorAll('.area').forEach((area) => {
      const box = area.querySelector('.fitbox');
      if (!box) return;
      box.style.transform = 'none';
      const cs = getComputedStyle(area);
      const availH = area.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const h = box.scrollHeight;
      box.style.transform = h > availH + 1 ? `scale(${availH / h})` : 'none';
    });
  }

  function fitBookLayout() {
    const section = document.getElementById('kankotri');
    const header = section?.querySelector('.kankotri__header');
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const sectionH = section ? section.getBoundingClientRect().height : window.innerHeight;

    const desk = document.querySelector('.kankotri__book-host .deskwrap');
    const sc = document.getElementById('kkScaler');
    const st = document.getElementById('kkStage');

    if (desk && desk.offsetParent !== null && sc && st) {
      const BW = 920;
      const BH = 790;
      const shell = section?.querySelector('.kankotri__book-shell');
      const shellPad = shell ? 48 : 24;
      const chromeH = 118 + shellPad;
      const availH = Math.max(200, sectionH - headerH - chromeH);
      const availW = window.innerWidth - shellPad;
      const s = Math.min(availW / BW, availH / BH, 1);
      sc.style.transform = `scale(${s})`;
      st.style.height = `${BH * s + 8}px`;
    }

    const mwrap = document.querySelector('.kankotri__book-host .mwrap');
    const mbook = document.getElementById('kkMBook');

    if (mwrap && mwrap.offsetParent !== null && mbook) {
      const PW = 460;
      const PH = 790;
      const shell = section?.querySelector('.kankotri__book-shell');
      const shellPad = shell ? 32 : 16;
      const chromeH = 156 + shellPad;
      const availH = Math.max(220, sectionH - headerH - chromeH);
      const availW = window.innerWidth - shellPad;
      const s = Math.min(availW / PW, availH / PH, 1);
      mbook.style.width = `${PW * s}px`;
      mbook.style.height = `${PH * s}px`;
    }
  }

  function initDesktop() {
    const book = document.getElementById('kkBook');
    if (!book) return;

    book.innerHTML =
      `<div class="leaf" data-leaf="0"><div class="face front">${wrap(COVER, '૧', '', 'pg--cover')}</div><div class="face back">${wrap(MANGALIK, '૨', 'l', 'pg--mangalik')}</div></div>` +
      `<div class="leaf" data-leaf="1"><div class="face front">${wrap(INVITE, '૩', 'r', 'pg--invite')}</div><div class="face back">${wrap(THANKYOU, '૪', '', 'pg--thanks')}</div></div>`;

    const leaves = Array.from(book.querySelectorAll('.leaf'));
    const dots = Array.from(document.querySelectorAll('#kkDots .dot'));
    const aPrev = document.getElementById('kkPrev');
    const aNext = document.getElementById('kkNext');
    const count = document.getElementById('kkCount');
    const hint = document.getElementById('kkHint');
    const PW = 460;
    const N = leaves.length;
    let spread = 0;

    function applyZ() {
      leaves.forEach((lf, i) => {
        lf.style.zIndex = lf.classList.contains('flipped') ? 20 + i : 20 + (N - i);
      });
    }

    function render() {
      leaves.forEach((lf, i) => lf.classList.toggle('flipped', i < spread));
      let tx = 0;
      if (spread === 0) tx = -PW / 2;
      else if (spread === N) tx = PW / 2;
      book.style.transform = `translateX(${tx}px)`;
      dots.forEach((d, k) => d.classList.toggle('on', k === spread));
      if (aPrev) aPrev.disabled = spread === 0;
      if (aNext) aNext.disabled = spread === N;
      if (count) count.textContent = spreadLabels[spread];
      if (hint) {
        hint.textContent = spread === 0
          ? 'ખોલવા જમણી બાજુનું તીર (›) દબાવો — અથવા કાર્ડ પર ટેપ કરો'
          : spread === N
            ? 'શરૂથી જોવા ડાબી બાજુનું તીર (‹) દબાવો'
            : 'આગળ-પાછળ જવા બાજુના તીર (‹ ›) દબાવો';
      }
      applyZ();
      fitPages();
    }

    function go(n) {
      markUsed();
      spread = Math.max(0, Math.min(N, n));
      render();
    }

    aNext?.addEventListener('click', (e) => { e.stopPropagation(); go(spread + 1); });
    aPrev?.addEventListener('click', (e) => { e.stopPropagation(); go(spread - 1); });
    dots.forEach((d) => d.addEventListener('click', () => go(+d.dataset.go)));
    book.addEventListener('click', (e) => {
      const r = book.getBoundingClientRect();
      (e.clientX > r.left + r.width / 2) ? go(spread + 1) : go(spread - 1);
    });

    function fit() {
      fitBookLayout();
    }

    window.addEventListener('resize', () => { fit(); fitPages(); });
    document.addEventListener('keydown', (e) => {
      const desk = document.querySelector('.kankotri__book-host .deskwrap');
      if (!desk || desk.offsetParent === null) return;
      if (e.key === 'ArrowRight') go(spread + 1);
      if (e.key === 'ArrowLeft') go(spread - 1);
    });

    fit();
    render();
  }

  function initMobile() {
    const mbook = document.getElementById('kkMBook');
    if (!mbook) return;

    mbook.innerHTML = PAGES.map((p, i) =>
      `<div class="mpage" data-i="${i}">${wrap(p[0], p[1], '', p[2])}</div>`
    ).join('');

    const pages = Array.from(mbook.querySelectorAll('.mpage'));
    const dots = Array.from(document.querySelectorAll('#kkMDots .mdot'));
    const aPrev = document.getElementById('kkMPrev');
    const aNext = document.getElementById('kkMNext');
    const count = document.getElementById('kkMCount');
    const M = pages.length;
    let mi = 0;
    let swiped = false;

    function applyZ() {
      pages.forEach((pg, i) => { pg.style.zIndex = i < mi ? 0 : 100 - i; });
    }

    function render() {
      pages.forEach((pg, i) => pg.classList.toggle('turned', i < mi));
      dots.forEach((d, k) => d.classList.toggle('on', k === mi));
      if (aPrev) aPrev.disabled = mi === 0;
      if (aNext) aNext.disabled = mi === M - 1;
      if (count) count.textContent = `પાનું ${guj[mi]} / ૪`;
      applyZ();
      fitPages();
    }

    function go(n) {
      markUsed();
      mi = Math.max(0, Math.min(M - 1, n));
      render();
    }

    aNext?.addEventListener('click', (e) => { e.stopPropagation(); go(mi + 1); });
    aPrev?.addEventListener('click', (e) => { e.stopPropagation(); go(mi - 1); });
    dots.forEach((d) => d.addEventListener('click', () => go(+d.dataset.go)));

    let sx = null;
    let sy = null;
    mbook.addEventListener('touchstart', (e) => {
      sx = e.changedTouches[0].clientX;
      sy = e.changedTouches[0].clientY;
    }, { passive: true });

    mbook.addEventListener('touchend', (e) => {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        swiped = true;
        dx < 0 ? go(mi + 1) : go(mi - 1);
      }
      sx = null;
    });

    mbook.addEventListener('click', (e) => {
      if (swiped) { swiped = false; return; }
      const r = mbook.getBoundingClientRect();
      (e.clientX > r.left + r.width / 2) ? go(mi + 1) : go(mi - 1);
    });

    document.addEventListener('keydown', (e) => {
      const mob = document.querySelector('.kankotri__book-host .mwrap');
      if (!mob || mob.offsetParent === null) return;
      if (e.key === 'ArrowRight') go(mi + 1);
      if (e.key === 'ArrowLeft') go(mi - 1);
    });

    render();
  }

  initDesktop();
  initMobile();

  fitBookLayout();
  fitPages();
  window.addEventListener('resize', () => {
    fitBookLayout();
    setTimeout(fitPages, 80);
  });
  window.addEventListener('load', () => {
    fitBookLayout();
    setTimeout(fitPages, 150);
  });
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      fitBookLayout();
      setTimeout(fitPages, 60);
    });
  }
};

/**
 * Background music — autoplay after intro with mute/unmute control.
 */
(function () {
  const AUDIO_SRC = 'audio/background.mp3';
  const STORAGE_KEY = 'wedding-audio-muted';

  function initSiteAudio() {
    const audio = document.getElementById('siteAudio');
    const root = document.getElementById('siteAudioControl');
    const btn = document.getElementById('siteAudioToggle');
    if (!audio || !root || !btn) return;

    let playAttempted = false;
    let userUnmuted = false;

    const savedMuted = sessionStorage.getItem(STORAGE_KEY);
    if (savedMuted === '1') {
      audio.muted = true;
      root.classList.add('is-muted');
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', 'અવાજ ચાલુ કરો');
      btn.setAttribute('title', 'અવાજ ચાલુ કરો');
    }

    function setPlayingState(playing) {
      root.classList.toggle('is-playing', playing);
    }

    function setMutedState(muted) {
      audio.muted = muted;
      root.classList.toggle('is-muted', muted);
      btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
      const label = muted ? 'અવાજ ચાલુ કરો' : 'અવાજ બંધ કરો';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      sessionStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
    }

    function showControl() {
      root.classList.add('is-visible');
    }

    async function tryPlay() {
      if (playAttempted && !audio.paused) return true;
      playAttempted = true;

      try {
        await audio.play();
        setPlayingState(true);
        showControl();
        return true;
      } catch (err) {
        setPlayingState(false);
        showControl();
        return false;
      }
    }

    function toggleMute() {
      userUnmuted = true;
      const willMute = !audio.muted;
      setMutedState(willMute);

      if (!willMute) {
        tryPlay();
      }
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMute();
    });

    audio.addEventListener('play', () => setPlayingState(true));
    audio.addEventListener('pause', () => setPlayingState(false));
    audio.addEventListener('ended', () => setPlayingState(false));

    function onFirstInteraction() {
      if (!userUnmuted && savedMuted !== '1') {
        audio.muted = false;
        root.classList.remove('is-muted');
      }
      tryPlay();
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    }

    window.addEventListener('pointerdown', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true });

    function startAfterIntro() {
      showControl();
      if (savedMuted === '1') {
        tryPlay();
        return;
      }
      audio.muted = false;
      root.classList.remove('is-muted');
      tryPlay();
    }

    if (document.body.classList.contains('site-reveal') || document.body.classList.contains('intro-complete')) {
      startAfterIntro();
    } else {
      window.addEventListener('intro:exiting', startAfterIntro, { once: true });
      window.addEventListener('intro:complete', () => {
        if (!playAttempted) startAfterIntro();
      }, { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteAudio);
  } else {
    initSiteAudio();
  }
})();

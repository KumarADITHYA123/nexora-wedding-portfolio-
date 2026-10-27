/**
 * Standalone Production Controller for Template-3
 * Venkata Chandra Sekhar & Varsha Wedding Invitation
 * Features:
 * - Resilient Intro Video & Looping Video Orchestration
 * - Dual Click/Touch Handlers for Zero Ghost-Drop Mobile Interactions
 * - Autoplay-Unlocked Audio Architecture with Sound Toggle
 * - TDZ-Hardened Countdown Engine with Intersection Curtain Reveals
 * - Scroll-Triggered Parallax Family Curtain Mechanics
 * - Luxury Scroll Reveal & Realistic Petal Physics Systems
 */

(function () {
  'use strict';

  // --- 1. Audio Architecture ---
  function initAudio() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    if (!bgMusic || !musicToggle) return;

    let userInteracted = false;

    function playMusic() {
      bgMusic.play().then(() => {
        musicToggle.classList.remove('is-muted');
        musicToggle.setAttribute('aria-pressed', 'true');
      }).catch(() => {
        // Autoplay policy prevented playback, user tap will unlock
      });
    }

    function pauseMusic() {
      bgMusic.pause();
      musicToggle.classList.add('is-muted');
      musicToggle.setAttribute('aria-pressed', 'false');
    }

    function toggleMusic(e) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (bgMusic.paused) {
        playMusic();
      } else {
        pauseMusic();
      }
    }

    window.__bgMusicPlay = playMusic;

    musicToggle.addEventListener('click', toggleMusic);
    musicToggle.addEventListener('touchend', toggleMusic, { passive: false });

    // Universal gesture unlocker
    function unlockAudio() {
      if (!userInteracted) {
        userInteracted = true;
        playMusic();
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      }
    }

    window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
    window.addEventListener('keydown', unlockAudio, { passive: true, once: true });
  }

  // --- 2. Hero & Intro Video Orchestration ---
  function initHero() {
    const hero = document.getElementById('hero');
    const introVideo = document.getElementById('introVideo');
    const heroVideo = document.getElementById('heroVideo');
    const introPlay = document.getElementById('introPlay');
    const introSkip = document.getElementById('introSkip');
    const introCaption = document.getElementById('introCaption');

    if (!hero) return;

    let isIntroStarted = false;
    let isIntroDone = false;

    // Enforce strict scroll lock on both HTML and Body
    document.documentElement.classList.add('intro-open');
    document.body.classList.add('intro-open');

    function blockScroll(e) {
      if (document.documentElement.classList.contains('intro-open')) {
        e.preventDefault();
      }
    }
    window.addEventListener('wheel', blockScroll, { passive: false });
    window.addEventListener('touchmove', blockScroll, { passive: false });

    function finishIntro() {
      if (isIntroDone) return;
      isIntroDone = true;
      isIntroStarted = true;

      if (introPlay) introPlay.classList.add('is-hidden');
      if (introSkip) introSkip.classList.add('is-hidden');
      if (introCaption) introCaption.classList.add('is-out');

      hero.classList.add('intro-done');
      document.documentElement.classList.remove('intro-open');
      document.body.classList.remove('intro-open');

      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);

      if (heroVideo) {
        heroVideo.currentTime = 0;
        heroVideo.play().catch(() => {});
      }

      if (window.__bgMusicPlay) {
        window.__bgMusicPlay();
      }

      initPetals();
    }

    function startIntro(e) {
      if (isIntroStarted || isIntroDone) return;
      if (e) {
        e.stopPropagation();
      }
      isIntroStarted = true;

      if (introPlay) introPlay.classList.add('is-hidden');
      if (introCaption) introCaption.classList.add('is-shown');

      if (window.__bgMusicPlay) {
        window.__bgMusicPlay();
      }

      if (introVideo) {
        introVideo.currentTime = 0;
        introVideo.play().catch(() => {
          finishIntro();
        });
      } else {
        finishIntro();
      }
    }

    // Tap on prompt button
    if (introPlay) {
      introPlay.addEventListener('click', startIntro);
      introPlay.addEventListener('touchend', (e) => {
        e.preventDefault();
        startIntro(e);
      }, { passive: false });
    }

    // Tap anywhere on hero screen also starts intro
    hero.addEventListener('click', (e) => {
      if (!isIntroStarted && !isIntroDone) {
        if (!e.target.closest('#musicToggle') && !e.target.closest('.credit-pill') && !e.target.closest('#introSkip')) {
          startIntro(e);
        }
      }
    });
    hero.addEventListener('touchend', (e) => {
      if (!isIntroStarted && !isIntroDone) {
        if (!e.target.closest('#musicToggle') && !e.target.closest('.credit-pill') && !e.target.closest('#introSkip')) {
          e.preventDefault();
          startIntro(e);
        }
      }
    }, { passive: false });

    if (introSkip) {
      introSkip.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        finishIntro();
      });
      introSkip.addEventListener('touchend', (e) => {
        e.stopPropagation();
        e.preventDefault();
        finishIntro();
      }, { passive: false });
    }

    if (introVideo) {
      introVideo.addEventListener('timeupdate', () => {
        if (introVideo.duration && introVideo.currentTime >= introVideo.duration - 0.4) {
          finishIntro();
        }
      });
      introVideo.addEventListener('ended', finishIntro);
      introVideo.addEventListener('error', finishIntro);
    }
  }

  // --- 3. TDZ-Hardened Countdown Engine ---
  function initCountdown() {
    const daysEl = document.querySelector('[data-days]');
    const hoursEl = document.querySelector('[data-hours]');
    const minutesEl = document.querySelector('[data-minutes]');
    const secondsEl = document.querySelector('[data-seconds]');
    const countdown = document.getElementById('countdown');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // Muhurtham Date: 23 August 2026 5:45 AM IST (UTC+05:30)
    let targetDate = new Date('2026-08-23T05:45:00+05:30').getTime();
    // Roll forward to 2027 if 2026 date has elapsed relative to client clock
    if (targetDate - Date.now() <= 0) {
      targetDate = new Date('2027-08-23T05:45:00+05:30').getTime();
    }
    let timer = null; // TDZ guard declaration

    function tick() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        if (timer) clearInterval(timer);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      daysEl.textContent = String(d).padStart(2, '0');
      hoursEl.textContent = String(h).padStart(2, '0');
      minutesEl.textContent = String(m).padStart(2, '0');
      secondsEl.textContent = String(s).padStart(2, '0');
    }

    tick();
    timer = setInterval(tick, 1000);

    // Open countdown curtains when section enters viewport
    if (countdown) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            countdown.classList.add('is-open');
          }
        });
      }, { threshold: 0.25 });
      obs.observe(countdown);
    }
  }

  // --- 4. Family Curtains Scroll Parallax ---
  function initCurtainsParallax() {
    const familySection = document.getElementById('family');
    if (!familySection) return;

    const leftCurtain = familySection.querySelector('.family__curtain--left');
    const rightCurtain = familySection.querySelector('.family__curtain--right');
    if (!leftCurtain || !rightCurtain) return;

    let ticking = false;

    function updateParallax() {
      const rect = familySection.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // Calculate progress when section is in or entering viewport
      if (rect.top <= vh && rect.bottom >= 0) {
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height * 0.7)));
        // Interpolate --curtain-x from -8% to -26%
        const offset = -8 - (progress * 18);
        leftCurtain.style.setProperty('--curtain-x', offset + '%');
        rightCurtain.style.setProperty('--curtain-x', offset + '%');
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    updateParallax();
  }

  // --- 5. Luxury Scroll Reveal Animations ---
  function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => obs.observe(el));
  }

  // --- 6. Falling Petals System ---
  function initPetals() {
    if (document.querySelector('.petals')) return;

    const container = document.createElement('div');
    container.className = 'petals';
    container.setAttribute('aria-hidden', 'true');

    const petalCount = 18;
    for (let i = 0; i < petalCount; i++) {
      const p = document.createElement('div');
      p.className = 'petal';

      const size = 18 + Math.floor(Math.random() * 16); // 18px - 34px
      const dur = 14 + Math.floor(Math.random() * 14); // 14s - 28s
      const delay = Math.random() * 14; // 0s - 14s
      const drift = -40 + Math.floor(Math.random() * 80); // -40px to +40px
      const spin = 180 + Math.floor(Math.random() * 540); // 180deg to 720deg
      const op = (0.5 + Math.random() * 0.45).toFixed(2);
      const left = Math.floor(Math.random() * 100);

      p.style.left = left + '%';
      p.style.setProperty('--size', size + 'px');
      p.style.setProperty('--dur', dur + 's');
      p.style.setProperty('--delay', delay.toFixed(1) + 's');
      p.style.setProperty('--drift', drift + 'px');
      p.style.setProperty('--spin', spin + 'deg');
      p.style.setProperty('--op', op);

      container.appendChild(p);
    }

    document.body.appendChild(container);
  }

  // --- 7. Luxury Media Protection ---
  function initProtection() {
    document.addEventListener('contextmenu', (e) => {
      if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO')) {
        e.preventDefault();
      }
    });
  }

  // --- Initialization Lifecycle ---
  document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    initHero();
    initCountdown();
    initCurtainsParallax();
    initScrollReveals();
    initProtection();
  });
})();

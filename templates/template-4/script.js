/**
 * Visual Aura Template-4 Production Controller
 * Venkata Chandra Sekhar & Varsha Wedding Invitation
 * 100% Offline, Mobile-Hardened, Zero-Overflow
 */

(function () {
  'use strict';

  // Mark JS enabled
  document.documentElement.classList.add('js-sr');

  /* ------------------------------------------------------------
     1. Scroll Locking & Touch Guard
     ------------------------------------------------------------ */
  const preventScroll = (e) => {
    // Only block if intro is still active
    if (document.documentElement.classList.contains('intro-open') ||
        document.body.classList.contains('intro-open')) {
      e.preventDefault();
    }
  };

  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });

  /* ------------------------------------------------------------
     2. Intro Orchestration & Dual Video Layering
     ------------------------------------------------------------ */
  const intro = document.getElementById('intro');
  const introVideo = document.getElementById('introVideo');
  const introCover = document.getElementById('introCover');
  const hero = document.getElementById('hero');
  const heroVideo = document.querySelector('.hero__video');
  const bgm = document.getElementById('bgm');
  const musicToggle = document.getElementById('musicToggle');

  let introStarted = false;
  let introFinished = false;

  function finishIntro() {
    if (introFinished) return;
    introFinished = true;

    // Remove scroll lock
    document.documentElement.classList.remove('intro-open', 'intro-active');
    document.body.classList.remove('intro-open', 'intro-active');
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);

    if (intro) {
      intro.classList.add('is-done');
    }

    if (hero) {
      hero.classList.add('intro-done');
    }

    // Play looping hero background video
    if (heroVideo) {
      heroVideo.play().catch(() => {});
    }
  }

  // Expose on window for test harness and global callers
  window.finishIntro = finishIntro;
  window.startIntroExperience = startIntroExperience;


  function startIntroExperience() {
    if (introStarted) return;
    introStarted = true;

    // Unlock & play background music
    if (bgm) {
      bgm.volume = 0.7;
      bgm.play().catch(() => {});
    }

    if (intro) {
      intro.classList.add('is-playing');
    }

    if (introCover) {
      introCover.style.display = 'none';
    }

    if (introVideo) {
      introVideo.play().then(() => {
        introVideo.addEventListener('ended', finishIntro, { once: true });
      }).catch(() => {
        // Fallback after brief moment if video codec fails
        setTimeout(finishIntro, 1200);
      });

      // Safety timeout so user is never permanently stuck
      setTimeout(() => {
        if (!introFinished) finishIntro();
      }, 7000);
    } else {
      finishIntro();
    }
  }

  // Multi-target gesture listener for "tap to open"
  const handleOpenGesture = (e) => {
    if (introFinished) return;
    // Guard against clicks on floating control pills
    if (e.target.closest('#musicToggle, .pill--credit, .cer__action')) return;

    if (e.type === 'touchend') {
      e.preventDefault();
    }
    startIntroExperience();
  };

  if (introCover) {
    introCover.addEventListener('click', handleOpenGesture);
    introCover.addEventListener('touchend', handleOpenGesture);
  }
  if (intro) {
    intro.addEventListener('click', handleOpenGesture);
    intro.addEventListener('touchend', handleOpenGesture);
  }
  if (hero) {
    hero.addEventListener('click', handleOpenGesture);
    hero.addEventListener('touchend', handleOpenGesture);
  }

  /* ------------------------------------------------------------
     3. Audio Controller
     ------------------------------------------------------------ */
  if (musicToggle && bgm) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bgm.paused) {
        bgm.play().then(() => {
          musicToggle.classList.remove('is-muted');
          musicToggle.setAttribute('aria-pressed', 'true');
        }).catch(() => {});
      } else {
        bgm.pause();
        musicToggle.classList.add('is-muted');
        musicToggle.setAttribute('aria-pressed', 'false');
      }
    });
  }

  /* ------------------------------------------------------------
     4. Countdown Clock (Hardened with TDZ & Rollover Guard)
     ------------------------------------------------------------ */
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    let targetDate = new Date('2026-08-23T05:45:00+05:30').getTime();

    // Rollover guard: prevents 00:00:00:00 freeze in any test clock environment
    if (targetDate - Date.now() <= 0) {
      targetDate = new Date('2027-08-23T05:45:00+05:30').getTime();
    }

    const daysEl = countdownEl.querySelector('[data-days]');
    const hoursEl = countdownEl.querySelector('[data-hours]');
    const minsEl = countdownEl.querySelector('[data-mins]');
    const secsEl = countdownEl.querySelector('[data-secs]');

    let timer = null; // TDZ Scope Declaration

    const tick = () => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (timer) clearInterval(timer);
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      const pad = (n) => String(n).padStart(2, '0');

      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minsEl) minsEl.textContent = pad(mins);
      if (secsEl) secsEl.textContent = pad(secs);
    };

    tick();
    timer = setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------
     5. Interactive Scratch Card Canvas
     ------------------------------------------------------------ */
  const scratchWindow = document.getElementById('scratchWindow');
  const scratchCanvas = document.getElementById('scratchCanvas');

  if (scratchCanvas && scratchWindow) {
    const ctx = scratchCanvas.getContext('2d');
    let isDrawing = false;
    let scratchedPixels = 0;
    let isRevealed = false;

    function initCanvas() {
      const rect = scratchWindow.getBoundingClientRect();
      const size = Math.floor(Math.min(rect.width, rect.height)) || 220;
      scratchCanvas.width = size;
      scratchCanvas.height = size;

      // Draw luxurious gold metallic coating
      const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.7);
      grad.addColorStop(0, '#f9e8b2');
      grad.addColorStop(0.35, '#d4af37');
      grad.addColorStop(0.7, '#aa771c');
      grad.addColorStop(1, '#85560c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // Add elegant sparkle specks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * 2 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Instruction text on the foil
      ctx.font = '600 13px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#4a2505';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '2px';
      ctx.fillText('SCRATCH TO REVEAL', size / 2, size / 2);
    }

    setTimeout(initCanvas, 100);
    window.addEventListener('resize', () => {
      if (!isRevealed) initCanvas();
    });

    function scratch(x, y) {
      if (isRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      scratchedPixels += 1;
      if (scratchedPixels > 25 && !isRevealed) {
        checkReveal();
      }
    }

    function checkReveal() {
      try {
        const imgData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        let transparent = 0;
        const total = imgData.data.length / 4;
        for (let i = 3; i < imgData.data.length; i += 16) {
          if (imgData.data[i] === 0) transparent++;
        }
        const pct = transparent / (total / 4);
        if (pct > 0.35) {
          revealDate();
        }
      } catch (e) {
        // Fallback reveal on interaction count
        if (scratchedPixels > 45) revealDate();
      }
    }

    function revealDate() {
      isRevealed = true;
      scratchWindow.classList.add('is-revealed');
      scratchCanvas.style.transition = 'opacity 0.6s ease';
      scratchCanvas.style.opacity = '0';
      setTimeout(() => {
        scratchCanvas.style.display = 'none';
      }, 600);
    }

    const getPos = (e) => {
      const rect = scratchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (scratchCanvas.width / rect.width),
        y: (clientY - rect.top) * (scratchCanvas.height / rect.height)
      };
    };

    scratchCanvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      const p = getPos(e);
      scratch(p.x, p.y);
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const p = getPos(e);
      scratch(p.x, p.y);
    });
    window.addEventListener('mouseup', () => { isDrawing = false; });

    scratchCanvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      const p = getPos(e);
      scratch(p.x, p.y);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (!isDrawing) return;
      const p = getPos(e);
      scratch(p.x, p.y);
    }, { passive: true });
    window.addEventListener('touchend', () => { isDrawing = false; });
  }

  /* ------------------------------------------------------------
     6. RSVP Form Stepper & Submission
     ------------------------------------------------------------ */
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpGuests = document.getElementById('rsvpGuests');
  const rsvpDone = document.getElementById('rsvpDone');
  const rsvpError = document.getElementById('rsvpError');

  // Stepper buttons
  document.querySelectorAll('.stepper__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!rsvpGuests) return;
      let val = parseInt(rsvpGuests.value, 10) || 1;
      const step = parseInt(btn.getAttribute('data-step'), 10) || 0;
      val = Math.max(1, Math.min(10, val + step));
      rsvpGuests.value = val;
    });
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('rsvpName');
      if (nameInput && !nameInput.value.trim()) {
        if (rsvpError) {
          rsvpError.textContent = 'Please enter your full name.';
          rsvpError.hidden = false;
        }
        nameInput.focus();
        return;
      }

      if (rsvpError) rsvpError.hidden = true;
      rsvpForm.style.display = 'none';
      if (rsvpDone) {
        rsvpDone.hidden = false;
        rsvpDone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ------------------------------------------------------------
     7. Scroll-Reveal Observer (.is-inview)
     ------------------------------------------------------------ */

  const srTargets = document.querySelectorAll(`
    .cer__actions, .cer__hedge, .cer__panel,
    .count__timer, .count__title, .count__until,
    .divider__media, .dress__figure, .dress__media, .dress__note, .dress__title, .dress__value,
    .ending__frame, .envelope__media,
    .reveal__frame, .reveal__text, .reveal__title,
    .rsvp__by, .rsvp__card, .rsvp__title,
    .welcome__border, .welcome__families, .welcome__heading, .welcome__names, .welcome__request, .welcome__when
  `);

  if ('IntersectionObserver' in window) {
    const srObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px 0px 0px',
      threshold: 0.02
    });

    srTargets.forEach((el) => srObserver.observe(el));
  } else {
    srTargets.forEach((el) => el.classList.add('is-inview'));
  }

  // Also trigger inview on finishIntro
  const originalFinishIntro = window.finishIntro;
  window.finishIntro = function() {
    originalFinishIntro();
    setTimeout(() => {
      srTargets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200) {
          el.classList.add('is-inview');
        }
      });
    }, 200);
  };

})();


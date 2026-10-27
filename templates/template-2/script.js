/* ============================================================
   Template 2 JavaScript Controller (Mobile Hardened & Offline)
   ============================================================ */

document.documentElement.classList.add('js');

// 1. Countdown Target (Muhurtham: 23 Aug 2026, 5:45 AM IST)
const WEDDING_DATE = new Date(2026, 7, 23, 5, 45); // Month 7 = August

/* ----------------------------- Countdown ----------------------------- */
(function countdown() {
  const root = document.querySelector('.countdown');
  const doneMsg = document.querySelector('.countdown__done');
  if (!root) return;

  const cells = {
    days: root.querySelector('[data-unit="days"]'),
    hours: root.querySelector('[data-unit="hours"]'),
    minutes: root.querySelector('[data-unit="minutes"]'),
    seconds: root.querySelector('[data-unit="seconds"]'),
  };

  const pad = (n) => String(n).padStart(2, '0');
  let timer = null;

  function tick() {
    const diff = WEDDING_DATE - new Date();

    if (diff <= 0) {
      if (doneMsg) doneMsg.hidden = false;
      if (cells.days) cells.days.textContent = '00';
      if (cells.hours) cells.hours.textContent = '00';
      if (cells.minutes) cells.minutes.textContent = '00';
      if (cells.seconds) cells.seconds.textContent = '00';
      if (timer) clearInterval(timer);
      return;
    }

    const s = Math.floor(diff / 1000);
    if (cells.days) cells.days.textContent = pad(Math.floor(s / 86400));
    if (cells.hours) cells.hours.textContent = pad(Math.floor(s / 3600) % 24);
    if (cells.minutes) cells.minutes.textContent = pad(Math.floor(s / 60) % 60);
    if (cells.seconds) cells.seconds.textContent = pad(s % 60);
  }

  tick();
  timer = setInterval(tick, 1000);
})();

/* ----------------------------- Background Music ----------------------------- */
(function bgMusic() {
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  if (!btn || !audio) return;

  const TARGET_VOL = 0.75;
  let userMuted = false;

  function setState(isPlaying) {
    btn.classList.toggle('is-playing', isPlaying);
    btn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    btn.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
  }

  // Set initial state
  setState(true);

  function playSound() {
    if (userMuted) return;
    audio.volume = TARGET_VOL;
    const p = audio.play();
    if (p !== undefined) {
      p.then(() => {
        setState(true);
      }).catch((e) => {
        console.log('Audio primed, awaiting gesture:', e);
      });
    }
  }

  function pauseSound() {
    audio.pause();
    setState(false);
  }

  playSound();

  function unlockAudio() {
    if (!userMuted && audio.paused) {
      playSound();
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  }
  document.addEventListener('click', unlockAudio, { passive: true });
  document.addEventListener('touchstart', unlockAudio, { passive: true });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (audio.paused) {
      userMuted = false;
      playSound();
    } else {
      userMuted = true;
      pauseSound();
    }
  });

  window.__bgMusicPlay = function () {
    if (!userMuted) playSound();
  };
})();

/* ----------------------------- Intro Film Overlay ----------------------------- */
(function intro() {
  const root = document.getElementById('intro');
  if (!root) return;

  const video = root.querySelector('.intro__video');
  const cover = root.querySelector('.intro__cover');
  const hint = root.querySelector('.intro__hint');
  const seal = root.querySelector('#introSeal');

  let started = false;
  let dismissed = false;

  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    try { if (video) video.pause(); } catch (e) {}
    root.classList.add('intro--done');
    if (window.__bgMusicPlay) window.__bgMusicPlay();
    
    // Start ambient hero video
    const heroVid = document.getElementById('heroVid');
    if (heroVid) {
      heroVid.muted = true;
      try { heroVid.play(); } catch (e) {}
    }

    setTimeout(() => {
      root.remove();
      document.body.classList.remove('intro-open');
    }, 600);
  }

  function start(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (started || dismissed) return;
    started = true;
    root.classList.add('is-playing');

    if (window.__bgMusicPlay) window.__bgMusicPlay();

    if (video) {
      video.muted = true;
      const p = video.play();
      if (p && p.catch) {
        p.catch(() => {
          dismiss();
        });
      }
    } else {
      dismiss();
    }

    setTimeout(() => {
      if (cover) cover.style.display = 'none';
      if (hint) hint.style.display = 'none';
      if (seal) seal.style.display = 'none';
    }, 450);
  }

  // Dual touch & click support
  if (seal) {
    seal.addEventListener('click', start);
    seal.addEventListener('touchend', (e) => { e.preventDefault(); start(e); });
  }
  if (hint) {
    hint.addEventListener('click', start);
    hint.addEventListener('touchend', (e) => { e.preventDefault(); start(e); });
  }

  root.addEventListener('click', start);
  root.addEventListener('touchend', (e) => {
    if (!started) {
      e.preventDefault();
      start(e);
    }
  });

  if (video) {
    video.addEventListener('ended', dismiss);
    video.addEventListener('error', dismiss);
  }
})();

/* ----------------------------- Events Carousel ----------------------------- */
(function eventsCarousel() {
  const carousel = document.querySelector('.events');
  if (!carousel) return;

  const track = carousel.querySelector('.events__track');
  const prevBtn = carousel.querySelector('.events__arrow[data-dir="-1"]');
  const nextBtn = carousel.querySelector('.events__arrow[data-dir="1"]');
  const dotsContainer = carousel.querySelector('.events__dots');
  const cards = carousel.querySelectorAll('.events__card');
  if (!track || !cards.length) return;

  // Generate dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'events__dot' + (i === 0 ? ' is-active' : '');
      d.setAttribute('aria-label', `Go to event ${i + 1}`);
      d.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      dotsContainer.appendChild(d);
    });
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.events__dot') : [];

  function updateDots() {
    const scrollLeft = track.scrollLeft;
    const width = track.clientWidth;
    const activeIndex = Math.round(scrollLeft / width);
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeIndex);
    });
  }

  track.addEventListener('scroll', updateDots, { passive: true });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
    });
  }
})();

/* ----------------------------- Gallery Carousel (Autoplay on Viewport) ----------------------------- */
(function galleryCarousel() {
  const gallery = document.querySelector('.gallery');
  const section = document.getElementById('celebrate');
  if (!gallery) return;

  const track = gallery.querySelector('.gallery__track');
  const dotsContainer = gallery.querySelector('.gallery__dots');
  const slides = gallery.querySelectorAll('.gallery__slide');
  if (!track || !slides.length) return;

  const INTERVAL_MS = 2800;
  let currentIndex = 0;
  let autoTimer = null;
  let isInteracting = false;
  let resumeTimer = null;
  let inView = false;

  // Generate dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'gallery__dot' + (i === 0 ? ' is-active' : '');
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      d.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(i);
        pauseAndResume();
      });
      dotsContainer.appendChild(d);
    });
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.gallery__dot') : [];

  function updateDots(idx) {
    dots.forEach((dot, i) => {
      const active = i === idx;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function getSlideTargetLeft(idx) {
    const slide = slides[idx];
    if (!slide) return 0;
    return slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;
  }

  function goToSlide(idx) {
    currentIndex = (idx + slides.length) % slides.length;
    track.scrollTo({
      left: getSlideTargetLeft(currentIndex),
      behavior: 'smooth'
    });
    updateDots(currentIndex);
  }

  function nextSlide() {
    if (!inView || isInteracting) return;
    goToSlide(currentIndex + 1);
  }

  function startAutoplay() {
    stopAutoplay();
    if (inView && !isInteracting && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      autoTimer = setInterval(nextSlide, INTERVAL_MS);
    }
  }

  function stopAutoplay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function pauseAndResume() {
    stopAutoplay();
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      isInteracting = false;
      startAutoplay();
    }, 3500);
  }

  // Detect user swipe / scroll
  let scrollTimeout = null;
  track.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let closestIdx = 0;
      let minDiff = Infinity;
      slides.forEach((s, i) => {
        const slideCenter = s.offsetLeft + s.clientWidth / 2;
        const diff = Math.abs(slideCenter - trackCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      });
      currentIndex = closestIdx;
      updateDots(currentIndex);
    }, 50);
  }, { passive: true });

  // Touch & pointer pauses
  track.addEventListener('touchstart', () => {
    isInteracting = true;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', () => {
    pauseAndResume();
  }, { passive: true });

  track.addEventListener('mouseenter', () => {
    isInteracting = true;
    stopAutoplay();
  });

  track.addEventListener('mouseleave', () => {
    pauseAndResume();
  });

  // Activate autoplay strictly when section is visible in viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        startAutoplay();
      } else {
        stopAutoplay();
      }
    }, { threshold: 0.2 });
    observer.observe(section || gallery);
  } else {
    inView = true;
    startAutoplay();
  }
})();

/* ----------------------------- Couple Parallax Scroll ----------------------------- */
(function coupleParallax() {
  const fig = document.querySelector('.couple__photo');
  const section = document.getElementById('couple');
  if (!fig || !section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const TRAVEL = 0.55;
  function update() {
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const span = vh + r.height;
    const p = span > 0 ? (vh - r.top) / span : 0;
    const clamped = Math.max(0, Math.min(1, p));
    const shift = (clamped - 0.25) * r.height * TRAVEL;
    fig.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();


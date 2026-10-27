/* ============================================================
   Edit these two lines and the whole page follows.
   Month is 1-based here. Time is local to the reader's device.
   ============================================================ */
const WEDDING = new Date(2026, 7, 23, 5, 45); // 23 Aug 2026, 5:45 AM muhurtham

/* Marks the document as scripted. The scroll-in styles hang off this, so
   that with JavaScript off the text is simply visible rather than stuck
   at opacity 0 waiting for an observer that never runs. */
document.documentElement.classList.add('js');

/* ----------------------------- Countdown ----------------------------- */
(function countdown() {
  const root = document.getElementById('count');
  if (!root) return;

  const cells = {
    days:    root.querySelector('[data-unit="days"]'),
    hours:   root.querySelector('[data-unit="hours"]'),
    minutes: root.querySelector('[data-unit="minutes"]'),
    seconds: root.querySelector('[data-unit="seconds"]'),
  };

  const pad = (n) => String(n).padStart(2, '0');
  let timer = null;

  function tick() {
    let diff = WEDDING - new Date();

    if (diff <= 0) {
      root.innerHTML = '<li style="grid-column:1/-1"><b>Today</b><span>The day is here</span></li>';
      if (timer) clearInterval(timer);
      return;
    }

    const s = Math.floor(diff / 1000);
    cells.days.textContent    = Math.floor(s / 86400);
    cells.hours.textContent   = pad(Math.floor(s / 3600) % 24);
    cells.minutes.textContent = pad(Math.floor(s / 60) % 60);
    cells.seconds.textContent = pad(s % 60);
  }

  tick();
  timer = setInterval(tick, 1000);
})();

/* ---------------------------- Firecrackers ----------------------------
   Two "anar" fountains, one flanking each side of the date card. They
   throw sparks up and inward so the arcs rise, converge over the card and
   rain back down around it — with crackles going off along the arcs and
   smoke drifting off the cones. Runs about six seconds, then the canvas
   removes itself so nothing lingers over the artwork and no rAF loop
   stays alive.
--------------------------------------------------------------------- */
function firecrackers(originEl) {
  const hero = document.querySelector('.hero');
  if (!hero || !originEl) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Saturated and hot — the hero sky is pale cream, so anything
  // near-white simply disappears against it.
  const SPARKS = ['#F5A623', '#E0561B', '#C1350F', '#A8681B', '#D9636F', '#6E2A24'];

  const heroBox = hero.getBoundingClientRect();
  const from = originEl.getBoundingClientRect();
  const W = heroBox.width;
  const H = heroBox.height;

  const card = {
    left:   from.left - heroBox.left,
    right:  from.right - heroBox.left,
    top:    from.top - heroBox.top,
    bottom: from.bottom - heroBox.top,
    cx:     from.left - heroBox.left + from.width / 2,
    cy:     from.top - heroBox.top + from.height / 2,
  };

  const canvas = document.createElement('canvas');
  canvas.className = 'firecrackers';
  canvas.setAttribute('aria-hidden', 'true');
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  // Particles don't need retina crispness, and this canvas is cleared + refilled
  // every frame. A cheap Android reports dpr 2.5-3; at that scale the full-hero
  // fill alone (millions of px/frame) is what stalls the animation. Cap at 1.5.
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round';

  const GRAVITY = 0.16;
  const DRAG = 0.985;
  const TRAIL = 3.4;

  const EMIT_MS = 4600;   // how long the cones burn
  const RAMP = 320;       // catch and die-back time

  /* A cone at each bottom corner of the card, aimed almost straight up so
     the spray climbs the card's sides and arcs over the top rather than
     across the middle — the date has to stay readable through all this. */
  const baseY = Math.min(card.bottom + 12, H - 24);
  const LEAN = Math.PI * 0.455;   // 82° off horizontal — barely off vertical
  const emitters = [
    { x: card.left + 8,  aim: -LEAN,             y: baseY },
    { x: card.right - 8, aim: -(Math.PI - LEAN), y: baseY },
  ];

  const sparks = [];
  const flashes = [];
  const smoke = [];

  // Hard ceiling on live sparks. Without it a slow frame grows `step`, which
  // spawns more sparks, which slows the next frame — a spiral that reads as
  // the animation "sticking". Capping the feed bounds the per-frame cost.
  const MAX_SPARKS = 300;

  // No Math.random (unavailable in some hosts, and it makes replays jitter),
  // so the spray is shaped by a cheap deterministic hash instead.
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  /* Cones catch quickly, hold, then die back */
  function intensity(ms) {
    if (ms < 0) return 0;
    if (ms < RAMP) return ms / RAMP;
    if (ms > EMIT_MS) return 0;
    if (ms > EMIT_MS - RAMP * 2) return (EMIT_MS - ms) / (RAMP * 2);
    return 1;
  }

  function throwSpark(e, power) {
    const angle = e.aim + (rnd() - 0.5) * 0.56;
    const speed = power * (0.62 + rnd() * 0.62);
    sparks.push({
      x: e.x + (rnd() - 0.5) * 7,
      y: e.y + (rnd() - 0.5) * 5,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      max: 46 + rnd() * 34,
      size: 1.1 + rnd() * 1.4,
      colour: SPARKS[Math.floor(rnd() * SPARKS.length)],
    });
  }

  const start = performance.now();
  let last = start;
  let crackleAt = 420;
  let finaleDone = false;

  function frame(now) {
    const elapsed = now - start;
    // Frame-rate independent: a 120Hz screen must not get twice the sparks.
    // Clamp to ~2 frames (34ms): a single slow frame then can't translate into
    // a spawn burst or a big physics jump, both of which compound the jank.
    const step = Math.min(now - last, 34) / 16.7;
    last = now;

    const power = intensity(elapsed);

    /* Feed both cones */
    if (power > 0) {
      for (const e of emitters) {
        const n = 3.4 * power * step;
        const whole = Math.floor(n) + (rnd() < n % 1 ? 1 : 0);
        if (sparks.length < MAX_SPARKS) {
          for (let i = 0; i < whole; i++) throwSpark(e, 9.4);
        }

        // Burning cone at the mouth
        if (rnd() < 0.5 * step) {
          flashes.push({ x: e.x, y: e.y, r: 15 + rnd() * 9, life: 0, max: 9 });
        }
        if (rnd() < 0.14 * step) {
          smoke.push({
            x: e.x, y: e.y - 6,
            vx: (e.aim < -Math.PI / 2 ? -0.3 : 0.3) * rnd(),
            vy: -0.34 - rnd() * 0.3,
            r: 9 + rnd() * 7, life: 0, max: 74 + rnd() * 46,
          });
        }
      }
    }

    /* Crackles going off along the arcs, over the card */
    if (elapsed > crackleAt && elapsed < EMIT_MS) {
      crackleAt = elapsed + 150 + rnd() * 210;
      // Kept above the card so they never sit on top of the date
      const cx = card.left + rnd() * (card.right - card.left);
      const cy = card.top - 72 + rnd() * 62;
      flashes.push({ x: cx, y: cy, r: 17 + rnd() * 12, life: 0, max: 13 });
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12 + rnd() * 0.5;
        const sp = 2.6 + rnd() * 2.2;
        sparks.push({
          x: cx, y: cy,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.5,
          life: 0, max: 26 + rnd() * 22,
          size: 1.0 + rnd() * 1.2,
          colour: SPARKS[Math.floor(rnd() * SPARKS.length)],
        });
      }
    }

    /* Both cones flare together as they go out */
    if (!finaleDone && elapsed >= EMIT_MS - RAMP * 2) {
      finaleDone = true;
      for (const e of emitters) {
        flashes.push({ x: e.x, y: e.y, r: 42, life: 0, max: 18 });
        for (let i = 0; i < 46; i++) throwSpark(e, 13.5);
      }
    }

    ctx.clearRect(0, 0, W, H);

    /* Smoke sits behind everything */
    for (let i = smoke.length - 1; i >= 0; i--) {
      const p = smoke[i];
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.r += 0.42 * step;
      p.life += step;
      if (p.life > p.max) { smoke.splice(i, 1); continue; }

      const a = (1 - p.life / p.max) * 0.2;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `rgba(126, 106, 92, ${a})`);
      g.addColorStop(1, 'rgba(126, 106, 92, 0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Sparks */
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.vx *= Math.pow(DRAG, step);
      s.vy = s.vy * Math.pow(DRAG, step) + GRAVITY * step;
      s.x += s.vx * step;
      s.y += s.vy * step;
      s.life += step;
      if (s.life > s.max || s.y > H + 40) { sparks.splice(i, 1); continue; }

      const t = s.life / s.max;
      const fade = t < 0.45 ? 1 : 1 - (t - 0.45) / 0.55;
      // Crackers crackle — flicker the tail rather than fading it smoothly
      const flicker = t > 0.5 && (Math.floor(s.life) % 3 === 0) ? 0.45 : 1;

      // One plain stroke per spark — no shadowBlur (a full gaussian blur per
      // stroke) and no halo underlay. Both are fill-rate traps on weak GPUs,
      // which is exactly where this animation was stalling.
      ctx.globalAlpha = Math.max(fade, 0) * flicker;
      ctx.strokeStyle = s.colour;
      ctx.lineWidth = s.size * (0.5 + fade * 0.6);
      ctx.beginPath();
      ctx.moveTo(s.x - s.vx * TRAIL, s.y - s.vy * TRAIL);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    }

    /* Flashes on top */
    ctx.shadowBlur = 0;
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i];
      f.life += step;
      if (f.life > f.max) { flashes.splice(i, 1); continue; }

      const t = f.life / f.max;
      const r = f.r * (0.35 + t * 0.9);
      const a = (1 - t) * 0.9;
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
      g.addColorStop(0, `rgba(255, 214, 130, ${a})`);
      g.addColorStop(0.45, `rgba(240, 140, 40, ${a * 0.7})`);
      g.addColorStop(1, 'rgba(224, 86, 27, 0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (sparks.length || flashes.length || smoke.length || elapsed < EMIT_MS) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(frame);
}

/* -------------------- Scratch-to-reveal (the date) --------------------
   Lays a gold foil <canvas> over .scratch__content and rubs it away with
   destination-out strokes. Built pointer-first so one code path covers
   finger, stylus and mouse. Never runs if JS is off — the date just shows.
--------------------------------------------------------------------- */
(function scratch() {
  const box = document.getElementById('scratch');
  if (!box || !window.PointerEvent) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return; // scratching is a motion gesture — leave it revealed

  const canvas = document.createElement('canvas');
  canvas.className = 'scratch__cover';
  canvas.setAttribute('role', 'button');
  canvas.setAttribute('tabindex', '0');
  canvas.setAttribute('aria-label', 'Scratch to reveal the wedding date');
  box.appendChild(canvas);

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const RADIUS = 20;          // brush size in CSS px
  const THRESHOLD = 0.45;     // clear this much and the rest falls away

  let dpr = 1, w = 0, h = 0;
  let drawing = false, last = null, done = false, sinceCheck = 0;

  function paintFoil() {
    const rect = box.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Brushed-gold gradient
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#E7CE96');
    g.addColorStop(0.35, '#C2953C');
    g.addColorStop(0.55, '#F0DFB4');
    g.addColorStop(0.8, '#B98C33');
    g.addColorStop(1, '#DCC084');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Faint speckle so it reads as foil, not a flat swatch.
    // Deterministic pattern — no Math.random, so it looks the same on resize.
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    for (let y = 0; y < h; y += 3) {
      for (let x = (y % 6); x < w; x += 7) {
        if ((x * 7 + y * 13) % 11 < 3) ctx.fillRect(x, y, 1, 1);
      }
    }

    ctx.fillStyle = 'rgba(110, 42, 36, 0.55)';
    ctx.font = '600 0.66rem/1 Marcellus, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '0.2em';
    ctx.fillText('SCRATCH TO REVEAL', w / 2, h / 2 - 8);
    ctx.font = '400 0.9rem/1 Georgia, serif';
    ctx.letterSpacing = '0.1em';
    ctx.fillText('✦', w / 2, h / 2 + 14);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = ctx.lineJoin = 'round';
    ctx.lineWidth = RADIUS * 2;
  }

  function erase(x, y) {
    ctx.beginPath();
    if (last) {
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
    ctx.fill();
    last = { x, y };
  }

  function clearedFraction() {
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    // Every 16th pixel is plenty for a percentage.
    for (let i = 3; i < data.length; i += 4 * 16) {
      if (data[i] < 24) clear++;
    }
    return clear / (data.length / (4 * 16));
  }

  function reveal() {
    if (done) return;
    done = true;
    box.classList.add('is-revealed');
    setTimeout(() => canvas.remove(), 800);
    firecrackers(box);
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (done) return;
    drawing = true;
    last = null;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* not capturable */ }
    const p = pos(e);
    erase(p.x, p.y);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!drawing || done) return;
    e.preventDefault();
    const p = pos(e);
    erase(p.x, p.y);
    if (++sinceCheck % 8 === 0 && clearedFraction() > THRESHOLD) reveal();
  });

  function stop() {
    if (!drawing) return;
    drawing = false;
    last = null;
    if (!done && clearedFraction() > THRESHOLD) reveal();
  }
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);
  canvas.addEventListener('pointerleave', stop);

  // Keyboard and assistive tech get a straight reveal — no dexterity required.
  canvas.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); }
  });

  let resizeTimer;
  addEventListener('resize', () => {
    if (done) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(paintFoil, 150);
  });

  // Fonts change the content box height, so paint once they've settled.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(paintFoil);
  else paintFoil();
  paintFoil();
})();

/* ------------------------- Carousels -------------------------
   Drives every .carousel on the page — the celebrations and the gallery.
   Scrolling is the browser's own scroll-snap, so a swipe works whether or
   not this runs. All the script adds is the dots, the arrows and keyboard
   support.
--------------------------------------------------------------------- */
document.querySelectorAll('.carousel').forEach(function carousel(root) {
  if (!root) return;

  const track = root.querySelector('.carousel__track');
  const dots = root.querySelector('.carousel__dots');
  const slides = [...root.querySelectorAll('.slide')];
  if (!track || !slides.length) return;

  let index = 0;

  slides.forEach((slide, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    const name = slide.querySelector('.slide__name');
    b.setAttribute('aria-label', name ? name.textContent.trim() : 'Celebration ' + (i + 1));
    b.addEventListener('click', () => goTo(i));
    li.appendChild(b);
    dots.appendChild(li);
  });

  const buttons = [...dots.querySelectorAll('button')];
  const arrows = [...root.querySelectorAll('.carousel__arrow')];

  function goTo(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    sync();
  }

  function sync() {
    buttons.forEach((b, i) => b.setAttribute('aria-current', i === index ? 'true' : 'false'));
    arrows.forEach((a) => {
      const step = Number(a.dataset.step);
      a.disabled = step < 0 ? index === 0 : index === slides.length - 1;
    });
  }

  arrows.forEach((a) => {
    a.addEventListener('click', () => goTo(index + Number(a.dataset.step)));
  });

  // Follow the finger: work out which slide is centred after a swipe
  let settle;
  track.addEventListener('scroll', () => {
    clearTimeout(settle);
    settle = setTimeout(() => {
      const middle = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      slides.forEach((s, i) => {
        const centre = s.offsetLeft - track.offsetLeft + s.offsetWidth / 2;
        const d = Math.abs(centre - middle);
        if (d < best) { best = d; nearest = i; }
      });
      if (nearest !== index) { index = nearest; }
      sync();
    }, 90);
  }, { passive: true });

  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(index - 1); }
  });

  sync();
});

/* --------------------- Couple parallax on the steps ---------------------
   The figure begins at the top of the painting and walks down the whole
   height as the section passes, travelling slower than the page around it
   and finally slipping below the section edge, where the next section
   covers it.
--------------------------------------------------------------------- */
(function coupleParallax() {
  const fig = document.getElementById('coupleFigure');
  const section = document.getElementById('couple');
  if (!fig || !section) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // How far it walks, as a fraction of the section's own height. 0.78 takes
  // it from the top edge to just past the bottom, so it ends up behind the
  // following section rather than stopping short.
  const TRAVEL = 0.78;
  let ticking = false;
  let visible = true;

  function update() {
    ticking = false;
    if (!visible) return;

    const r = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    // 0 as the section's top reaches the bottom of the screen,
    // 1 once its bottom has cleared the top.
    const span = vh + r.height;
    const p = span > 0 ? (vh - r.top) / span : 0;
    const clamped = p < 0 ? 0 : p > 1 ? 1 : p;

    // 0 at the top of the painting, walking down as the section passes
    const shift = clamped * r.height * TRAVEL;
    fig.style.transform = `translate3d(-50%, ${shift.toFixed(1)}px, 0)`;
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  // Only listen while the section is anywhere near the screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) update();
    }, { rootMargin: '100% 0px' }).observe(section);
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', update);
  update();
})();

/* -------------------- Pause the drifting clouds off-screen --------------------
   The three clouds animate translateX forever. Each sits on its own compositor
   layer (will-change), so the animation keeps the GPU ticking even when the
   couple section is nowhere near the viewport — needless battery/perf drain on
   weak devices, which is exactly where the page feels sluggish. Run them only
   while their section is in view.
--------------------------------------------------------------------------- */
(function cloudGate() {
  const sky = document.querySelector('.meet__sky');
  const section = document.getElementById('couple');
  if (!sky || !section || !('IntersectionObserver' in window)) return;

  const clouds = sky.querySelectorAll('.cloud');
  const setPlay = (state) => clouds.forEach((c) => { c.style.animationPlayState = state; });

  // Default to running (the CSS state). The observer only *pauses* them once it
  // confirms the section is off-screen, so any observer hiccup leaves the sky
  // drifting (correct) rather than frozen (broken).
  new IntersectionObserver((entries) => {
    setPlay(entries[0].isIntersecting ? 'running' : 'paused');
  }, { rootMargin: '20% 0px' }).observe(section);
})();

/* ------------------------- Scroll-in reveals ------------------------- */
(function reveals() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
  );

  items.forEach((el) => io.observe(el));
})();

/* ------------------------------- RSVP -------------------------------
   No backend is wired up yet. The form validates, then hands the reply
   to the guest's own mail app so nothing is lost in the meantime.
   Swap the body of send() for a fetch() when an endpoint exists.
--------------------------------------------------------------------- */
(function rsvp() {
  const form = document.getElementById('rsvpForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  const HOST_EMAIL = 'rsvp@example.com'; // ← change to the couple's address

  function say(message, state) {
    status.textContent = message;
    if (state) status.dataset.state = state;
    else delete status.dataset.state;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const contact = (data.get('contact') || '').toString().trim();

    if (!name || !contact) {
      say('Please tell us your name and how to reach you.', 'error');
      return;
    }

    const events = data.getAll('events').join(', ') || '—';
    const attending = data.get('attending') === 'yes' ? 'Yes, joyfully' : 'Sadly cannot';

    const body = [
      `Name: ${name}`,
      `Contact: ${contact}`,
      `Attending: ${attending}`,
      `Guests: ${data.get('guests')}`,
      `Events: ${events}`,
      `Note: ${(data.get('note') || '').toString().trim() || '—'}`,
    ].join('\n');

    const href =
      `mailto:${HOST_EMAIL}` +
      `?subject=${encodeURIComponent(`RSVP — ${name}`)}` +
      `&body=${encodeURIComponent(body)}`;

    say('Thank you — opening your mail app to send the reply.');
    window.location.href = href;
  });
})();

/* -------------------- Background-music toggle --------------------
   Wires the bottom-left button to the <audio> element. Browsers block
   autoplay, so playback only ever starts from this click (a user gesture).
   A short fade in/out keeps it gentle. The icon and aria state follow whether
   the track is actually playing. If no audio file is present yet, play()
   rejects and the button simply stays in the off state — nothing breaks.
------------------------------------------------------------------ */
(function bgMusic() {
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  if (!btn || !audio) return;

  const TARGET_VOLUME = 0.75;
  let userMuted = false;

  function setState(isPlaying) {
    btn.classList.toggle('is-playing', isPlaying);
    btn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    btn.setAttribute('aria-label', isPlaying ? 'Turn sound off' : 'Turn sound on');
  }

  // Sound is ON as default
  setState(true);

  function playSound() {
    if (userMuted) return;
    audio.volume = TARGET_VOLUME;
    const p = audio.play();
    if (p !== undefined) {
      p.then(() => {
        setState(true);
        try { localStorage.setItem('bgMusic', 'on'); } catch (e) {}
      }).catch((err) => {
        // Autoplay policy prevented playback before interaction;
        // keep button in active state so first click will start audio.
        console.log('Audio primed, awaiting gesture:', err);
      });
    }
  }

  function pauseSound() {
    audio.pause();
    setState(false);
    try { localStorage.setItem('bgMusic', 'off'); } catch (e) {}
  }

  // Attempt instant play on load
  playSound();

  // Any first user tap on the page unlocks sound immediately if blocked by browser
  function unlockGesture() {
    if (!userMuted && audio.paused) {
      playSound();
    }
    document.removeEventListener('click', unlockGesture);
    document.removeEventListener('touchstart', unlockGesture);
  }
  document.addEventListener('click', unlockGesture, { passive: true });
  document.addEventListener('touchstart', unlockGesture, { passive: true });

  // Direct click on music toggle button
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

  // Global trigger
  window.__bgMusicOn = function () {
    if (!userMuted) {
      playSound();
    }
  };
})();

/* ---------------------------- Intro / splash ----------------------------
   Shows the embossed ivory envelope with the middle "MA" wax seal.
   Clicking the middle MA seal or the envelope opens the invitation:
   video unfolds envelope, background music plays, and page dissolves into hero.
------------------------------------------------------------------------ */
(function intro() {
  const root = document.getElementById('intro');
  if (!root) return;
  const video = document.getElementById('introVideo');
  const sealBtn = document.getElementById('introSeal');
  const playBtn = document.getElementById('introPlay');
  const poster = document.getElementById('introPoster');
  const skip = document.getElementById('introSkip');
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  body.classList.add('intro-open');

  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    try { if (video) video.pause(); } catch (e) {}
    root.classList.add('intro--done');
    if (window.__bgMusicOn) window.__bgMusicOn();
    setTimeout(function () {
      root.remove();
      body.classList.remove('intro-open');
    }, reduce ? 0 : 850);
  }

  let started = false;
  function start(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (started || dismissed) return;
    started = true;
    root.classList.add('is-playing');
    if (skip) skip.hidden = false;

    // Start background music immediately
    if (window.__bgMusicOn) window.__bgMusicOn();

    if (video) {
      video.muted = true;
      const p = video.play();
      if (p && p.catch) {
        p.catch(function () {
          dismiss();
        });
      }
    } else {
      dismiss();
    }

    setTimeout(function () {
      if (started && !dismissed) {
        if (poster) poster.style.display = 'none';
        if (sealBtn) sealBtn.style.display = 'none';
        if (playBtn) playBtn.style.display = 'none';
      }
    }, 450);
  }

  // Click on middle MA wax seal button
  if (sealBtn) {
    sealBtn.addEventListener('click', start);
    sealBtn.addEventListener('touchend', function (e) {
      e.preventDefault();
      start(e);
    });
  }
  // Click on "Tap to open" hint
  if (playBtn) {
    playBtn.addEventListener('click', start);
    playBtn.addEventListener('touchend', function (e) {
      e.preventDefault();
      start(e);
    });
  }

  // Click anywhere on envelope / intro before start
  root.addEventListener('click', function (e) {
    if (started || dismissed) return;
    if (e.target === skip) return;
    start(e);
  });

  if (video) {
    video.addEventListener('ended', dismiss);
    video.addEventListener('error', dismiss);
  }

  if (skip) {
    skip.addEventListener('click', function (e) {
      e.stopPropagation();
      dismiss();
    });
  }
})();

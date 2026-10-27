(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const MAX_PX = {
    bgImage: 55,
    bgImageStrong: 80,
    decor: 28,
    decorStrong: 42,
    contentSubtle: 16,
  };

  const TARGETS = [];

  function add(el, maxPx, kind) {
    if (!el || el.dataset.parallaxAttached === '1') return;
    el.dataset.parallaxAttached = '1';
    el.style.willChange = 'transform';
    if (kind === 'bg-cover') {
      const existing = el.style.transform || '';
      if (!existing.includes('scale')) {
        el.style.transformOrigin = 'center center';
      }
      el.dataset.parallaxScale = '1.18';
    }
    TARGETS.push({ el, maxPx, kind: kind || 'transform' });
  }

  function indexParallaxTargets(root) {
    const scope = root || document;

    scope.querySelectorAll('section').forEach((section, idx) => {
      if (section.dataset.parallaxScanned === '1') return;
      section.dataset.parallaxScanned = '1';

      const bgUrl = section.style.backgroundImage;
      if (bgUrl && bgUrl.includes('url(')) {
        section.style.backgroundSize = section.style.backgroundSize || 'cover';
        section.style.backgroundPosition = section.style.backgroundPosition || 'center center';
      }

      const isHero = section.classList.contains('min-h-screen');
      if (isHero) return;

      const innerBgImg = section.querySelector(':scope > img.absolute.inset-0, :scope > div > img.absolute.inset-0');
      if (innerBgImg) {
        const max = idx % 2 === 0 ? MAX_PX.bgImage : MAX_PX.bgImageStrong;
        add(innerBgImg, max, 'bg-cover');
      }

      const decoratives = section.querySelectorAll('img[src*="floral"], img[src*="vase"], img[src*="bow"], img[src*="cupid"], img[src*="locket"], img[src*="matchbox"], img[src*="teacup"], img[src*="champagne"], img[src*="rings"], img[src*="swans"], img[src*="halo"], img[src*="lunch-illustration"]');
      decoratives.forEach((img, i) => {
        const m = (i % 2 === 0) ? MAX_PX.decor : MAX_PX.decorStrong;
        add(img, m, 'decor');
      });
    });
  }

  function update() {
    const vh = window.innerHeight || 800;
    for (const t of TARGETS) {
      const rect = t.el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offsetFromCenter = center - vh / 2;
      const range = vh;
      let progress = offsetFromCenter / range;
      if (progress > 1) progress = 1;
      else if (progress < -1) progress = -1;
      const translateY = -progress * t.maxPx;
      const scale = t.kind === 'bg-cover' ? ' scale(1.18)' : '';
      t.el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)${scale}`;
    }
  }

  let ticking = false;
  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }

  const REVEAL_SELECTORS = [
    'h2.font-display',
    'h3.font-display',
    'section .max-w-3xl > div, section .max-w-2xl > div, section .max-w-4xl > div',
    'section img[alt]',
  ];

  const revealObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('parallax-reveal-in');
        revealObserver.unobserve(e.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  function attachReveals(root) {
    const scope = root || document;
    REVEAL_SELECTORS.forEach(sel => {
      scope.querySelectorAll(sel).forEach(el => {
        if (el.dataset.parallaxReveal === '1') return;
        if (el.closest('[data-parallax-skip]')) return;
        if (el.closest('section.relative.min-h-screen')) return;
        el.dataset.parallaxReveal = '1';
        el.classList.add('parallax-reveal');
        revealObserver.observe(el);
      });
    });
  }

  function injectStyles() {
    if (document.getElementById('parallax-styles')) return;
    const style = document.createElement('style');
    style.id = 'parallax-styles';
    style.textContent = `
      html { scroll-behavior: smooth; }
      .parallax-reveal {
        opacity: 0;
        transform: translate3d(0, 32px, 0);
        transition: opacity 1.1s cubic-bezier(.22,.61,.36,1), transform 1.1s cubic-bezier(.22,.61,.36,1);
        will-change: opacity, transform;
      }
      .parallax-reveal-in {
        opacity: 1 !important;
        transform: translate3d(0, 0, 0) !important;
      }
      [data-parallax-attached="1"] {
        transition: transform 80ms linear;
      }
    `;
    document.head.appendChild(style);
  }

  function rescanSoon() {
    if (rescanSoon._t) cancelAnimationFrame(rescanSoon._t);
    rescanSoon._t = requestAnimationFrame(() => {
      indexParallaxTargets();
      attachReveals();
      update();
    });
  }

  function init() {
    injectStyles();
    indexParallaxTargets();
    attachReveals();
    update();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    const mo = new MutationObserver(() => rescanSoon());
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

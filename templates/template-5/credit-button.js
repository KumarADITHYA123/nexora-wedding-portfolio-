(function () {
  'use strict';

  const CREDIT_URL = 'https://instagram.com';
  const CREDIT_TEXT = 'MADE BY NEXORA';
  const MARK = 'data-credit-injected';
  const AUDIO_MARK = 'data-audio-relocated';

  function injectStyles() {
    if (document.getElementById('credit-button-styles')) return;
    const style = document.createElement('style');
    style.id = 'credit-button-styles';
    style.textContent = `
      .credit-btn {
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 9999;
        height: 34px;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 0 14px 0 11px;
        font-family: inherit;
        font-size: 11px;
        font-weight: 600;
        line-height: 1;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #ffffff;
        background: #7a1222;
        border: 1px solid rgba(197, 160, 89, 0.4);
        border-radius: 9999px;
        box-shadow: 0 4px 14px rgba(122, 18, 34, 0.35);
        text-decoration: none;
        transition: transform 0.2s ease, background 0.2s ease;
        cursor: pointer;
      }
      .credit-btn:hover {
        background: #911729;
        transform: translateY(-1px);
      }
      .credit-btn svg {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
        color: #f7e7ce;
      }
      /* Audio button relocated bottom-left */
      [data-audio-relocated="1"] {
        width: 36px !important;
        height: 36px !important;
        bottom: 16px !important;
        left: 16px !important;
        right: auto !important;
        z-index: 9999 !important;
        background: #7a1222 !important;
        color: #ffffff !important;
        border: 1px solid rgba(197, 160, 89, 0.4) !important;
        box-shadow: 0 4px 14px rgba(122, 18, 34, 0.35) !important;
      }
      [data-audio-relocated="1"] svg {
        width: 16px !important;
        height: 16px !important;
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
  }

  function buildButton() {
    const a = document.createElement('a');
    a.className = 'credit-btn';
    a.href = CREDIT_URL;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', CREDIT_TEXT + ' on Instagram');
    a.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>' +
      '<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>' +
      '<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>' +
      '</svg>' +
      '<span>' + CREDIT_TEXT + '</span>';
    return a;
  }

  function relocateAudioButton() {
    const candidates = document.querySelectorAll(
      'button.fixed.bottom-6.right-6, .fixed.bottom-6.right-6 > button, button.fixed'
    );
    candidates.forEach((el) => {
      const cls = el.className || '';
      if (typeof cls === 'string' && cls.includes('rounded-full') && !el.classList.contains('credit-btn')) {
        el.setAttribute(AUDIO_MARK, '1');
      }
    });
  }

  function inject() {
    if (document.body.getAttribute(MARK) !== '1') {
      injectStyles();
      document.body.appendChild(buildButton());
      document.body.setAttribute(MARK, '1');
    }
    relocateAudioButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject, { once: true });
  } else {
    inject();
  }
  setInterval(relocateAudioButton, 500);
})();

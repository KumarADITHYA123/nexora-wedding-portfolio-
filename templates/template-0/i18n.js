
(function () {
  'use strict';

  const I18N_DICTIONARY = {
    en: {
      hero_blessing: "॥ OM ॥",
      hero_eyebrow: "Together with our families",
      hero_tagline: "we are getting married",
      hero_groom: "Venkata Chandra Sekhar",
      hero_bride: "Varsha",
      fam_heading: "The Wedding Invitation",
      fam_request: "request the honor of your gracious presence as they exchange vows of marriage",
      events_heading: "Celebrations &amp; Events",
      countdown_title: "Until the Muhurtham",
      countdown_days: "Days",
      countdown_hours: "Hours",
      countdown_mins: "Minutes",
      countdown_secs: "Seconds",
      rsvp_heading: "RSVP",
      rsvp_by: "Kindly respond by 15 July 2026"
    },
    te: {
      hero_blessing: "॥ ఓం ॥",
      hero_eyebrow: "మా కుటుంబాల ఆశీస్సులతో",
      hero_tagline: "మా పవిత్ర వివాహ ఆహ్వానం",
      hero_groom: "వెంకట చంద్ర శేఖర్",
      hero_bride: "వర్ష",
      fam_heading: "వివాహ ఆహ్వాన పత్రిక",
      fam_request: "మా వివాహ బంధానికి మీ ఆశీస్సులను అందజేయాలని ప్రార్థన",
      events_heading: "వివాహ వేడుకల వివరాలు",
      countdown_title: "శుభ ముహూర్తానికి మిగిలిన సమయం",
      countdown_days: "రోజులు",
      countdown_hours: "గంటలు",
      countdown_mins: "నిమిషాలు",
      countdown_secs: "సెకన్లు",
      rsvp_heading: "ఆర్.ఎస్.వి.పి",
      rsvp_by: "దయచేసి 15 జూలై 2026 లోపు తెలియజేయండి"
    },
    hi: {
      hero_blessing: "॥ ॐ ॥",
      hero_eyebrow: "परिवारों के शुभाशीर्वाद सहित",
      hero_tagline: "शुभ विवाह निमंत्रण",
      hero_groom: "वेंकट चंद्र शेखर",
      hero_bride: "वर्षा",
      fam_heading: "शुभ विवाह आमंत्रण",
      fam_request: "विवाह के पावन बंधन में बंधते हुए आपके स्नेहाशीष व शुभकामनाओं की अभिलाषा रखते हैं",
      events_heading: "मांगलिक उत्सव एवं कार्यक्रम",
      countdown_title: "शुभ लग्न मुहूर्त की प्रतीक्षा",
      countdown_days: "दिन",
      countdown_hours: "घंटे",
      countdown_mins: "मिनट",
      countdown_secs: "सेकंड",
      rsvp_heading: "आर.एस.वी.पी",
      rsvp_by: "कृपया 15 जुलाई 2026 तक सूचित करें"
    }
  };

  function setLanguage(lang) {
    if (!I18N_DICTIONARY[lang]) return;
    const dict = I18N_DICTIONARY[lang];

    document.documentElement.setAttribute('lang', lang);
    document.documentElement.classList.remove('lang-en', 'lang-te', 'lang-hi');
    document.documentElement.classList.add('lang-' + lang);

    document.querySelectorAll('.lang-pill__btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
    });

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    try {
      localStorage.setItem('preferred_lang', lang);
    } catch (e) {}
  }

  window.setLanguage = setLanguage;

  function initI18n() {
    document.querySelectorAll('.lang-pill__btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setLanguage(btn.getAttribute('data-lang'));
      });
    });

    let initialLang = 'en';
    try {
      initialLang = localStorage.getItem('preferred_lang') || 'en';
    } catch (e) {}
    setLanguage(initialLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
  } else {
    initI18n();
  }
})();

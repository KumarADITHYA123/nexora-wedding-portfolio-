
(function () {
  'use strict';

  const I18N_DICTIONARY = {
    en: {
      hero_ik: "॥ OM ॥",
      hero_eyebrow: "Together with our families",
      hero_groom: "Venkata Chandra Sekhar",
      hero_bride: "Varsha",
      hero_venue: "Sunday &middot; Muhurtham 5:45 AM",
      invite_eyebrow: "We invite you to celebrate",
      invite_heading: "The Wedding",
      invite_couple: "Venkata Chandra Sekhar <span class='invite__amp'>&amp;</span> Varsha",
      invite_muhurtham: "Sunday, 23 August 2026<br/>Auspicious Muhurtham: 5:45 AM",
      venue_title: "The Venue &amp; Mandapam",
      celebrate_title: "Celebrations &amp; Events",
      finale_blessing: "“A union of two hearts, blessed by eternity”",
      finale_thanks: "With love &amp; gratitude,<br/>Venkata Chandra Sekhar &amp; Varsha"
    },
    te: {
      hero_ik: "॥ ఓం ॥",
      hero_eyebrow: "మా కుటుంబాల ఆశీస్సులతో",
      hero_groom: "వెంకట చంద్ర శేఖర్",
      hero_bride: "వర్ష",
      hero_venue: "ఆదివారం &middot; ముహూర్తం ఉదయం 5:45",
      invite_eyebrow: "మా పవిత్ర వివాహ మహోత్సవానికి సాదర ఆహ్వానం",
      invite_heading: "కల్యాణ మహోత్సవం",
      invite_couple: "వెంకట చంద్ర శేఖర్ <span class='invite__amp'>&amp;</span> వర్ష",
      invite_muhurtham: "ఆదివారం, 23 ఆగస్టు 2026<br/>శుభ సుముహూర్తం: ఉదయం 5:45 నిమిషాలకు",
      venue_title: "కల్యాణ వేదిక &amp; మండపం",
      celebrate_title: "వివాహ వేడుకల వివరాలు",
      finale_blessing: "“మనసులు కలిసిన జీవనమే జీవితం”",
      finale_thanks: "ప్రేమతో &amp; కృతజ్ఞతలతో,<br/>వెంకట చంద్ర శేఖర్ &amp; వర్ష"
    },
    hi: {
      hero_ik: "॥ ॐ ॥",
      hero_eyebrow: "परिवारों के शुभाशीर्वाद सहित",
      hero_groom: "वेंकट चंद्र शेखर",
      hero_bride: "वर्षा",
      hero_venue: "रविवार &middot; शुभ मुहूर्त प्रातः 5:45",
      invite_eyebrow: "हमारे विवाह के पावन अवसर पर साग्रह निमंत्रण",
      invite_heading: "शुभ विवाह",
      invite_couple: "वेंकट चंद्र शेखर <span class='invite__amp'>&amp;</span> वर्षा",
      invite_muhurtham: "रविवार, 23 अगस्त 2026<br/>शुभ लग्न मुहूर्त: प्रातः 5:45 बजे",
      venue_title: "विवाह स्थल एवं मंडप",
      celebrate_title: "मांगलिक उत्सव एवं कार्यक्रम",
      finale_blessing: "“दो आत्माओं का पावन एवं शाश्वत मिलन”",
      finale_thanks: "स्नेह एवं कृतज्ञता सहित,<br/>वेंकट चंद्र शेखर एवं वर्षा"
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

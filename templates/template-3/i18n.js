
(function () {
  'use strict';

  const I18N_DICTIONARY = {
    en: {
      hero_eyebrow: "We're getting married",
      hero_names: 'Chandra Sekhar <span class="intro__caption-amp">&amp;</span> Varsha',
      ganesh_blessing: '॥ With the divine blessings of Lord Ganesha ॥<br/><span style="font-size:0.88em;color:var(--maroon);font-weight:500;">॥ Sri Ganeshay Namah ॥</span>',
      count_title: "Countdown to the Muhurtham",
      count_days: "Days",
      count_hours: "Hours",
      count_mins: "Mins",
      count_secs: "Secs",
      welcome_text: "Together with their families,<br/>we request the honor of your presence and blessings<br/>on the auspicious celebration of our wedding.",
      groom_title: "Chi. Venkata Chandra Sekhar",
      groom_parents: "Son of Sri Venkata Ratnam &amp; Smt. Veera Kumari",
      bride_title: "Chi.La.Sow. Varsha",
      bride_parents: "Daughter of Sri Vaitla Gopal Venkatachalam (Late) &amp; Smt. Sarada",
      muhurtham_title: "Sacred Muhurtham",
      muhurtham_date: "Sunday, 23 August 2026",
      muhurtham_time: "5:45 AM (Early Morning)",
      muhurtham_venue: "Sri Venkateswara Kalyana Mandapam, Andhra Pradesh",
      events_header: "Wedding Itinerary &amp; Celebrations",
      dress_title: "Dress Code",
      dress_desc: "Traditional Indian Attire / Formal Festive",
      closing_eyebrow: "With the blessings of our parents &amp; families",
      closing_names: "Chandra Sekhar &amp; Varsha"
    },
    te: {
      hero_eyebrow: "మా వివాహ ఆహ్వానం",
      hero_names: 'చంద్ర శేఖర్ <span class="intro__caption-amp">&amp;</span> వర్ష',
      ganesh_blessing: '॥ శ్రీరస్తు శుభమస్తు ॥<br/><span style="font-size:0.88em;color:var(--maroon);font-weight:500;">॥ శ్రీ విఘ్నేశ్వరాయ నమః ॥</span>',
      count_title: "శుభ ముహూర్తానికి మిగిలిన సమయం",
      count_days: "రోజులు",
      count_hours: "గంటలు",
      count_mins: "నిమిషాలు",
      count_secs: "సెకన్లు",
      welcome_text: "మా కుటుంబాల ఆశీస్సులతో,<br/>మా పవిత్ర వివాహ మహోత్సవానికి మిమ్మల్ని మరియు మీ కుటుంబాన్ని<br/>సాదరంగా ఆహ్వానిస్తున్నాము.",
      groom_title: "చి. వెంకట చంద్ర శేఖర్",
      groom_parents: "శ్రీ వెంకట రత్నం &amp; శ్రీమతి వీర కుమారి గార్ల సుపుత్రుడు",
      bride_title: "చి.ల.సౌ. వర్ష",
      bride_parents: "స్వర్గీయ శ్రీ వైట్ల గోపాల వేంకటాచలం &amp; శ్రీమతి శారద గార్ల సుపుత్రిక",
      muhurtham_title: "శుభ సుముహూర్తం",
      muhurtham_date: "ఆదివారం, 23 ఆగస్టు 2026",
      muhurtham_time: "ఉదయం 5:45 నిమిషాలకు",
      muhurtham_venue: "శ్రీ వేంకటేశ్వర కల్యాణ మండపం, ఆంధ్రప్రదేశ్",
      events_header: "వివాహ మహోత్సవ కార్యక్రమాలు",
      dress_title: "వస్త్రధారణ",
      dress_desc: "సాంప్రదాయ పట్టు వస్త్రాలు / ఫార్మల్ దుస్తులు",
      closing_eyebrow: "మా పెద్దల దివ్య ఆశీస్సులతో",
      closing_names: "చంద్ర శేఖర్ &amp; వర్ష"
    },
    hi: {
      hero_eyebrow: "शुभ विवाह निमंत्रण",
      hero_names: 'चंद्र शेखर <span class="intro__caption-amp">&amp;</span> वर्षा',
      ganesh_blessing: '॥ श्री गणेशाय नमः ॥<br/><span style="font-size:0.88em;color:var(--maroon);font-weight:500;">॥ ॐ गं गणपतये नमः ॥</span>',
      count_title: "शुभ लग्न मुहूर्त की प्रतीक्षा",
      count_days: "दिन",
      count_hours: "घंटे",
      count_mins: "मिनट",
      count_secs: "सेकंड",
      welcome_text: "परिवारों के शुभाशीर्वाद से,<br/>हमारे पावन विवाह समारोह में आपकी गरिमामयी उपस्थिति<br/>सादर प्रार्थनीय है।",
      groom_title: "चि. वेंकट चंद्र शेखर",
      groom_parents: "सुपुत्र: श्री वेंकट रत्नम एवं श्रीमती वीरा कुमारी",
      bride_title: "चि.सौ.कां. वर्षा",
      bride_parents: "सुपुत्री: स्व. श्री वैट्ला गोपाल वेंकटाचलम एवं श्रीमती शारदा",
      muhurtham_title: "पावन विवाह मुहूर्त",
      muhurtham_date: "रविवार, 23 अगस्त 2026",
      muhurtham_time: "प्रातः 5:45 बजे (सुमुहूर्त)",
      muhurtham_venue: "श्री वेंकटेश्वर कल्याण मंडपम, आंध्र प्रदेश",
      events_header: "मांगलिक कार्यक्रम एवं विवाह उत्सव",
      dress_title: "वेशभूषा",
      dress_desc: "पारंपरिक भारतीय परिधान / उत्सव वेशभूषा",
      closing_eyebrow: "समस्त गुरुजनों एवं बड़ों के शुभाशीर्वाद सहित",
      closing_names: "चंद्र शेखर एवं वर्षा"
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

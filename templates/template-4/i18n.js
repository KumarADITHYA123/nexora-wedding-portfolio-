/**
 * Multilingual Engine (English, Telugu, Hindi)
 * Priority: 1. EN (Default) | 2. TE | 3. HI
 * 100% Offline, Instant DOM swap, LocalStorage persistent
 */

(function () {
  'use strict';

  const I18N_DICTIONARY = {
    en: {
      hero_eyebrow: "We're getting married",
      hero_names: '<span class="hero__name">Venkata Chandra Sekhar</span> <span class="hero__amp">&amp;</span> <span class="hero__name">Varsha</span>',
      hero_date: "23 August 2026",
      count_title: "Countdown",
      count_until: "Until 23 August 2026",
      count_days: "Days",
      count_hours: "Hours",
      count_mins: "Minutes",
      count_secs: "Seconds",
      reveal_title: "“A sacred union of hearts, a lifelong journey together”",
      reveal_text: "With hearts brimming with happiness and the divine blessings of our beloved families, we invite you to be part of our wedding celebrations on the 23rd of August, 2026.",
      reveal_save: "Save the Date",
      welcome_heading: "॥ Sri Rama Jayam ॥",
      welcome_families: "Together with their families",
      welcome_groom: "Chi. Venkata Chandra Sekhar",
      welcome_groom_parents: "Son of Sri Venkata Ratnam &amp; Smt. Veera Kumari",
      welcome_and: "and",
      welcome_bride: "Chi.La.Sow. Varsha",
      welcome_bride_parents: "Daughter of Sri Vaitla Gopal Venkatachalam (Late) &amp; Smt. Sarada",
      welcome_request: "request the honor of your gracious presence as they exchange sacred vows of marriage",
      welcome_when: '<span class="welcome__day">On Sunday</span> <span>the twenty-third of August</span> <span>two thousand twenty-six</span><br/><strong style="color:var(--olive-deep);letter-spacing:0.08em;margin-top:0.4rem;display:inline-block;">Sumuhurtham: 5:45 AM (IST)</strong>',
      cer_title: "Kalyanam<br/>&amp; Reception",
      cer_eyebrow: "Auspicious Sumuhurtham",
      cer_venue: "Sri Venkateswara Kalyana Mandapam",
      cer_place: "Convention Center, Main Hall",
      cer_date: "Sunday, the 23rd of August, 2026",
      cer_time: "Muhurtham at 5:45 AM | Reception at 7:00 PM",
      cer_addr: "<strong>Bhimavaram / Vijayawada Road</strong><br/>Andhra Pradesh, India",
      cer_foot: "Traditional Kalyana Bhojanam &amp; Celebrations to follow",
      cer_maps: "Open in Maps",
      cer_cal: "Add to Calendar",
      events_title: "Celebrations",
      events_subtitle: "Wedding Itinerary &amp; Events",
      ev1_name: "Nichayathartham",
      ev1_date: "Friday, 21 August 2026",
      ev1_time: "10:00 AM Onwards",
      ev1_venue: "Grand Palace Hall",
      ev2_name: "Mehendi",
      ev2_date: "Friday, 21 August 2026",
      ev2_time: "06:00 PM Onwards",
      ev2_venue: "Poolside Lawn",
      ev3_name: "Sangeet",
      ev3_date: "Saturday, 22 August 2026",
      ev3_time: "07:00 PM Onwards",
      ev3_venue: "Royal Ballroom",
      ev4_name: "Muhurtham",
      ev4_date: "Sunday, 23 August 2026",
      ev4_time: "05:45 AM (Sumuhurtham)",
      ev4_venue: "Sri Venkateswara Kalyana Mandapam",
      ev5_name: "Reception",
      ev5_date: "Sunday, 23 August 2026",
      ev5_time: "07:00 PM Onwards",
      ev5_venue: "Convention Center",
      dress_title: "Dress Code",
      dress_val: "Traditional Festive / Formal",
      dress_note: "Traditional South Indian silks, pattu sarees, kurtas, or formal suits.<br/>We invite you to dress in rich festive tones — reds, golds, deep ivories, and greens — to celebrate in colour with us.",
      rsvp_title: "RSVP",
      rsvp_by: "Kindly respond by 15 July 2026",
      rsvp_name_lbl: "Full name",
      rsvp_attend_leg: "Will you be attending?",
      rsvp_yes: "Joyfully accepts",
      rsvp_no: "Regretfully declines",
      rsvp_guests_lbl: "Number of guests attending",
      rsvp_transport_leg: "Transportation",
      rsvp_shuttle: "Shuttle Service to Venue",
      rsvp_valet: "Self Transport / Valet Parking",
      rsvp_msg_lbl: "A personal message for the couple",
      rsvp_submit: "Send RSVP",
      rsvp_done_h: "Thank you!",
      rsvp_done_p: "Your response has been recorded with love. We can't wait to celebrate with you.",
      ending_eyebrow: "With hearts full of joy",
      ending_text: "we thank you for being<br/>a part of our story",
      ending_groom: "Venkata Chandra Sekhar",
      ending_bride: "Varsha"
    },
    te: {
      hero_eyebrow: "మా వివాహ ఆహ్వానం",
      hero_names: '<span class="hero__name">వెంకట చంద్ర శేఖర్</span> <span class="hero__amp">&amp;</span> <span class="hero__name">వర్ష</span>',
      hero_date: "23 ఆగస్టు 2026",
      count_title: "ముహూర్త సమయం",
      count_until: "23 ఆగస్టు 2026 వరకు",
      count_days: "రోజులు",
      count_hours: "గంటలు",
      count_mins: "నిమిషాలు",
      count_secs: "సెకన్లు",
      reveal_title: "“మనసులు కలిసిన జీవనమే జీవితం”",
      reveal_text: "మా కుటుంబాల దివ్య ఆశీస్సులతో, మా పవిత్ర వివాహ మహోత్సవానికి మిమ్మల్ని మరియు మీ కుటుంబాన్ని సాదరంగా ఆహ్వానిస్తున్నాము.",
      reveal_save: "తేదీ గుర్తుంచుకోండి",
      welcome_heading: "॥ శ్రీరస్తు శుభమస్తు అవిఘ్నమస్తు ॥",
      welcome_families: "మా కుటుంబాల ఆశీస్సులతో",
      welcome_groom: "చి. వెంకట చంద్ర శేఖర్",
      welcome_groom_parents: "శ్రీ వెంకట రత్నం &amp; శ్రీమతి వీర కుమారి గార్ల సుపుత్రుడు",
      welcome_and: "మరియు",
      welcome_bride: "చి.ల.సౌ. వర్ష",
      welcome_bride_parents: "స్వర్గీయ శ్రీ వైట్ల గోపాల వేంకటాచలం &amp; శ్రీమతి శారద గార్ల సుపుత్రిక",
      welcome_request: "మా వివాహ బంధానికి మీ ఆశీస్సులను అందజేయాలని ప్రార్థన",
      welcome_when: '<span class="welcome__day">ఆదివారం</span> <span>23వ తేదీ ఆగస్టు</span> <span>రెండు వేల ఇరవై ఆరు</span><br/><strong style="color:var(--olive-deep);letter-spacing:0.08em;margin-top:0.4rem;display:inline-block;">సుముహూర్తం: ఉదయం 5:45 నిమిషాలకు</strong>',
      cer_title: "కల్యాణం<br/>&amp; రిసెప్షన్",
      cer_eyebrow: "శుభ సుముహూర్తం",
      cer_venue: "శ్రీ వేంకటేశ్వర కల్యాణ మండపం",
      cer_place: "కన్వెన్షన్ సెంటర్, ప్రధాన ప్రాంగణం",
      cer_date: "ఆదివారం, 23 ఆగస్టు 2026",
      cer_time: "ముహూర్తం ఉదయం 5:45 | రిసెప్షన్ రాత్రి 7:00",
      cer_addr: "<strong>భీమవరం / విజయవాడ రోడ్</strong><br/>ఆంధ్రప్రదేశ్, భారతదేశం",
      cer_foot: "సాంప్రదాయ కల్యాణ భోజనం &amp; వేడుకలు",
      cer_maps: "మ్యాప్స్ లో చూడండి",
      cer_cal: "క్యాలెండర్ కి జోడించండి",
      events_title: "వేడుకల వివరాలు",
      events_subtitle: "వివాహ మహోత్సవ కార్యక్రమాలు",
      ev1_name: "నిశ్చితార్థం",
      ev1_date: "శుక్రవారం, 21 ఆగస్టు 2026",
      ev1_time: "ఉదయం 10:00 గంటల నుండి",
      ev1_venue: "గ్రాండ్ ప్యాలెస్ హాల్",
      ev2_name: "మెహెందీ",
      ev2_date: "శుక్రవారం, 21 ఆగస్టు 2026",
      ev2_time: "సాయంత్రం 06:00 గంటల నుండి",
      ev2_venue: "పూల్‌సైడ్ లాన్",
      ev3_name: "సంగీత్",
      ev3_date: "శనివారం, 22 ఆగస్టు 2026",
      ev3_time: "రాత్రి 07:00 గంటల నుండి",
      ev3_venue: "రాయల్ బాల్‌రూమ్",
      ev4_name: "ముహూర్తం",
      ev4_date: "ఆదివారం, 23 ఆగస్టు 2026",
      ev4_time: "ఉదయం 05:45 గంటలకు (సుముహూర్తం)",
      ev4_venue: "శ్రీ వేంకటేశ్వర కల్యాణ మండపం",
      ev5_name: "రిసెప్షన్",
      ev5_date: "ఆదివారం, 23 ఆగస్టు 2026",
      ev5_time: "రాత్రి 07:00 గంటల నుండి",
      ev5_venue: "కన్వెన్షన్ సెంటర్",
      dress_title: "వస్త్రధారణ",
      dress_val: "సాంప్రదాయ దుస్తులు / పట్టు వస్త్రాలు",
      dress_note: "సాంప్రదాయ పట్టు చీరలు, ధోతీలు, కుర్తాలు లేదా ఫార్మల్ దుస్తులు.<br/>ఎరుపు, బంగారం, తెలుపు, ఆకుపచ్చ రంగులలో వేడుకను జరుపుకుందాం.",
      rsvp_title: "ఆర్.ఎస్.వి.పి",
      rsvp_by: "దయచేసి 15 జూలై 2026 లోపు తెలియజేయండి",
      rsvp_name_lbl: "పూర్తి పేరు",
      rsvp_attend_leg: "మీరు హాజరవుతున్నారా?",
      rsvp_yes: "ఆనందంగా వస్తున్నాము",
      rsvp_no: "క్షమించండి, రాలేకపోతున్నాము",
      rsvp_guests_lbl: "అతిథుల సంఖ్య",
      rsvp_transport_leg: "రవాణా సదుపాయం",
      rsvp_shuttle: "వేదికకు షటిల్ సర్వీస్",
      rsvp_valet: "సొంత వాహనం / వాలెట్ పార్కింగ్",
      rsvp_msg_lbl: "వధూవరులకు మీ శుభాకాంక్షలు",
      rsvp_submit: "సమర్పించండి",
      rsvp_done_h: "ధన్యవాదాలు!",
      rsvp_done_p: "మీ సమాధానం నమోదయింది. మీతో కలిసి ఈ పవిత్ర వేడుకను జరుపుకోవడానికి ఎదురుచూస్తున్నాము.",
      ending_eyebrow: "నిండు హృదయంతో",
      ending_text: "మా సంతోషంలో పాలుపంచుకున్నందుకు<br/>హృదయపూర్వక ధన్యవాదాలు",
      ending_groom: "వెంకట చంద్ర శేఖర్",
      ending_bride: "వర్ష"
    },
    hi: {
      hero_eyebrow: "शुभ विवाह निमंत्रण",
      hero_names: '<span class="hero__name">वेंकट चंद्र शेखर</span> <span class="hero__amp">&amp;</span> <span class="hero__name">वर्षा</span>',
      hero_date: "23 अगस्त 2026",
      count_title: "शुभ घड़ी की प्रतीक्षा",
      count_until: "23 अगस्त 2026 तक",
      count_days: "दिन",
      count_hours: "घंटे",
      count_mins: "मिनट",
      count_secs: "सेकंड",
      reveal_title: "“दो आत्माओं का पवित्र मिलन”",
      reveal_text: "हमारे परिवारों के शुभाशीर्वाद से, हमारे शुभ विवाह के पावन उत्सव में आपकी गरिमामयी उपस्थिति सादर प्रार्थनीय है।",
      reveal_save: "शुभ तिथि",
      welcome_heading: "॥ श्री गणेशाय नमः ॥ ॥ शुभ विवाह ॥",
      welcome_families: "परिवारों के शुभाशीर्वाद सहित",
      welcome_groom: "चि. वेंकट चंद्र शेखर",
      welcome_groom_parents: "सुपुत्र: श्री वेंकट रत्नम एवं श्रीमती वीरा कुमारी",
      welcome_and: "एवं",
      welcome_bride: "चि.सौ.कां. वर्षा",
      welcome_bride_parents: "सुपुत्री: स्व. श्री वैट्ला गोपाल वेंकटाचलम एवं श्रीमती शारदा",
      welcome_request: "विवाह के पावन बंधन में बंधते हुए आपके स्नेहाशीष व शुभकामनाओं की अभिलाषा रखते हैं",
      welcome_when: '<span class="welcome__day">रविवार</span> <span>23 अगस्त</span> <span>दो हज़ार छब्बीस</span><br/><strong style="color:var(--olive-deep);letter-spacing:0.08em;margin-top:0.4rem;display:inline-block;">शुभ मुहूर्त: प्रातः 5:45 बजे</strong>',
      cer_title: "विवाह समारोह<br/>एवं प्रीतिभोज",
      cer_eyebrow: "शुभ लग्न मुहूर्त",
      cer_venue: "श्री वेंकटेश्वर कल्याण मंडपम",
      cer_place: "कन्वेंशन सेंटर, मुख्य हॉल",
      cer_date: "रविवार, 23 अगस्त 2026",
      cer_time: "मुहूर्त प्रातः 5:45 बजे | रिसेप्शन सायं 7:00 बजे",
      cer_addr: "<strong>भीमवरम / विजयवाड़ा रोड</strong><br/>आंध्र प्रदेश, भारत",
      cer_foot: "पारंपरिक प्रीतिभोज एवं मांगलिक उत्सव",
      cer_maps: "मानचित्र देखें",
      cer_cal: "कैलेंडर में जोड़ें",
      events_title: "मांगलिक कार्यक्रम",
      events_subtitle: "विवाह उत्सव एवं समारोह",
      ev1_name: "सगाई / निश्चयताम्र",
      ev1_date: "शुक्रवार, 21 अगस्त 2026",
      ev1_time: "प्रातः 10:00 बजे से",
      ev1_venue: "ग्रैंड पैलेस हॉल",
      ev2_name: "मेहंदी उत्सव",
      ev2_date: "शुक्रवार, 21 अगस्त 2026",
      ev2_time: "सायं 06:00 बजे से",
      ev2_venue: "पूलसाइड लॉन",
      ev3_name: "संगीत संध्या",
      ev3_date: "शनिवार, 22 अगस्त 2026",
      ev3_time: "सायं 07:00 बजे से",
      ev3_venue: "रॉयल बॉलरूम",
      ev4_name: "शुभ विवाह मुहूर्त",
      ev4_date: "रविवार, 23 अगस्त 2026",
      ev4_time: "प्रातः 05:45 बजे (सुमुहूर्त)",
      ev4_venue: "श्री वेंकटेश्वर कल्याण मंडपम",
      ev5_name: "प्रीतिभोज (रिसेप्शन)",
      ev5_date: "रविवार, 23 अगस्त 2026",
      ev5_time: "सायं 07:00 बजे से",
      ev5_venue: "कन्वेंशन सेंटर",
      dress_title: "वेशभूषा",
      dress_val: "पारंपरिक उत्सव परिधान",
      dress_note: "पारंपरिक सिल्क साड़ियां, कुर्ते-पायजामा अथवा सुरुचिपूर्ण उत्सव परिधान।<br/>लाल, सुनहरे, श्वेत एवं हरे रंगों के साथ हमारे उत्सव में रंग भरें।",
      rsvp_title: "आर.एस.वी.पी",
      rsvp_by: "कृपया 15 जुलाई 2026 तक सूचित करें",
      rsvp_name_lbl: "पूरा नाम",
      rsvp_attend_leg: "क्या आप पधार रहे हैं?",
      rsvp_yes: "सहर्ष उपस्थित होंगे",
      rsvp_no: "असमर्थता के लिए क्षमा",
      rsvp_guests_lbl: "अतिथियों की संख्या",
      rsvp_transport_leg: "यातायात सुविधा",
      rsvp_shuttle: "वेन्यू हेतु शटल सेवा",
      rsvp_valet: "स्वयं का वाहन / वैले पार्किंग",
      rsvp_msg_lbl: "वर-वधु हेतु शुभकामनाएं",
      rsvp_submit: "निमंत्रण स्वीकारें",
      rsvp_done_h: "हार्दिक धन्यवाद!",
      rsvp_done_p: "आपकी प्रतिक्रिया प्रेमपूर्वक दर्ज कर ली गई है। आपके शुभाशीष की प्रतीक्षा रहेगी।",
      ending_eyebrow: "हर्षित हृदय से",
      ending_text: "हमारी इस पावन खुशी का हिस्सा बनने के लिए<br/>सप्रेम धन्यवाद",
      ending_groom: "वेंकट चंद्र शेखर",
      ending_bride: "वर्षा"
    }
  };

  function setLanguage(lang) {
    if (!I18N_DICTIONARY[lang]) return;
    const dict = I18N_DICTIONARY[lang];

    document.documentElement.setAttribute('lang', lang);
    document.documentElement.classList.remove('lang-en', 'lang-te', 'lang-hi');
    document.documentElement.classList.add(`lang-${lang}`);

    // Update switcher pill buttons
    document.querySelectorAll('.lang-pill__btn').forEach((btn) => {
      const btnLang = btn.getAttribute('data-lang');
      btn.classList.toggle('is-active', btnLang === lang);
    });

    // Update all registered text nodes
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

  // Expose global controller
  window.setLanguage = setLanguage;

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // Wire click events on language pills
    document.querySelectorAll('.lang-pill__btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = btn.getAttribute('data-lang');
        setLanguage(selectedLang);
      });
    });

    // Default: English (1st priority), or restore saved choice
    let initialLang = 'en';
    try {
      initialLang = localStorage.getItem('preferred_lang') || 'en';
    } catch (e) {}
    setLanguage(initialLang);
  });
})();

(function () {
  'use strict';

  const MARK = 'data-festivities-patched';

  const FESTIVITIES_DATA = {
    en: {
      title: 'Celebrations & Events',
      subtitle: '21 – 23 August 2026',
      sections: [
        {
          date: '21 August 2026',
          name: 'Nichayathartham',
          image: 'assets/dholki.png',
          items: [
            { time: '10:00 AM', label: 'Lagna Patrika & Auspicious Engagement' },
            { time: '11:30 AM', label: 'Ring Exchange & Traditional Blessings' },
            { time: '12:30 PM', label: 'Grand Traditional Feast | Grand Palace Hall' },
          ],
        },
        {
          date: '21 August 2026',
          name: 'Mehendi Ceremony',
          image: 'assets/mehendi.png',
          items: [
            { time: '06:00 PM', label: 'Floral Welcome & Sitar Melodies' },
            { time: '07:00 PM', label: 'Bridal Henna Artistry & Music' },
            { time: '08:30 PM', label: 'Poolside Lawn Dinner' },
          ],
        },
        {
          date: '22 August 2026',
          name: 'Sangeet Celebration',
          image: 'assets/haldi.png',
          items: [
            { time: '07:00 PM', label: 'Grand Red Carpet Entry' },
            { time: '08:00 PM', label: 'Family Musical & Dance Performances' },
            { time: '10:00 PM', label: 'Royal Ballroom Banquet' },
          ],
        },
        {
          date: '23 August 2026',
          name: 'Muhurtham (Kalyanam)',
          image: 'assets/nikah.png',
          items: [
            { time: '04:30 AM', label: 'Mangala Snanam & Suprabhatam' },
            { time: '05:45 AM', label: 'Sumuhurtham: Jeelakarra Bellam & Mangalasutra Dharana' },
            { time: '08:00 AM', label: 'Aseervachanam & Traditional Breakfast | Sri Venkateswara Kalyana Mandapam' },
          ],
        },
        {
          date: '23 August 2026',
          name: 'Wedding Reception',
          image: 'assets/reception.png',
          items: [
            { time: '07:00 PM', label: 'Grand Couple Entry & Felicitations' },
            { time: '08:30 PM', label: 'Royal Gala Banquet | Convention Center' },
          ],
        },
      ],
    },
    te: {
      title: 'వివాహ వేడుకల వివరాలు',
      subtitle: '21 – 23 ఆగస్టు 2026',
      sections: [
        {
          date: '21 ఆగస్టు 2026',
          name: 'నిశ్చితార్థం (Nichayathartham)',
          image: 'assets/dholki.png',
          items: [
            { time: 'ఉదయం 10:00', label: 'లగ్న పత్రిక & నిశ్చితార్థ మహోత్సవం' },
            { time: 'ఉదయం 11:30', label: 'ఉంగరాల మార్పిడి & ఆశీర్వచనం' },
            { time: 'మధ్యాహ్నం 12:30', label: 'సాంప్రదాయ విందు భోజనం | గ్రాండ్ ప్యాలెస్ హాల్' },
          ],
        },
        {
          date: '21 ఆగస్టు 2026',
          name: 'మెహెందీ వేడుక (Mehendi)',
          image: 'assets/mehendi.png',
          items: [
            { time: 'సాయంత్రం 06:00', label: 'పూల సుమధుర స్వాగతం' },
            { time: 'రాత్రి 07:00', label: 'గోరింటాకు వేడుక & సంగీతం' },
            { time: 'రాత్రి 08:30', label: 'పూల్‌సైడ్ లాన్ విందు' },
          ],
        },
        {
          date: '22 ఆగస్టు 2026',
          name: 'సంగీత్ సంబరం (Sangeet)',
          image: 'assets/haldi.png',
          items: [
            { time: 'సాయంత్రం 07:00', label: 'కుటుంబ సభ్యుల ఘన స్వాగతం' },
            { time: 'రాత్రి 08:00', label: 'సంగీత నృత్య వేడుకలు' },
            { time: 'రాత్రి 10:00', label: 'రాయల్ బాల్‌రూమ్ విందు' },
          ],
        },
        {
          date: '23 ఆగస్టు 2026',
          name: 'కల్యాణ సుముహూర్తం (Muhurtham)',
          image: 'assets/nikah.png',
          items: [
            { time: 'తెల్లవారుజామున 04:30', label: 'మంగళ స్నానాలు & సుప్రభాతం' },
            { time: 'ఉదయం 05:45', label: 'శుభ సుముహూర్తం: జీలకర్ర బెల్లం & మాంగల్యధారణ' },
            { time: 'ఉదయం 08:00', label: 'ఆశీర్వచనం & అల్పాహారం | శ్రీ వేంకటేశ్వర కల్యాణ మండపం' },
          ],
        },
        {
          date: '23 ఆగస్టు 2026',
          name: 'వివాహ రిసెప్షన్ (Reception)',
          image: 'assets/reception.png',
          items: [
            { time: 'సాయంత్రం 07:00', label: 'నవ దంపతుల రాక & సన్మానం' },
            { time: 'రాత్రి 08:30', label: 'ఘన విందు భోజనం | కన్వెన్షన్ సెంటర్' },
          ],
        },
      ],
    },
    hi: {
      title: 'मांगलिक उत्सव एवं कार्यक्रम',
      subtitle: '21 – 23 अगस्त 2026',
      sections: [
        {
          date: '21 अगस्त 2026',
          name: 'निश्चयार्थम (सगाई समारोह)',
          image: 'assets/dholki.png',
          items: [
            { time: 'प्रातः 10:00 बजे', label: 'लग्न पत्रिका एवं पावन सगाई' },
            { time: 'प्रातः 11:30 बजे', label: 'अंगूठी रस्म एवं आशीर्वाद' },
            { time: 'दोपहर 12:30 बजे', label: 'पारंपरिक भोज | ग्रैंड पैलेस हॉल' },
          ],
        },
        {
          date: '21 अगस्त 2026',
          name: 'मेहंदी उत्सव (Mehendi)',
          image: 'assets/mehendi.png',
          items: [
            { time: 'सायं 06:00 बजे', label: 'पुष्प स्वागत एवं शहनाई' },
            { time: 'सायं 07:00 बजे', label: 'मेहंदी एवं संगीत उत्सव' },
            { time: 'रात्रि 08:30 बजे', label: 'प्रीतिभोज | पूलसाइड लॉन' },
          ],
        },
        {
          date: '22 अगस्त 2026',
          name: 'संगीत संध्या (Sangeet)',
          image: 'assets/haldi.png',
          items: [
            { time: 'सायं 07:00 बजे', label: 'शाही रेड कार्पेट आगमन' },
            { time: 'रात्रि 08:00 बजे', label: 'पारिवारिक संगीत एवं नृत्य' },
            { time: 'रात्रि 10:00 बजे', label: 'शाही भोज | रॉयल बॉलरूम' },
          ],
        },
        {
          date: '23 अगस्त 2026',
          name: 'शुभ लग्न मुहूर्त (Muhurtham)',
          image: 'assets/nikah.png',
          items: [
            { time: 'प्रातः 04:30 बजे', label: 'मंगल स्नान एवं सुप्रभातम्' },
            { time: 'प्रातः 05:45 बजे', label: 'शुभ मुहूर्त: जीरा गुड़ एवं मंगलसूत्र धारण' },
            { time: 'प्रातः 08:00 बजे', label: 'आशीर्वाद एवं अल्पाहार | श्री वेंकटेश्वर कल्याण मंडपम' },
          ],
        },
        {
          date: '23 अगस्त 2026',
          name: 'शुभ विवाह रिसेप्शन (Reception)',
          image: 'assets/reception.png',
          items: [
            { time: 'सायं 07:00 बजे', label: 'वर-वधू स्वागत एवं अभिनन्दन' },
            { time: 'रात्रि 08:30 बजे', label: 'भव्य प्रीतिभोज | कन्वेंशन सेंटर' },
          ],
        },
      ],
    },
  };

  function getCurrentLang() {
    return document.documentElement.getAttribute('lang') || 'en';
  }

  function buildItem(item, idx) {
    const onLeft = idx % 2 === 0;
    const row = document.createElement('div');
    row.className = 'relative flex items-center py-4';
    row.style.opacity = '1';

    const dot = document.createElement('div');
    dot.className = 'absolute left-1/2 -translate-x-1/2 w-4 bg-[#7a1222]';
    dot.style.height = '2px';
    row.appendChild(dot);

    const left = document.createElement('div');
    left.className = 'w-1/2 pr-6 md:pr-8 text-right';
    const right = document.createElement('div');
    right.className = 'w-1/2 pl-6 md:pl-8 text-left';

    const cell = document.createElement('div');
    const time = document.createElement('p');
    time.className = 'font-body font-bold text-[#7a1222] tracking-[0.1em] text-sm md:text-base';
    time.textContent = item.time;
    const label = document.createElement('p');
    label.className = 'font-body font-medium text-[#4a3a2a] text-xs md:text-sm mt-1';
    label.textContent = item.label;
    cell.appendChild(time);
    cell.appendChild(label);

    if (onLeft) {
      left.appendChild(cell);
    } else {
      right.appendChild(cell);
    }
    row.appendChild(left);
    row.appendChild(right);
    return row;
  }

  function buildSection(sec) {
    const wrap = document.createElement('div');
    wrap.style.paddingTop = '3rem';
    wrap.style.marginBottom = '5rem';

    const header = document.createElement('div');
    header.className = 'text-center mb-10';
    const subDate = document.createElement('p');
    subDate.className = 'text-[#c5a059] font-body tracking-[0.2em] uppercase text-xs md:text-sm font-semibold mb-2';
    subDate.textContent = sec.date;
    const title = document.createElement('h3');
    title.className = 'font-serif text-2xl md:text-4xl text-[#7a1222] font-medium';
    title.textContent = sec.name;
    header.appendChild(subDate);
    header.appendChild(title);
    wrap.appendChild(header);

    if (sec.image) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'flex justify-center mb-10';
      const img = document.createElement('img');
      img.src = sec.image;
      img.alt = sec.name;
      img.loading = 'lazy';
      img.className = 'w-full max-w-sm h-auto rounded-2xl shadow-sm border border-[#e8d7c3]';
      imgWrap.appendChild(img);
      wrap.appendChild(imgWrap);
    }

    const timeline = document.createElement('div');
    timeline.className = 'relative max-w-xl mx-auto';
    const spine = document.createElement('div');
    spine.className = 'absolute left-1/2 top-2 bottom-2 bg-[#7a1222]/30 -translate-x-1/2';
    spine.style.width = '2px';
    timeline.appendChild(spine);

    const list = document.createElement('div');
    list.className = 'space-y-0';
    sec.items.forEach((it, i) => list.appendChild(buildItem(it, i)));
    timeline.appendChild(list);

    wrap.appendChild(timeline);
    return wrap;
  }

  function buildFestivities() {
    const lang = getCurrentLang();
    const data = FESTIVITIES_DATA[lang] || FESTIVITIES_DATA.en;

    const inner = document.createElement('div');
    inner.id = 'custom-festivities';
    inner.className = 'max-w-2xl mx-auto px-4 py-8';

    const head = document.createElement('div');
    head.className = 'text-center mb-12';
    const h2 = document.createElement('h2');
    h2.className = 'font-serif text-3xl md:text-5xl text-[#7a1222] font-normal mb-2';
    h2.textContent = data.title;
    const sub = document.createElement('p');
    sub.className = 'text-[#c5a059] font-body tracking-wider uppercase text-sm font-medium';
    sub.textContent = data.subtitle;
    head.appendChild(h2);
    head.appendChild(sub);
    inner.appendChild(head);

    data.sections.forEach(sec => inner.appendChild(buildSection(sec)));
    return inner;
  }

  function findProgrammeSection() {
    const headings = document.querySelectorAll('h1, h2, h3, h4');
    for (const h of headings) {
      const t = (h.textContent || '').trim().toLowerCase();
      if (
        t.includes('celebration') ||
        t.includes('muhurtham') ||
        t.includes('programme') ||
        t.includes('कार्यक्रम') ||
        t.includes('వివరాలు') ||
        t === 'day programme'
      ) {
        return h.closest('section') || h.parentElement;
      }
    }
    return null;
  }

  function applyPatch() {
    const section = findProgrammeSection();
    if (!section) return false;
    section.innerHTML = '';
    section.appendChild(buildFestivities());
    section.setAttribute(MARK, '1');
    return true;
  }

  window.addEventListener('wedding-lang-change', () => {
    applyPatch();
  });
  window.addEventListener('DOMContentLoaded', () => {
    applyPatch();
  });

  const observer = new MutationObserver(() => {
    const section = findProgrammeSection();
    if (section && section.getAttribute(MARK) !== '1') {
      applyPatch();
    }
  });
  observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

  setTimeout(applyPatch, 500);
  setTimeout(applyPatch, 1500);
  setTimeout(applyPatch, 3000);
})();

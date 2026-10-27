// script.js - Advanced GSAP Animations with Cinematic Entrance & Continuous Motion

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. GRAND ENTRANCE ANIMATION (FROM STARTING) ---
    const masterTl = gsap.timeline();

    // Loader slide up like a curtain
    masterTl.to('#loader', {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut',
        delay: 1
    })
    .set('#loader', { display: 'none' })

    // Background slow zoom in
    .from('.hero-background-image', {
        scale: 1.3,
        opacity: 0,
        duration: 3,
        ease: 'power2.out'
    }, '-=0.5')

    // Divine Image: scale up from center with golden glow burst
    .from('.hero-divine-image', {
        scale: 0.6,
        opacity: 0,
        duration: 2,
        ease: 'power3.out'
    }, '-=2.5')
    .from('.hero-image-glow', {
        scale: 0,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out'
    }, '-=1.8')
    .from('.hero-rk-img', {
        filter: 'brightness(2) saturate(0)',
        duration: 1.5,
        ease: 'power2.out'
    }, '-=1.5')
    .from('.hero-image-border', {
        opacity: 0,
        scale: 1.1,
        duration: 1,
        ease: 'power2.out'
    }, '-=1')

    // Text stagger from below the image
    .from('.hero-small-text', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero-flute-container', { scale: 0, opacity: 0, rotation: -15, duration: 1, ease: 'back.out(2)' }, '-=0.5')
    .from('.hero-name-large', { y: 50, opacity: 0, duration: 1, stagger: 0.25, ease: 'power3.out' }, '-=0.5')
    .from('.hero-ampersand-container', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2.5)' }, '-=0.6')
    .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8 }, '-=0.3')
    .from('.hero-date', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-scroll-indicator', { opacity: 0, duration: 1 }, '-=0.2')

    // Particles fade in after everything else
    .from('.hero-particles', { opacity: 0, duration: 1.5 }, '-=1');

    // --- 2. CONTINUOUS IDLE MOTION ---
    // Divine image gentle levitation
    gsap.to('.hero-divine-image', {
        y: -12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 4
    });

    // Flute gentle sway
    gsap.to('.flute-svg', {
        y: -10,
        rotation: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 3
    });
    
    // Lotus breathing
    gsap.to('.hero-ampersand-container .lotus-svg-small', {
        scale: 1.1,
        rotation: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 2.5,
        stagger: 0.5
    });

    // Scroll indicator bounce
    gsap.to('.hero-scroll-indicator svg', {
        y: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 1
    });

    // --- 3. SCROLL ANIMATIONS ---

    // Hero Parallax on Scroll
    if(document.querySelector('.hero-section')) {
        // Image scales down and fades as you scroll away
        gsap.to('.hero-divine-image', {
            scale: 0.85,
            opacity: 0,
            y: -80,
            scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
        });

        // Text fades out on scroll
        gsap.to('.hero-content', {
            y: 100,
            opacity: 0,
            scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
        });
    }

    // Section Titles Reveal
    gsap.utils.toArray('.section-title, .events-title, .gallery-title, .venue-title, .rsvp-title, .invitation-heading').forEach(title => {
        gsap.from(title, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none reverse' }
        });
    });

    // Couple Cards
    if(document.querySelector('.couple-grid')) {
        gsap.from('.couple-card', {
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.3,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.couple-grid', start: 'top 80%' }
        });
    }

    // Events Timeline Cinematic Reveal
    if(document.querySelector('.timeline')) {
        gsap.from('.timeline-line', {
            scaleY: 0,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: { trigger: '.timeline', start: 'top 80%', end: 'bottom 20%', scrub: true }
        });

        gsap.utils.toArray('.gsap-timeline-card').forEach((card, i) => {
            let xOffset = card.classList.contains('left') ? -100 : 100;
            if(window.innerWidth <= 768) xOffset = 50; // Mobile slides from left only

            gsap.from(card, {
                x: xOffset,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' }
            });
        });
    }

    // Gallery Grid
    if(document.querySelector('.gallery-grid')) {
        gsap.from('.gallery-item', {
            y: 50,
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.5)',
            scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%' }
        });
    }

    // Venue, RSVP, and Invitation Form
    gsap.utils.toArray('.venue-decorative-frame, .rsvp-form, .invitation-inner').forEach(el => {
        gsap.from(el, {
            y: 50,
            scale: 0.95,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
        });
    });

    // --- 4. UTILITIES ---
    
    // Countdown Timer
    const cdDays = document.getElementById('cd-days');
    if(cdDays) {
        const targetDate = new Date('August 29, 2026 11:30:00').getTime();
        const pad = n => String(n).padStart(2, '0');
        
        setInterval(() => {
            const distance = targetDate - new Date().getTime();
            if (distance < 0) return;
            cdDays.innerText = pad(Math.floor(distance / (1000 * 60 * 60 * 24)));
            document.getElementById('cd-hours').innerText = pad(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
            document.getElementById('cd-minutes').innerText = pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
            document.getElementById('cd-seconds').innerText = pad(Math.floor((distance % (1000 * 60)) / 1000));
        }, 1000);
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
});

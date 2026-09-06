/* ========================================
   PANKAJ PORTFOLIO — JAVASCRIPT ENGINE
   Interactive Features, Audio Synth, & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ============ LIVE TIME TICKER ============
    const navTime = document.getElementById('navTime');
    function updateLiveTime() {
        if (!navTime) return;
        const now = new Date();
        const options = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
        navTime.textContent = `${timeString} IST`;
    }
    updateLiveTime();
    setInterval(updateLiveTime, 1000);

    // ============ WEB AUDIO INTERACTION SYNTHESIZER (huyml.co inspired) ============
    let audioContext = null;
    let soundEnabled = false;
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');
    const soundLabel = document.getElementById('soundLabel');

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    function playSound(type = 'click') {
        if (!soundEnabled || !audioContext) return;
        try {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);

            const now = audioContext.currentTime;

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'success') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
                osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
                osc.start(now);
                osc.stop(now + 0.22);
            } else if (type === 'hover') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                gain.gain.setValueAtTime(0.015, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
                osc.start(now);
                osc.stop(now + 0.03);
            }
        } catch (e) {
            console.warn('Web Audio playback error', e);
        }
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            initAudio();
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundToggle.classList.add('active');
                soundIcon.className = 'fa-solid fa-volume-high';
                soundLabel.textContent = 'Audio: ON';
                playSound('success');
            } else {
                soundToggle.classList.remove('active');
                soundIcon.className = 'fa-solid fa-volume-xmark';
                soundLabel.textContent = 'Audio: OFF';
            }
        });
    }

    // Attach micro-sounds to interactive elements
    document.querySelectorAll('button, a.btn, .filter-btn, .project-link-btn, .contact-card').forEach(el => {
        el.addEventListener('mouseenter', () => playSound('hover'));
        el.addEventListener('click', () => playSound('click'));
    });

    // ============ TOAST & COPY EMAIL ============
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    let toastTimeout = null;

    function showToast(msg) {
        if (!toast) return;
        if (toastMessage) toastMessage.textContent = msg;
        toast.classList.add('show');
        playSound('success');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMsg);
            }).catch(() => {
                fallbackCopy(text, successMsg);
            });
        } else {
            fallbackCopy(text, successMsg);
        }
    }

    function fallbackCopy(text, successMsg) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast(successMsg);
        } catch (err) {
            showToast('Press Ctrl+C to copy');
        }
        document.body.removeChild(textarea);
    }

    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = copyEmailBtn.getAttribute('data-email');
            copyToClipboard(email, 'Email address copied to clipboard!');
        });
    }

    const copyEmailCard = document.getElementById('copyEmailCard');
    if (copyEmailCard) {
        copyEmailCard.addEventListener('click', () => {
            const email = copyEmailCard.getAttribute('data-email');
            copyToClipboard(email, 'Email address copied to clipboard!');
        });
    }

    // ============ PROJECT CATEGORY FILTERING ============
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ============ CURSOR GLOW ============
    const cursorGlow = document.getElementById('cursorGlow');
    let cursorVisible = false;

    document.addEventListener('mousemove', (e) => {
        if (!cursorVisible && cursorGlow) {
            cursorGlow.classList.add('active');
            cursorVisible = true;
        }
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
    });

    document.addEventListener('mouseleave', () => {
        if (cursorGlow) {
            cursorGlow.classList.remove('active');
            cursorVisible = false;
        }
    });

    // ============ NAVBAR SCROLL ============
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ============ MOBILE NAV TOGGLE ============
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            navToggle.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
                navToggle.classList.remove('active');
            });
        });
    }

    // ============ TYPEWRITER EFFECT ============
    const typewriterText = document.getElementById('typewriter');
    const phrases = [
        'AI Agent Zero-Trust Firewalls.',
        'Real-Time Synchronized Audio Platforms.',
        'Hardware & Voice Automation Assistants.',
        'High-Performance Full-Stack Architectures.',
        'Scalable & Secure Distributed Systems.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 50;

    function typeWriter() {
        if (!typewriterText) return;
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 25;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 45;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400;
        }

        setTimeout(typeWriter, typeSpeed);
    }
    setTimeout(typeWriter, 800);

    // ============ SCROLL REVEAL ANIMATIONS ============
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(el => observer.observe(el));

    // ============ TELEMETRY COUNTER ANIMATION ============
    const counters = document.querySelectorAll('.counter');

    function animateCounter(element, target) {
        if (isNaN(target) || target <= 0) return;
        element.textContent = '0';
        const duration = 1200;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Cubic ease-out curve
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.round(easeOut * target);
            element.textContent = currentVal;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'), 10);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    counters.forEach(counter => counterObserver.observe(counter));

    // ============ ACTIVE NAV LINK ON SCROLL ============
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 180) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    console.log('%c🚀 Pankaj Portfolio Online · Systems & AI Security', 'color: #6366f1; font-weight: bold; font-size: 14px;');
});

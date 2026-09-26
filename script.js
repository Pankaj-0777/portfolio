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

    // ============ TOAST & COPY EMAIL ============
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    let toastTimeout = null;

    function showToast(msg) {
        if (!toast) return;
        if (toastMessage) toastMessage.textContent = msg;
        toast.classList.add('show');

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

    // ============ CODER CANVAS BACKGROUND (MATRIX & CODE STREAM ENGINE) ============
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;

        // Coder / Cyber character set
        const chars = '01</>{}[];:=+*#$@%&!~_?^|\\0x4F0x8A0x9Fconst await async import return fn struct enum type interface boolean string number void select from where join limit';
        const charArray = chars.split(' ');

        let columns = [];
        let fontSize = 14;

        let mouse = { x: -1000, y: -1000 };
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        document.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Adjust column spacing based on screen size
            const numCols = Math.floor(width / (fontSize * 1.8));
            columns = [];
            for (let i = 0; i < numCols; i++) {
                columns.push({
                    x: i * fontSize * 1.8 + Math.random() * 5,
                    y: Math.random() * -height,
                    speed: Math.random() * 0.8 + 0.4,
                    chars: [],
                    length: Math.floor(Math.random() * 12) + 8
                });
                // Pre-fill column character stack
                for (let j = 0; j < columns[i].length; j++) {
                    columns[i].chars.push(charArray[Math.floor(Math.random() * charArray.length)]);
                }
            }
        }

        window.addEventListener('resize', resize);

        function animateCanvas() {
            // Fade effect for smooth trailing digital streams
            ctx.fillStyle = 'rgba(5, 5, 8, 0.15)';
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px 'JetBrains Mono', 'Fira Code', monospace`;

            for (let i = 0; i < columns.length; i++) {
                const col = columns[i];
                col.y += col.speed;

                if (col.y - (col.length * fontSize * 1.4) > height) {
                    col.y = Math.random() * -100;
                    col.speed = Math.random() * 0.8 + 0.4;
                    // Randomize characters on recycle
                    for (let j = 0; j < col.length; j++) {
                        col.chars[j] = charArray[Math.floor(Math.random() * charArray.length)];
                    }
                }

                for (let j = 0; j < col.length; j++) {
                    const charY = col.y - (j * fontSize * 1.4);
                    if (charY < 0 || charY > height) continue;

                    const dx = mouse.x - col.x;
                    const dy = mouse.y - charY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const isMouseNear = dist < 180;

                    // Leading character is bright cyan / white, tail fades out
                    if (j === 0) {
                        ctx.fillStyle = isMouseNear ? '#67e8f9' : 'rgba(99, 102, 241, 0.85)';
                        ctx.shadowColor = '#6366f1';
                        ctx.shadowBlur = isMouseNear ? 12 : 4;
                    } else if (isMouseNear) {
                        // Mouse reactive glow - turns neon indigo/cyan
                        const intensity = (1 - dist / 180);
                        ctx.fillStyle = `rgba(103, 232, 249, ${0.4 + intensity * 0.5})`;
                        ctx.shadowColor = '#06b6d4';
                        ctx.shadowBlur = 8 * intensity;
                    } else {
                        // Ambient subtle code stream opacity
                        const alpha = (1 - j / col.length) * 0.18;
                        ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
                        ctx.shadowBlur = 0;
                    }

                    const char = col.chars[j] || '0';
                    ctx.fillText(char, col.x, charY);
                }
            }

            requestAnimationFrame(animateCanvas);
        }

        resize();
        animateCanvas();
    }

    // ============ BACKGROUND MESH INTERACTION ============
    const cursorGlow = document.getElementById('cursorGlow');
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let glowX = targetX, glowY = targetY;
    let cursorActive = false;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!cursorActive && cursorGlow) {
            cursorGlow.classList.add('active');
            cursorActive = true;
        }
    });

    document.addEventListener('mouseleave', () => {
        if (cursorGlow) {
            cursorGlow.classList.remove('active');
            cursorActive = false;
        }
    });

    // Smooth subtle ambient movement (lerp)
    function renderBackgroundInteraction() {
        if (cursorActive && cursorGlow) {
            glowX += (targetX - glowX) * 0.05;
            glowY += (targetY - glowY) * 0.05;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
        }
        requestAnimationFrame(renderBackgroundInteraction);
    }
    requestAnimationFrame(renderBackgroundInteraction);

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

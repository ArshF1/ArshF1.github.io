// Performance Detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowPower = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : isMobile;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Performance settings based on device
const perfSettings = {
    particleCount: isLowPower ? 10 : (isMobile ? 15 : 50),
    enableCursorTrail: !isTouch && !isLowPower,
    enableParticleConnections: !isMobile,
    enableParallax: !isMobile,
    enableTiltEffect: !isTouch,
    animationThrottle: isMobile ? 2 : 1
};

// Page Load Animation
document.body.classList.add('loading');

const loaderTexts = [
    'Initializing...',
    'Loading Python skills...',
    'Importing pandas...',
    'Training ML models...',
    'Building data pipelines...',
    'Ready!'
];

const loaderTyping = document.querySelector('.loader-typing');
let textIndex = 0;
let charIndex = 0;

function typeLoaderText() {
    if (textIndex >= loaderTexts.length) return;
    
    const currentText = loaderTexts[textIndex];
    
    if (charIndex < currentText.length) {
        loaderTyping.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeLoaderText, 50);
    } else {
        setTimeout(() => {
            charIndex = 0;
            textIndex++;
            if (textIndex < loaderTexts.length) {
                typeLoaderText();
            }
        }, 300);
    }
}

// Start typing animation
typeLoaderText();

// Hide loader function
function hideLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
}

// Hide loader after fixed time
setTimeout(hideLoader, 2500);

// Typing animation for hero title
const titles = ['Data Engineer', 'Python Developer', 'ML Enthusiast', 'Data Scientist'];
let titleIndex = 0;
let heroCharIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeTitle() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentTitle.substring(0, heroCharIndex - 1);
        heroCharIndex--;
    } else {
        typingText.textContent = currentTitle.substring(0, heroCharIndex + 1);
        heroCharIndex++;
    }
    
    if (!isDeleting && heroCharIndex === currentTitle.length) {
        setTimeout(() => { isDeleting = true; }, pauseTime);
        setTimeout(typeTitle, pauseTime);
        return;
    }
    
    if (isDeleting && heroCharIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
    }
    
    setTimeout(typeTitle, isDeleting ? deletingSpeed : typingSpeed);
}

// Start typing animation after page load
window.addEventListener('load', () => {
    setTimeout(typeTitle, 1500);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Throttled scroll handler
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            const navbar = document.querySelector('.navbar');
            const currentScroll = window.scrollY;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Parallax effect (desktop only)
            if (perfSettings.enableParallax) {
                const hero = document.querySelector('.hero-content');
                if (hero && currentScroll < window.innerHeight) {
                    hero.style.transform = `translateY(${currentScroll * 0.3}px)`;
                    hero.style.opacity = 1 - (currentScroll / window.innerHeight);
                }
            }
            
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});


// Theme Toggle with Cat Animation
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

let isAnimating = false;

function createCatStage(isDarkMode) {
    const stage = document.createElement('div');
    stage.className = 'cat-stage';
    
    const message = isDarkMode ? '🌙 Switching to dark mode...' : '☀️ Switching to light mode...';
    
    stage.innerHTML = `
        <div class="stage-message">${message}</div>
        <div class="lamp-post left ${isDarkMode ? 'on' : 'on'}">
            <svg viewBox="0 0 30 70" fill="none">
                <rect x="13" y="20" width="4" height="50" fill="#64748b"/>
                <circle class="lamp-glow" cx="15" cy="15" r="12" fill="#ffd700"/>
                <path d="M8 20 L22 20 L18 28 L12 28 Z" fill="#4a5568"/>
            </svg>
        </div>
        <div class="light-switch ${isDarkMode ? 'on' : 'off'}">
            <svg viewBox="0 0 30 80" fill="none">
                <rect class="switch-pole" x="12" y="30" width="6" height="50" rx="2"/>
                <g class="switch-toggle">
                    <circle cx="15" cy="25" r="12" fill="#4a5568" stroke="#64748b" stroke-width="2"/>
                    <rect x="13" y="20" width="4" height="15" rx="2" fill="#c1df1f"/>
                </g>
            </svg>
        </div>
        <div class="lamp-post right ${isDarkMode ? 'on' : 'on'}">
            <svg viewBox="0 0 30 70" fill="none">
                <rect x="13" y="20" width="4" height="50" fill="#64748b"/>
                <circle class="lamp-glow" cx="15" cy="15" r="12" fill="#ffd700"/>
                <path d="M8 20 L22 20 L18 28 L12 28 Z" fill="#4a5568"/>
            </svg>
        </div>
        <div class="theme-cat">
            <div class="cat-body">
                <svg viewBox="0 0 100 70" fill="none">
                    <g class="cat-tail"><path d="M17 38 Q2 35 5 20 Q8 10 15 15" stroke="#2e4057" stroke-width="7" stroke-linecap="round" fill="none"/></g>
                    <g class="cat-legs-back"><rect x="20" y="50" width="7" height="18" rx="3" fill="#2e4057"/></g>
                    <rect x="30" y="52" width="7" height="16" rx="3" fill="#1a2634"/>
                    <ellipse cx="45" cy="40" rx="28" ry="18" fill="#2e4057"/>
                    <rect x="55" y="52" width="6" height="16" rx="3" fill="#1a2634"/>
                    <g class="cat-paw-reach"><rect x="63" y="45" width="6" height="23" rx="3" fill="#2e4057"/><ellipse cx="66" cy="68" rx="5" ry="3" fill="#2e4057"/></g>
                    <circle cx="78" cy="30" r="16" fill="#2e4057"/>
                    <polygon points="68,18 72,2 80,15" fill="#2e4057"/><polygon points="83,15 91,2 95,18" fill="#2e4057"/>
                    <polygon points="70,17 73,7 78,15" fill="#ffb6c1"/><polygon points="85,15 90,7 93,17" fill="#ffb6c1"/>
                    <ellipse cx="73" cy="28" rx="3" ry="4" fill="#c1df1f"/><ellipse cx="84" cy="28" rx="3" ry="4" fill="#c1df1f"/>
                    <ellipse cx="73" cy="29" rx="1.5" ry="2.5" fill="#0f172a"/><ellipse cx="84" cy="29" rx="1.5" ry="2.5" fill="#0f172a"/>
                    <polygon points="78,33 76,37 80,37" fill="#ffb6c1"/>
                    <ellipse cx="78" cy="44" rx="8" ry="3" fill="#a833b9"/><circle cx="78" cy="47" r="3" fill="#c1df1f"/>
                </svg>
            </div>
        </div>
    `;
    
    return stage;
}

themeToggle.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;
    
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    const isDarkMode = newTheme === 'dark';
    
    const stage = createCatStage(isDarkMode);
    const cat = stage.querySelector('.theme-cat');
    const lightSwitch = stage.querySelector('.light-switch');
    const lamps = stage.querySelectorAll('.lamp-post');
    const message = stage.querySelector('.stage-message');
    
    document.body.appendChild(stage);
    
    setTimeout(() => {
        stage.classList.add('visible');
        message.classList.add('visible');
    }, 100);
    
    setTimeout(() => {
        cat.classList.add(isDarkMode ? 'walking' : 'walking-back');
    }, 400);
    
    setTimeout(() => { cat.classList.add('reaching'); }, 1600);
    
    setTimeout(() => {
        lightSwitch.classList.toggle('on');
        lightSwitch.classList.toggle('off');
        lamps.forEach(lamp => {
            lamp.classList.toggle('on');
            lamp.classList.toggle('off');
        });
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setTimeout(() => { cat.classList.remove('reaching'); }, 400);
    }, 1700);
    
    setTimeout(() => { message.classList.remove('visible'); }, 2500);
    setTimeout(() => { stage.classList.remove('visible'); }, 3200);
    setTimeout(() => { stage.remove(); isAnimating = false; }, 3800);
});


// Intersection Observer for animations (optimized)
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            const progressBar = entry.target.querySelector('.skill-progress');
            if (progressBar) {
                const progress = progressBar.getAttribute('data-progress');
                setTimeout(() => {
                    progressBar.style.width = progress + '%';
                }, 300);
            }
            skillObserver.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    skillObserver.observe(card);
});

const expObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            expObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.experience-card').forEach(card => {
    expObserver.observe(card);
});

// Animate project cards
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            projectObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    projectObserver.observe(card);
});

// Tilt effect (desktop only)
if (perfSettings.enableTiltEffect) {
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}


// Optimized Floating Particles Animation
const canvas = document.getElementById('particles-canvas');
if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let frameCount = 0;
    
    const colors = ['#a833b9', '#c08552', '#c1df1f', '#9bc4cb', '#2e4057'];
    const symbols = ['{ }', '< >', '[ ]', '( )', '0', '1'];
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.4 + 0.2;
            this.isSymbol = Math.random() > 0.8;
            this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            
            if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
                this.reset();
                if (Math.random() > 0.5) {
                    this.x = Math.random() > 0.5 ? -10 : canvas.width + 10;
                    this.y = Math.random() * canvas.height;
                } else {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() > 0.5 ? -10 : canvas.height + 10;
                }
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            
            if (this.isSymbol) {
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.font = `${this.size * 4}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.symbol, 0, 0);
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < perfSettings.particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function connectParticles() {
        if (!perfSettings.enableParticleConnections) return;
        
        const maxDistance = 100;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distSq = dx * dx + dy * dy;
                
                if (distSq < maxDistance * maxDistance) {
                    const distance = Math.sqrt(distSq);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(168, 51, 185, ${0.1 * (1 - distance / maxDistance)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animateParticles() {
        frameCount++;
        
        // Skip frames on mobile for better performance
        if (frameCount % perfSettings.animationThrottle !== 0) {
            animationId = requestAnimationFrame(animateParticles);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        animationId = requestAnimationFrame(animateParticles);
    }
    
    // Initialize
    resizeCanvas();
    initParticles();
    animateParticles();
    
    // Debounced resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initParticles();
        }, 250);
    });
    
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animateParticles();
        }
    });
}


// Cursor Trail Effect (Desktop only)
if (perfSettings.enableCursorTrail) {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorRing);
    
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let trailThrottle = 0;
    
    const trailColors = ['#a833b9', '#c08552', '#c1df1f', '#9bc4cb'];
    
    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-trail particle';
        particle.style.cssText = `left:${x}px;top:${y}px;background:${trailColors[Math.floor(Math.random() * trailColors.length)]}`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        
        trailThrottle++;
        if (trailThrottle % 4 === 0) {
            createTrailParticle(mouseX, mouseY);
        }
    });
    
    function animateCursorRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        
        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();
    
    // Hover effects
    document.querySelectorAll('a, button, .btn, .skill-card, .nav-links a, .theme-toggle').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorRing.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorRing.classList.remove('hover');
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
        cursorRing.classList.add('click');
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createTrailParticle(
                    mouseX + (Math.random() - 0.5) * 30,
                    mouseY + (Math.random() - 0.5) * 30
                );
            }, i * 30);
        }
    });
    
    document.addEventListener('mouseup', () => {
        cursorRing.classList.remove('click');
    });
}

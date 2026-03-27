// ===== DOM ELEMENTS =====
const loadingOverlay = document.getElementById('loading');
const darkModeToggle = document.getElementById('darkModeToggle');
const scrollTopBtn = document.getElementById('scrollTop');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const heroName = document.getElementById('hero-name');
const heroTagline = document.getElementById('hero-tagline');
const heroCta = document.getElementById('hero-cta');

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';

            document.querySelectorAll('.fade-in').forEach(el => {
                el.classList.add('visible');
            });

            document.querySelectorAll('.slide-in-left').forEach(el => {
                el.classList.add('visible');
            });

            document.querySelectorAll('.slide-in-right').forEach(el => {
                el.classList.add('visible');
            });
        }, 500);
    }, 800);
});

// ===== DARK MODE TOGGLE =====
// Set light mode as default
document.documentElement.removeAttribute('data-theme');
localStorage.setItem('theme', 'light');
updateDarkModeIcon(false);

darkModeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        updateDarkModeIcon(false);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateDarkModeIcon(true);
    }
});

function updateDarkModeIcon(isDark) {
    const icon = darkModeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            if (entry.target.classList.contains('skill-category')) {
                const index = Array.from(document.querySelectorAll('.skill-category')).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }

            if (entry.target.classList.contains('project-card')) {
                const index = Array.from(document.querySelectorAll('.project-card')).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .skill-category, .project-card, .timeline-item').forEach(el => {
    observer.observe(el);
});

// ===== NAVIGATION SCROLL & HIGHLIGHT =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            updateActiveNavLink(targetId);
        }
    });
});

function updateActiveNavLink(targetId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    if (current) {
        updateActiveNavLink(`#${current}`);
    }
});

// ===== SCROLL TO TOP BUTTON =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== PARTICLES BACKGROUND =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--primary-color);
            border-radius: 50%;
            left: ${posX}%;
            top: ${posY}%;
            opacity: ${Math.random() * 0.3 + 0.1};
            animation: floatParticle ${duration}s linear ${delay}s infinite;
            z-index: -1;
        `;

        particlesContainer.appendChild(particle);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translate(0, 0) rotate(0deg);
            }
            25% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(90deg);
            }
            50% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(180deg);
            }
            75% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(270deg);
            }
            100% {
                transform: translate(0, 0) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const taglines = [
        "IT Student | Full-Stack Developer",
        "Freelance Developer",
        "Tech Enthusiast",
        "Continuous Learner"
    ];

    let currentTaglineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentTagline = taglines[currentTaglineIndex];

        if (isDeleting) {
            heroTagline.textContent = currentTagline.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            heroTagline.textContent = currentTagline.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentTagline.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentTaglineIndex = (currentTaglineIndex + 1) % taglines.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1500);
}

// ===== CONTACT FORM HANDLING WITH FORMSPREE =====
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;

        const formData = new FormData(contactForm);

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('https://formspree.io/f/xeopzvgq', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }

        } catch (error) {
            showNotification('Failed to send message. Please try again or email me directly.', 'error');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification function
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    let backgroundColor;
    if (type === 'success') {
        backgroundColor = '#10b981';
    } else if (type === 'error') {
        backgroundColor = '#ef4444';
    } else {
        backgroundColor = '#3b82f6';
    }

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== SKILLS PROGRESS ANIMATION =====
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach((skill, index) => {
        const progressBar = document.createElement('div');
        progressBar.className = 'skill-progress';
        progressBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: var(--primary-color);
            width: 0%;
            transition: width 1.5s ease ${index * 0.05}s;
            border-radius: 0 0 12px 12px;
        `;

        const skillCategory = skill.closest('.skill-category');
        if (skillCategory && !skillCategory.querySelector('.skill-progress')) {
            skillCategory.style.position = 'relative';
            skillCategory.style.overflow = 'hidden';
            skillCategory.appendChild(progressBar);

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            progressBar.style.width = `${Math.random() * 30 + 70}%`;
                        }, 300);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(skillCategory);
        }
    });
}

// ===== PROJECT CARD INTERACTIONS =====
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';

            const overlay = document.createElement('div');
            overlay.className = 'project-overlay';
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, 
                    rgba(37, 99, 235, 0.1) 0%, 
                    rgba(124, 58, 237, 0.1) 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
                border-radius: var(--border-radius);
                pointer-events: none;
            `;
            card.appendChild(overlay);

            setTimeout(() => {
                overlay.style.opacity = '1';
            }, 50);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-10px) scale(1)';
            const overlay = card.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            }
        });
    });
}

// ===== COPYRIGHT YEAR UPDATE =====
function updateCopyrightYear() {
    const footerText = document.getElementById('footer-text');
    if (footerText) {
        const currentYear = new Date().getFullYear();
        footerText.textContent = `© ${currentYear} Harshal Lathiya. All rights reserved.`;
    }
}

// ===== HERO NAME RANDOM COLOR EFFECT =====
function initHeroNameEffect() {
    if (!heroName) return;

    const colors = [
        'var(--primary-color)',
        'var(--secondary-color)',
        'var(--accent-color)',
        '#f59e0b',
        '#ec4899'
    ];

    let currentColorIndex = 0;

    setInterval(() => {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        heroName.style.color = colors[currentColorIndex];
        heroName.style.transition = 'color 0.5s ease';
    }, 3000);

    heroName.addEventListener('mouseenter', () => {
        heroName.style.textShadow = '0 0 20px rgba(37, 99, 235, 0.3)';
    });

    heroName.addEventListener('mouseleave', () => {
        heroName.style.textShadow = 'none';
    });
}

function initMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');
    const navRight = document.querySelector('.nav-right');

    if (!navContainer || !navMenu || !navRight) return;

    let hamburger = document.querySelector('.hamburger');

    // Create hamburger only once
    if (!hamburger && window.innerWidth <= 768) {
        hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');

        navContainer.insertBefore(hamburger, navRight);
    }

    if (!hamburger) return;

    // Toggle menu
    hamburger.onclick = () => {
        navMenu.classList.toggle('active');

        const isOpen = navMenu.classList.contains('active');

        hamburger.innerHTML = isOpen
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';

        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    // Close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = () => {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        };
    });

    // Handle resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';

            if (hamburger) {
                hamburger.remove();
                hamburger = null;
            }
        }
    });
}
// ===== PHOTO GALLERY SLIDER =====
function initPhotoSlider() {
    const slider = document.querySelector(".slider");
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsContainer = document.getElementById("sliderDots");

    if (!slider || !slides.length) return;

    let currentIndex = 0;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(currentIndex);
    }

    // Event listeners
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Auto-play functionality
    let autoPlayInterval = setInterval(nextSlide, 6000);

    // Pause auto-play on hover
    const sliderContainer = document.querySelector(".slider-container");
    sliderContainer.addEventListener("mouseenter", () => {
        clearInterval(autoPlayInterval);
    });

    sliderContainer.addEventListener("mouseleave", () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            prevSlide();
        } else if (e.key === "ArrowRight") {
            nextSlide();
        }
    });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initTypingEffect();
    animateSkills();
    initProjectCards();
    updateCopyrightYear();
    initHeroNameEffect();
    initMobileMenu();
    initPhotoSlider();

    console.log('%c🚀 Harshal Lathiya Portfolio', 'color: #2563eb; font-size: 18px; font-weight: bold;');
    console.log('%cThanks for checking out my portfolio!', 'color: #6b7280;');
    console.log('%cFind the code on GitHub: https://github.com/HarshalLathiya', 'color: #10b981;');
});

// ===== WINDOW RESIZE HANDLER =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initMobileMenu();
    }, 250);
});

// ===== ADDITIONAL CSS FOR JS FEATURES =====
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: flex !important;
        }
        
        .nav-menu.active {
            transform: translateY(0) !important;
            opacity: 1 !important;
        }
    }
    
    .particle {
        will-change: transform;
    }
    
    html {
        scroll-behavior: smooth;
    }
    
    *:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    @media print {
        .notification,
        .hamburger,
        .dark-mode-toggle,
        .scroll-top {
            display: none !important;
        }
    }
`;

document.head.appendChild(additionalStyles);
// Device detection and performance utilities
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768 ||
        'ontouchstart' in window;
};

const isLowEndDevice = () => {
    return navigator.hardwareConcurrency <= 2 ||
        navigator.deviceMemory <= 2;
};

// Performance optimization: Reduce particles on mobile
const getParticleCount = () => {
    if (isMobile() || isLowEndDevice()) {
        return 15; // Reduced from 50
    }
    return 50;
};

// Debounce utility for scroll events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Configuration object for editable content
const defaultConfig = {
    hero_name: "Harshal Lathiya",
    hero_tagline: "BCA Student | Freelancer Developer | Tech Enthusiast",
    hero_cta: "View My Work",
    about_description:
        "Passionate BCA student with expertise in web development and a strong foundation in programming languages. I specialize in creating responsive, user-friendly applications using modern technologies. With experience in both frontend and backend development, I enjoy solving complex problems and bringing innovative ideas to life through code.",
    resume_button: "Download Resume",
    contact_title: "Get In Touch",
    footer_text: "© 2024 Harshal Lathiya. All rights reserved.",
};

// Element SDK initialization
if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig: defaultConfig,
        onConfigChange: async (config) => {
            // Update hero section
            const heroName = document.getElementById("hero-name");
            const heroTagline = document.getElementById("hero-tagline");
            const heroCta = document.getElementById("hero-cta");
            const aboutDesc = document.getElementById("about-description");
            const resumeBtn = document.getElementById("resume-button");
            const contactTitle = document.getElementById("contact-title");
            const footerText = document.getElementById("footer-text");

            if (heroName)
                heroName.textContent =
                    config.hero_name || defaultConfig.hero_name;
            if (heroTagline)
                heroTagline.textContent =
                    config.hero_tagline || defaultConfig.hero_tagline;
            if (heroCta)
                heroCta.textContent = config.hero_cta || defaultConfig.hero_cta;
            if (aboutDesc)
                aboutDesc.textContent =
                    config.about_description || defaultConfig.about_description;
            if (resumeBtn)
                resumeBtn.innerHTML = `<i class="fas fa-download"></i> ${config.resume_button || defaultConfig.resume_button
                    }`;
            if (contactTitle)
                contactTitle.textContent =
                    config.contact_title || defaultConfig.contact_title;
            if (footerText)
                footerText.textContent =
                    config.footer_text || defaultConfig.footer_text;
        },
        mapToCapabilities: (config) => ({
            recolorables: [],
            borderables: [],
            fontEditable: undefined,
            fontSizeable: undefined,
        }),
        mapToEditPanelValues: (config) =>
            new Map([
                ["hero_name", config.hero_name || defaultConfig.hero_name],
                [
                    "hero_tagline",
                    config.hero_tagline || defaultConfig.hero_tagline,
                ],
                ["hero_cta", config.hero_cta || defaultConfig.hero_cta],
                [
                    "about_description",
                    config.about_description || defaultConfig.about_description,
                ],
                [
                    "resume_button",
                    config.resume_button || defaultConfig.resume_button,
                ],
                [
                    "contact_title",
                    config.contact_title || defaultConfig.contact_title,
                ],
                ["footer_text", config.footer_text || defaultConfig.footer_text],
            ]),
    });
}

// Typing animation for hero tagline
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = "";

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Lazy load particle system for mobile performance
function createParticles() {
    const particlesContainer = document.getElementById("particles");
    if (!particlesContainer) return;

    const particleCount = getParticleCount();

    // Progressive enhancement: Skip particles on very low-end devices
    if (isLowEndDevice() && navigator.deviceMemory <= 1) {
        return;
    }

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.className = "particle";
            particle.style.left = Math.random() * 100 + "%";
            particle.style.animationDelay = Math.random() * 20 + "s";
            particle.style.animationDuration = Math.random() * 10 + 15 + "s";

            // Random colors for particles
            const colors = [
                "#ff006e",
                "#8338ec",
                "#3a86ff",
                "#06ffa5",
                "#ffffff",
            ];
            particle.style.background =
                colors[Math.floor(Math.random() * colors.length)];
            particle.style.boxShadow = `0 0 10px ${colors[Math.floor(Math.random() * colors.length)]
                }`;

            fragment.appendChild(particle);
        }

        particlesContainer.appendChild(fragment);
    });
}

// Loading animation with dynamic timing based on device capabilities
window.addEventListener('load', function () {
    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        // Dynamic delay based on device performance
        const delay = isLowEndDevice() ? 200 : isMobile() ? 300 : 500;

        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            // Remove from DOM after animation
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, delay);
    }
});

// Initialize typing animation and particles
document.addEventListener("DOMContentLoaded", function () {
    // Create particle system
    createParticles();

    const taglineElement = document.getElementById("hero-tagline");
    if (taglineElement) {
        setTimeout(() => {
            typeWriter(taglineElement, defaultConfig.hero_tagline, 50);
        }, 1000);
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

// Optimized scroll animations with reduced threshold for mobile
const observerOptions = {
    threshold: isMobile() ? 0.05 : 0.1, // Lower threshold on mobile for better performance
    rootMargin: "0px 0px -50px 0px",
};

// Batch DOM updates for better performance
let animationQueue = [];
let animationFrameId = null;

const processAnimationQueue = () => {
    animationQueue.forEach(entry => {
        entry.target.classList.add("visible");
    });
    animationQueue = [];
    animationFrameId = null;
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Use requestAnimationFrame for batched updates
            animationQueue.push(entry);
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(processAnimationQueue);
            }
        }
    });
}, observerOptions);

// Observe all animation elements
document
    .querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")
    .forEach((el) => {
        observer.observe(el);
    });

// Scroll to top functionality
const scrollTopBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add("visible");
    } else {
        scrollTopBtn.classList.remove("visible");
    }
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

// Dark mode toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const icon = darkModeToggle.querySelector("i");

    if (body.classList.contains("dark-mode")) {
        icon.className = "fas fa-sun";
        localStorage.setItem("darkMode", "enabled");
    } else {
        icon.className = "fas fa-moon";
        localStorage.setItem("darkMode", "disabled");
    }
});

// Check for saved dark mode preference
if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    darkModeToggle.querySelector("i").className = "fas fa-sun";
}

// Contact form handling
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Simple form validation
    if (!name || !email || !message) {
        showNotification("Please fill in all fields", "error");
        return;
    }

    // Send form data to Formspree
    const submitBtn = contactForm.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    fetch("https://formspree.io/f/xeopzvgq", {
        method: "POST",
        body: formData,
        headers: {
            Accept: "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                submitBtn.innerHTML =
                    '<i class="fas fa-check"></i> Message Sent!';
                showNotification(
                    "Thank you for your message! I'll get back to you soon.",
                    "success"
                );
                contactForm.reset();
            } else {
                throw new Error("Form submission failed");
            }
        })
        .catch((error) => {
            showNotification(
                "Oops! There was a problem submitting your form. Please try again.",
                "error"
            );
        })
        .finally(() => {
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
});

// Notification system
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: ${type === "success"
            ? "#28a745"
            : type === "error"
                ? "#dc3545"
                : "#007bff"
        };
                color: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
                font-weight: 500;
            `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = "translateX(400px)";
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Mobile menu toggle
const mobileMenu = document.querySelector(".mobile-menu");
const navMenu = document.querySelector(".nav-menu");

mobileMenu.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    mobileMenu.classList.toggle("active");
});

// Add mobile menu styles
const mobileStyles = document.createElement("style");
mobileStyles.textContent = `
            @media (max-width: 1200px) {
                .nav-menu {
                    position: fixed;
                    top: 70px;
                    right: -100%;
                    width: 100%;
                    height: calc(100% - 70px);
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                    padding-top: 2rem;
                    transition: right 0.3s ease;
                }

                .nav-menu.active {
                    right: 0;
                }

                .nav-menu li {
                    margin: 1rem 0;
                }

                .mobile-menu.active span:nth-child(1) {
                    transform: rotate(-45deg) translate(-5px, 6px);
                }

                .mobile-menu.active span:nth-child(2) {
                    opacity: 0;
                }

                .mobile-menu.active span:nth-child(3) {
                    transform: rotate(45deg) translate(-5px, -6px);
                }
            }
        `;
document.head.appendChild(mobileStyles);

// Resume download functionality
document
    .getElementById("resume-button")
    .addEventListener("click", function (e) {
        e.preventDefault();
        showNotification(
            "Resume download would be implemented with actual PDF file",
            "info"
        );
    });

// Project links now use actual GitHub URLs and work normally

// Social links now work properly - they redirect to actual profiles

// Enhanced parallax and scroll effects with performance optimization
const handleScroll = debounce(() => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    const orbs = document.querySelectorAll(".orb");
    const navbar = document.querySelector(".navbar");

    // Performance: Skip heavy animations on mobile/low-end devices
    if (isMobile() || isLowEndDevice()) {
        // Only update navbar glow on mobile
        if (navbar) {
            const opacity = Math.min(scrolled / 100, 1);
            navbar.style.boxShadow = `0 8px 32px rgba(99, 102, 241, ${0.3 * opacity})`;
        }
        return;
    }

    // Hero parallax
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }

    // Orb parallax with different speeds - skip if orbs are hidden
    if (orbs.length > 0 && !isMobile()) {
        orbs.forEach((orb, index) => {
            const speed = 0.1 + index * 0.05;
            orb.style.transform = `translate(${Math.sin(scrolled * 0.001 + index) * 20}px, ${scrolled * speed}px)`;
        });
    }

    // Navbar glow effect on scroll
    if (navbar) {
        const opacity = Math.min(scrolled / 100, 1);
        navbar.style.boxShadow = `0 8px 32px rgba(99, 102, 241, ${0.3 * opacity})`;
    }

    // Particle movement based on scroll - skip if particles are hidden
    const particles = document.querySelectorAll(".particle");
    if (particles.length > 0 && !isMobile()) {
        particles.forEach((particle, index) => {
            const speed = 0.02 + (index % 5) * 0.01;
            particle.style.transform = `translateX(${Math.sin(scrolled * speed + index) * 10}px)`;
        });
    }
}, 16); // ~60fps

window.addEventListener("scroll", handleScroll, { passive: true });

// Progressive enhancement: Add hover effects only on non-touch devices
if (!isMobile()) {
    document.querySelectorAll(".skill-item").forEach((item) => {
        item.addEventListener("mouseenter", function () {
            this.style.transform = "translateX(10px)";
        });

        item.addEventListener("mouseleave", function () {
            this.style.transform = "translateX(0)";
        });
    });
}

// Basic performance monitoring
const performanceMetrics = {
    loadTime: 0,
    fps: 0,
    memoryUsage: 0
};

// Track load time
window.addEventListener('load', () => {
    performanceMetrics.loadTime = performance.now();
    console.log(`Page load time: ${performanceMetrics.loadTime.toFixed(2)}ms`);
});

// Basic FPS monitoring (optional, can be disabled on low-end devices)
if (!isLowEndDevice()) {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
            performanceMetrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;

            // Log FPS every second (can be removed in production)
            console.log(`FPS: ${performanceMetrics.fps}`);
        }

        requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
}

(function () {
    function c() {
        var b = a.contentDocument || a.contentWindow.document;
        if (b) {
            var d = b.createElement("script");
            d.innerHTML =
                "window.__CF$cv$params={r:'9969b6adf12b8b09',t:'MTc2MTgxNDczNS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
            b.getElementsByTagName("head")[0].appendChild(d);
        }
    }
    if (document.body) {
        var a = document.createElement("iframe");
        a.height = 1;
        a.width = 1;
        a.style.position = "absolute";
        a.style.top = 0;
        a.style.left = 0;
        a.style.border = "none";
        a.style.visibility = "hidden";
        document.body.appendChild(a);
        if ("loading" !== document.readyState) c();
        else if (window.addEventListener)
            document.addEventListener("DOMContentLoaded", c);
        else {
            var e = document.onreadystatechange || function () { };
            document.onreadystatechange = function (b) {
                e(b);
                "loading" !== document.readyState &&
                    ((document.onreadystatechange = e), c());
            };
        }
    }
})();

/**
 * HUMISENSE - Premium Enterprise Sales Website JavaScript
 * Psychology-First Design for Maximum Conversion
 * GSAP Animations, SplitType, Lenis Smooth Scroll, Interactive Elements
 */

// Store global references
let lenisInstance = null;
let scrollTriggerInstance = null;

/**
 * Main initialization function
 */
function initHumisensePremium() {
    // Ensure body is visible (fixes bfcache issues)
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';
    
    // Hide loader
    hideLoader();
    
    // Scroll to top on load
    window.scrollTo(0, 0);
    
    // Initialize all components
    initLenis();
    initSplitText();
    initHeroAnimation();
    initScrollAnimations();
    initCounterAnimations();
    initFloatingCTA();
    initFAQ();
    initCardHoverEffects();
    initMagneticButtons();
    initButtonRipples();
    initScrollTop();
    initSmoothScroll();
    initLogoAnimation();
    initParallaxEffects();
    initFormEnhancements();
    
    console.log('HUMISENSE Premium initialized');
}

/**
 * Hide loading screen
 */
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        // Animate loader out
        gsap.to(loader, {
            opacity: 0,
            duration: 0.5,
            delay: 1.5,
            ease: 'power2.out',
            onComplete: () => {
                loader.classList.add('hidden');
                loader.style.display = 'none';
            }
        });
    }
}

/**
 * Initialize Lenis smooth scroll
 */
function initLenis() {
    if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;
    
    // Destroy existing instance
    if (lenisInstance) {
        lenisInstance.destroy();
    }
    
    lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    // RAF loop
    function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate with GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

/**
 * Initialize SplitType text animations
 */
function initSplitText() {
    // Check if SplitType is available
    if (typeof SplitType === 'undefined') {
        console.warn('SplitType not loaded');
        return;
    }
    
    // Hero title animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Split text into characters
        const split = new SplitType(heroTitle, {
            types: 'chars, words',
            tagName: 'span'
        });
        
        // Store for later animation
        heroTitle.splitInstance = split;
    }
}

/**
 * Hero section animations - Premium entrance
 */
function initHeroAnimation() {
    const tl = gsap.timeline({ delay: 0.3 });
    
    // Badge animation
    tl.fromTo('.hero-badge', 
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
    );
    
    // Tagline
    tl.fromTo('.hero-tagline',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.3'
    );
    
    // Hero title - split text animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.splitInstance) {
        const chars = heroTitle.querySelectorAll('.char');
        
        tl.fromTo(chars,
            { y: 60, opacity: 0, rotateX: -90 },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.8,
                stagger: 0.02,
                ease: 'power3.out'
            },
            '-=0.2'
        );
    } else if (heroTitle) {
        // Fallback without SplitType
        tl.fromTo(heroTitle.querySelectorAll('.hero-title-line'),
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
            '-=0.5'
        );
    }
    
    // Subtitle
    tl.fromTo('.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
    );
    
    // CTA buttons
    tl.fromTo('.hero-cta .btn',
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' },
        '-=0.2'
    );
    
    // Stats row
    tl.fromTo('.hero-stats',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.2'
    );
    
    tl.fromTo('.hero-stat',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power3.out' },
        '-=0.4'
    );
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.fromTo(header,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Stagger children animations
    gsap.utils.toArray('.stagger-children').forEach(container => {
        const children = container.children;
        
        gsap.fromTo(children,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Individual animated elements
    gsap.utils.toArray('[data-animate]').forEach(el => {
        const delay = parseFloat(el.dataset.delay) || 0;
        
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: delay / 1000,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Scale animations
    gsap.utils.toArray('[data-animate-scale]').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Horizontal slide animations
    gsap.utils.toArray('[data-animate-left]').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    gsap.utils.toArray('[data-animate-right]').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, x: 50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

/**
 * Animated counters
 */
function initCounterAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    const counters = document.querySelectorAll('.counter, .proof-stat-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target) || parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            onEnter: () => {
                gsap.fromTo(counter,
                    { innerText: 0 },
                    {
                        innerText: target,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerText: 1 },
                        onUpdate: function() {
                            counter.innerText = prefix + Math.round(this.targets()[0].innerText) + suffix;
                        }
                    }
                );
            },
            once: true
        });
    });
}

/**
 * Floating CTA visibility
 */
function initFloatingCTA() {
    const floatingCTA = document.querySelector('.floating-cta');
    const mobileStickyCTA = document.querySelector('.mobile-sticky-cta');
    
    if (!floatingCTA && !mobileStickyCTA) return;
    
    // Show floating CTA after scrolling past hero
    const heroSection = document.querySelector('.hero');
    
    ScrollTrigger.create({
        trigger: heroSection,
        start: 'bottom top',
        onEnter: () => {
            floatingCTA?.classList.add('visible');
            mobileStickyCTA?.classList.add('visible');
        },
        onLeaveBack: () => {
            floatingCTA?.classList.remove('visible');
            mobileStickyCTA?.classList.remove('visible');
        }
    });
}

/**
 * FAQ accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        gsap.to(otherAnswer, {
                            maxHeight: 0,
                            duration: 0.3,
                            ease: 'power2.inOut'
                        });
                    }
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                gsap.to(answer, {
                    maxHeight: 0,
                    duration: 0.3,
                    ease: 'power2.inOut'
                });
            } else {
                item.classList.add('active');
                gsap.fromTo(answer,
                    { maxHeight: 0 },
                    {
                        maxHeight: 500,
                        duration: 0.4,
                        ease: 'power2.out'
                    }
                );
            }
        });
    });
}

/**
 * Premium card hover effects
 */
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.service-card, .problem-card, .case-study-card, .testimonial-card');
    
    cards.forEach(card => {
        // Add 3D tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.3,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

/**
 * Magnetic button effect
 */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn, .btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.15,
                y: y * 0.15,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

/**
 * Button ripple effect
 */
function initButtonRipples() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
            `;
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            gsap.to(ripple, {
                scale: 4,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            });
        });
    });
}

/**
 * Scroll to top button
 */
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        if (lenisInstance) {
            lenisInstance.scrollTo(0, { duration: 1.5 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                if (lenisInstance) {
                    lenisInstance.scrollTo(target, {
                        offset: -80,
                        duration: 1.5
                    });
                } else {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Logo hover animation
 */
function initLogoAnimation() {
    const logo = document.querySelector('.nav-logo');
    
    if (!logo) return;
    
    logo.addEventListener('mouseenter', () => {
        gsap.to(logo.querySelector('img'), {
            scale: 1.1,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    });
    
    logo.addEventListener('mouseleave', () => {
        gsap.to(logo.querySelector('img'), {
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.5)'
        });
    });
}

/**
 * Parallax effects
 */
function initParallaxEffects() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    // Hero gradient parallax
    const heroGradient = document.querySelector('.hero-gradient');
    if (heroGradient) {
        gsap.to(heroGradient, {
            y: -100,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
    
    // CTA section glow parallax
    const ctaGradient = document.querySelector('.cta-section::before');
    if (ctaGradient) {
        gsap.to('.cta-section::before', {
            y: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
}

/**
 * Form enhancements
 */
function initFormEnhancements() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        // Focus animation
        input.addEventListener('focus', () => {
            gsap.to(input, {
                borderColor: 'var(--color-accent-primary)',
                boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
                duration: 0.2
            });
        });
        
        input.addEventListener('blur', () => {
            gsap.to(input, {
                borderColor: 'var(--color-border)',
                boxShadow: 'none',
                duration: 0.2
            });
        });
    });
}

/**
 * Utility: Animate element into view
 */
function animateIntoView(element, options = {}) {
    const defaults = {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0,
        ease: 'power3.out'
    };
    
    const config = { ...defaults, ...options };
    
    gsap.fromTo(element, config, {
        opacity: 1,
        y: 0,
        ...config
    });
}

/**
 * Utility: Animate staggered children
 */
function animateStagger(container, children, options = {}) {
    const defaults = {
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
    };
    
    const config = { ...defaults, ...options };
    
    gsap.fromTo(children, config, {
        opacity: 1,
        y: 0,
        ...config
    });
}

/**
 * Refresh ScrollTrigger (useful after dynamic content load)
 */
function refreshScrollTrigger() {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}

// ============================================
// Event Listeners
// ============================================

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initHumisensePremium);

// Fix for browser back/forward button (bfcache)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        document.body.style.opacity = '1';
        document.body.style.visibility = 'visible';
        initHumisensePremium();
        
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }
});

// Handle pagehide for iOS Safari bfcache
window.addEventListener('pagehide', () => {
    if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
    }
});

// Prevent back/forward cache issues
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '1';
});

// Export for use in other scripts
window.HumisensePremium = {
    animateIntoView,
    animateStagger,
    refreshScrollTrigger,
    lenis: () => lenisInstance
};

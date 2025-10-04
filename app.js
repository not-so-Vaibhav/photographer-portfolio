const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const MotionPathPlugin = window.MotionPathPlugin;
const TextPlugin = window.TextPlugin;
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin);

// Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    const loadingText = document.querySelector('.loading-text');
    const loaderProgress = document.querySelector('.loader-progress');
    gsap.to(loadingText, { opacity: 1, duration: 0.7, ease: 'power2.out' });
    gsap.to(loaderProgress, { width: '100%', duration: 2, ease: 'power2.inOut', onComplete: () => {
        gsap.to(loader, { opacity: 0, duration: 0.7, onComplete: () => {
            loader.style.display = 'none';
            initAnimations();
        } });
    } });
}
window.addEventListener('load', initLoader);

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);
themeToggle.addEventListener('click', () => {
    const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    gsap.to(themeToggle, { scale: 0.95, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' });
});

// Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Custom Cursor (Desktop Only)
if (window.innerWidth > 768) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.1 });
        gsap.to(cursorFollower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.2 });
    });
}

// Animations
function initAnimations() {
    // Navbar Slide In
    gsap.to('nav', { y: 0, duration: 1, ease: 'power3.out' });
    
    // Logo Motion Path Animation
    gsap.to('.path-anim', {
        motionPath: {
            path: [
                { x: -100, y: -50 },
                { x: 0, y: 0 },
                { x: 50, y: -20 },
                { x: 0, y: 0 }
            ],
            curviness: 1.5,
            autoRotate: false
        },
        duration: 2,
        ease: 'elastic.out(1, 0.5)'
    });

    // Hero Stagger with TextPlugin for Subtitle
    const heroTL = gsap.timeline();
    heroTL.to('.hero-title', { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.2, ease: 'power3.out' })
          .to('.hero-subtitle', {
              text: { value: "Capturing stories through the lens – not_so_graphy", delimiter: "" },
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              duration: 2,
              ease: 'power3.out'
          }, '-=0.5')
          .to('.hero-description', { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
          .to('.cta-button', { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');

    // CTA Button Hover Animation
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('mouseenter', () => {
        gsap.to(ctaButton, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
    });
    ctaButton.addEventListener('mouseleave', () => {
        gsap.to(ctaButton, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });

    // Gallery Scroll Trigger
    gsap.utils.toArray('.gallery-category').forEach((category, i) => {
        const title = category.querySelector('h3');
        const items = category.querySelectorAll('.gallery-item');
        gsap.from(title, {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
        items.forEach((item, j) => {
            gsap.from(item, {
                opacity: 0,
                scale: 0.9,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                delay: j * 0.2
            });
        });
    });
    
    // Parallax on Hero Image
    gsap.to('.hero-image', {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            scrub: true,
            start: 'top top',
            end: 'bottom top'
        }
    });

    // Professional About Image Animation
    gsap.from('.about-image', {
        opacity: 0,
        scale: 0.8,
        rotation: 10,
        x: -50,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        onComplete: () => {
            gsap.to('.about-image', { rotation: 0, x: 0, duration: 0.5, ease: 'power2.out' });
        }
    });

    // About Text Fade In
    gsap.utils.toArray('.about-text p').forEach((p, i) => {
        gsap.from(p, {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: p,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            delay: i * 0.2
        });
    });

    // Achievements Animation
    gsap.utils.toArray('.achievement-tab').forEach((tab, i) => {
        gsap.from(tab, {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: tab,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            delay: i * 0.2
        });
    });
}
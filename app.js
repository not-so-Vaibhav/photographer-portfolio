// Wait for GSAP to load
let gsap, ScrollTrigger, MotionPathPlugin, TextPlugin;

function initGSAP() {
    if (!window.gsap) {
        setTimeout(initGSAP, 50);
        return;
    }
    gsap = window.gsap;
    ScrollTrigger = window.ScrollTrigger;
    MotionPathPlugin = window.MotionPathPlugin;
    TextPlugin = window.TextPlugin;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);
    if (TextPlugin) gsap.registerPlugin(TextPlugin);
    initApp();
}

async function initApp() {
    // Load photo data first
    await loadPhotoData();
    
    initLoader();
    initTheme();
    initMobileMenu();
    initCursor();
    initLazyImages();
    initForm();
    initExploreMore();
    initLightbox();
}

// Loader - Optimized for fast loading
function initLoader() {
  const loader = document.querySelector('.loader');
    if (!loader) {
        initAnimations();
        return;
    }

  const loaderProgress = loader.querySelector('.loader-progress');
    if (!loaderProgress) {
        loader.remove();
        initAnimations();
        return;
    }

    // Fast loader - show progress immediately
    const startTime = performance.now();
    const minLoadTime = 300; // Minimum 300ms for smooth UX
    
    function updateLoader() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / 800, 1);
        
        if (gsap) {
  gsap.to(loaderProgress, {
                width: `${progress * 100}%`,
                duration: 0.1,
                ease: 'none'
            });
        } else {
            loaderProgress.style.width = `${progress * 100}%`;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateLoader);
        } else {
            // Wait for minimum load time
            const remaining = Math.max(0, minLoadTime - elapsed);
            setTimeout(hideLoader, remaining);
        }
    }

  function hideLoader() {
        if (gsap) {
    gsap.to(loader, {
      opacity: 0,
                duration: 0.3,
      ease: 'power1.out',
      onComplete: () => {
                    loader.remove();
                    initAnimations();
                }
            });
        } else {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
                initAnimations();
            }, 300);
        }
    }
    
    // Start loading immediately
    updateLoader();
    
    // Fallback - remove loader after max 1.5s
    setTimeout(() => {
        if (loader.parentNode) {
            loader.remove();
            initAnimations();
        }
    }, 1500);
}


// Theme Toggle
function initTheme() {
const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
const body = document.body;
const currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);
    
themeToggle.addEventListener('click', () => {
    const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
        if (gsap) {
    gsap.to(themeToggle, { scale: 0.95, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' });
        }
});
}

// Mobile Menu
function initMobileMenu() {
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
    if (!menuToggle || !mobileMenu) return;
    
    const body = document.body;
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});
    
    // Close menu when clicking on links
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });
}

// Custom Cursor (Desktop Only)
function initCursor() {
    if (window.innerWidth <= 768) return;
    
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    if (!cursor || !cursorFollower) return;
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX - 10;
        mouseY = e.clientY - 10;
        
        if (gsap) {
            gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power1.out' });
            gsap.to(cursorFollower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.2, ease: 'power1.out' });
        } else {
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
        }
    });
}

// Lazy Loading Images - Fixed to ensure all images display
function initLazyImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    // Immediately make all images visible
    images.forEach(img => {
        img.classList.add('loaded');
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        img.style.display = 'block';
        
        // Add error handling
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            // Don't hide, just log the error
        });
        
        // Force load check
        if (img.complete) {
            img.classList.add('loaded');
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
                this.style.opacity = '1';
            });
        }
    });
    
    // Ensure gallery grids are visible
    document.querySelectorAll('.gallery-grid').forEach(grid => {
        grid.style.display = 'grid';
        grid.style.visibility = 'visible';
        grid.style.opacity = '1';
    });
    
    // Ensure gallery categories are visible
    document.querySelectorAll('.gallery-category').forEach(category => {
        category.style.display = 'block';
        category.style.visibility = 'visible';
        category.style.opacity = '1';
    });
}

// Photo data - loaded from JSON or fallback
let photoData = {};

// Load photos from JSON file
async function loadPhotoData() {
    try {
        const response = await fetch('photos.json');
        if (response.ok) {
            photoData = await response.json();
        } else {
            // Fallback to default data
            photoData = getDefaultPhotoData();
        }
    } catch (error) {
        console.warn('Could not load photos.json, using default data:', error);
        photoData = getDefaultPhotoData();
    }
}

// Default photo data (fallback)
function getDefaultPhotoData() {
    return {
        portraits: {
            display: ['images/portraits1.jpg', 'images/portraits2.jpg'],
            additional: ['images/1.jpg', 'images/vaibhav.jpg']
        },
        street: {
            display: ['images/street1.jpg', 'images/street2.jpg'],
            additional: ['images/1.jpg']
        },
        festival: {
            display: ['images/festival1.jpg', 'images/festival2.jpg'],
            additional: ['images/1.jpg']
        },
        creative: {
            display: ['images/creative1.jpg', 'images/creative2.jpg'],
            additional: ['images/Picsart_25-09-30_01-48-03-503.jpg', 'images/1.jpg']
        },
        candid: {
            display: ['images/candid1.jpg', 'images/candid2.jpg'],
            additional: ['images/1.jpg']
        }
    };
}

// Get all images for a category (display + additional)
function getAllImagesForCategory(category) {
    if (!photoData[category]) return [];
    const categoryData = photoData[category];
    // Combine display and additional, removing duplicates
    const allImages = [...categoryData.display, ...categoryData.additional];
    return [...new Set(allImages)]; // Remove duplicates
}

// Explore More Modal
function initExploreMore() {
    const exploreButtons = document.querySelectorAll('.explore-more');
    const modal = document.getElementById('galleryModal');
    const modalGallery = document.getElementById('modalGallery');
    const modalClose = document.getElementById('modalClose');
    
    if (!modal || !modalGallery) return;
    
    exploreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            const images = getAllImagesForCategory(category);
            
            if (images.length === 0) {
                showMessage('No additional photos available for this category.', 'info');
                return;
            }
            
            // Clear previous content
            modalGallery.innerHTML = '';
            
            // Add category title with photo count
            const categoryTitle = button.closest('.gallery-category').querySelector('h3').textContent;
            const title = document.createElement('h3');
            title.innerHTML = `${categoryTitle} <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 400;">(${images.length} photos)</span>`;
            title.style.cssText = 'grid-column: 1 / -1; font-size: 2rem; margin-bottom: 1.5rem; color: var(--text-primary); text-align: center; padding-bottom: 1rem; border-bottom: 2px solid var(--border-color);';
            modalGallery.appendChild(title);
            
            // Add images to modal
            images.forEach((src, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.style.cssText = 'position: relative; overflow: hidden; border-radius: 10px;';
                
                const img = document.createElement('img');
                img.src = src;
                img.alt = `${category} ${index + 1}`;
                img.loading = 'lazy';
                img.style.cssText = 'width: 100%; height: auto; display: block; cursor: pointer; transition: transform 0.3s ease;';
                
                img.addEventListener('click', () => openLightbox(images, index));
                img.addEventListener('mouseenter', () => {
                    img.style.transform = 'scale(1.05)';
                });
                img.addEventListener('mouseleave', () => {
                    img.style.transform = 'scale(1)';
                });
                
                // Add error handling
                img.addEventListener('error', function() {
                    this.style.display = 'none';
                });
                
                imgContainer.appendChild(img);
                modalGallery.appendChild(imgContainer);
            });
            
            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Lightbox functionality
let currentLightboxImages = [];
let currentLightboxIndex = 0;

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    if (!lightbox || !lightboxImage) return;
    
    function openLightbox(images, index) {
        currentLightboxImages = images;
        currentLightboxIndex = index;
        lightboxImage.src = images[index];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showImage(index) {
        if (index < 0) index = currentLightboxImages.length - 1;
        if (index >= currentLightboxImages.length) index = 0;
        currentLightboxIndex = index;
        lightboxImage.src = currentLightboxImages[index];
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => showImage(currentLightboxIndex - 1));
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => showImage(currentLightboxIndex + 1));
    }
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showImage(currentLightboxIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showImage(currentLightboxIndex + 1);
        }
    });
    
    // Make openLightbox globally accessible
    window.openLightbox = openLightbox;
}

// Contact Form
function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Disable button
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        try {
            // Send to backend
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Show success message
                showMessage('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            // Fallback to email client
            const subject = encodeURIComponent(`Contact from ${data.name}`);
            const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`);
            window.location.href = `mailto:notsography@gmail.com?subject=${subject}&body=${body}`;
            showMessage('Opening email client as fallback...', 'info');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

function showMessage(text, type = 'success') {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent)' : '#f59e0b'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: var(--shadow);
    `;
    document.body.appendChild(message);
    setTimeout(() => {
        message.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Animations
function initAnimations() {
    if (!gsap) {
        // Fallback animations if GSAP not loaded
        document.querySelectorAll('.gallery-item').forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, i * 100);
        });
        return;
    }
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

    // Gallery Scroll Trigger - Optimized
    if (ScrollTrigger) {
        gsap.utils.toArray('.gallery-category').forEach((category) => {
        const title = category.querySelector('h3');
        const items = category.querySelectorAll('.gallery-item');
            
            if (title) {
        gsap.from(title, {
            opacity: 0,
            y: 20,
                    duration: 0.8,
                    ease: 'power2.out',
            scrollTrigger: {
                trigger: title,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                        once: true
                    }
                });
            }
            
        items.forEach((item, j) => {
            gsap.from(item, {
                opacity: 0,
                    scale: 0.95,
                    duration: 0.6,
                    ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                        once: true
                },
                    delay: j * 0.1
                });
            });
        });
    }
    
    // Parallax on Hero Image - Only if ScrollTrigger available
    if (ScrollTrigger) {
    gsap.to('.hero-image', {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
                scrub: 1,
            start: 'top top',
            end: 'bottom top'
        }
    });
    }

    // Professional About Image Animation
    if (ScrollTrigger) {
    gsap.from('.about-image', {
        opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: 'power2.out',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
                toggleActions: 'play none none reverse',
                once: true
        }
    });

    // About Text Fade In
    gsap.utils.toArray('.about-text p').forEach((p, i) => {
        gsap.from(p, {
            opacity: 0,
                y: 15,
                duration: 0.6,
                ease: 'power2.out',
            scrollTrigger: {
                trigger: p,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                    once: true
            },
                delay: i * 0.1
        });
    });

    // Achievements Animation
    gsap.utils.toArray('.achievement-tab').forEach((tab, i) => {
        gsap.from(tab, {
            opacity: 0,
                y: 20,
                duration: 0.6,
                ease: 'power2.out',
            scrollTrigger: {
                trigger: tab,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                    once: true
                },
                delay: i * 0.1
            });
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAP);
} else {
    initGSAP();
}
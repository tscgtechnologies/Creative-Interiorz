/**
 * JavaScript for Creative Interiorz
 * Premium Interior Design Studio - Hyderabad
 * Vanilla JS (No External Libraries)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CORE SELECTORS
       ========================================================================== */
    const navbar = document.querySelector('.navbar-wrapper');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const sections = document.querySelectorAll('section');
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const floatingItems = document.querySelectorAll('.floating-item');
    const heroSection = document.getElementById('home');
    const heroBg = document.querySelector('.hero-bg');

    /* ==========================================================================
       2. STICKY NAVBAR CONTROL
       ========================================================================== */
    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Run once on startup

    /* ==========================================================================
       3. ACTIVE SECTION HIGHLIGHTER ON SCROLL
       ========================================================================== */
    const highlightActiveNav = () => {
        let scrollPosition = window.scrollY + 120; // offset header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightActiveNav);

    /* ==========================================================================
       4. MOBILE SLIDE-IN MENU Drawer
       ========================================================================== */
    const toggleMobileMenu = () => {
        navMenu.classList.toggle('open');
    };

    const closeMobileMenu = () => {
        navMenu.classList.remove('open');
    };

    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking anywhere else outside of menu
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    /* ==========================================================================
       5. BACK TO TOP BUTTON
       ========================================================================== */
    const handleBackToTopVisibility = () => {
        if (window.scrollY > 600) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleBackToTopVisibility);

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ==========================================================================
       6. INTERSECTION OBSERVER FOR SCROLL REVEALS
       ========================================================================== */
    if ('IntersectionObserver' in window) {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, revealOptions);

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers: show elements immediately
        revealElements.forEach(element => {
            element.classList.add('reveal-active');
        });
    }

    /* ==========================================================================
       7. HIGH-PERFORMANCE MOUSE PARALLAX ENGINE (ANTI-GRAVITY HERO EFFECTS)
       ========================================================================== */
    // Check user preferences for animations and accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isMobileDevice = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);

    // Only enable mouse-parallax if animations are acceptable and not on mobile/touch screens
    if (!prefersReducedMotion.matches && !isMobileDevice) {
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        // Capture cursor coordinate targets relative to central viewports
        window.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            targetMouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        });

        // Loop engine using requestAnimationFrame and linear interpolation (lerp)
        const updateParallax = () => {
            // Smooth lerp formula: current = current + (target - current) * factor
            mouseX += (targetMouseX - mouseX) * 0.08;
            mouseY += (targetMouseY - mouseY) * 0.08;

            // Apply translation offset to floating icons based on depth
            floatingItems.forEach(item => {
                const depth = parseFloat(item.getAttribute('data-depth')) || 0.1;
                // Add default offset + calculated parallax translation
                const translateX = mouseX * depth * 80;
                const translateY = mouseY * depth * 80;
                
                // Keep the base CSS keyframe animation intact while offsetting with transform
                // Combining translate3d with scale and minor rotation
                item.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            });

            // Parallax shift the hero background image slightly for immersive luxury depth
            if (heroBg) {
                const bgTranslateX = -mouseX * 15;
                const bgTranslateY = -mouseY * 15;
                heroBg.style.transform = `translate3d(${bgTranslateX}px, ${bgTranslateY}px, 0) scale(1.05)`;
            }

            requestAnimationFrame(updateParallax);
        };

        // Start animation frame loop
        requestAnimationFrame(updateParallax);
    }
});

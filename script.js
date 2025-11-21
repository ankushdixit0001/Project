/**
 * Main script for the Disha Bharti College website.
 * Handles scrolling navigation (ScrollSpy), animations, form submissions, and theme syncing.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // --- SCROLL SPY & NAVIGATION LOGIC ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active-link');
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                if (!mobileMenu.classList.contains('hidden')) {
                    toggleMobileMenu();
                }
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('hidden');
    }
    mobileMenuButton.addEventListener('click', toggleMobileMenu);

    // --- Form Handling ---
    const infoForm = document.getElementById('info-form');
    if (infoForm) {
        infoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const feedback = document.getElementById('form-feedback');
            feedback.innerHTML = '<p class="text-green-600 font-semibold">Thank you! Your inquiry has been submitted successfully.</p>';
            infoForm.reset();
            setTimeout(() => { feedback.innerHTML = ''; }, 5000);
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const feedback = document.getElementById('contact-feedback');
            feedback.innerHTML = '<p class="text-green-600 font-semibold">Thank you for your message. We will get back to you shortly.</p>';
            contactForm.reset();
            setTimeout(() => { feedback.innerHTML = ''; }, 5000);
        });
    }

    // ==========================================
    // CAROUSEL 1: GLIMPSES (Original Images)
    // ==========================================
    const glimpseSlides = document.querySelectorAll('.carousel-slide');
    const glimpseDotsContainer = document.querySelector('.carousel-dots');
    let currentGlimpseSlide = 0;

    if (glimpseSlides.length > 0) {
        // Create Dots
        glimpseSlides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToGlimpseSlide(i));
            glimpseDotsContainer.appendChild(dot);
        });

        const glimpseDots = document.querySelectorAll('.carousel-dot');

        function goToGlimpseSlide(n) {
            glimpseSlides[currentGlimpseSlide].classList.remove('active');
            glimpseDots[currentGlimpseSlide].classList.remove('active');
            currentGlimpseSlide = (n + glimpseSlides.length) % glimpseSlides.length;
            glimpseSlides[currentGlimpseSlide].classList.add('active');
            glimpseDots[currentGlimpseSlide].classList.add('active');
        }
        setInterval(() => goToGlimpseSlide(currentGlimpseSlide + 1), 4000); // 4 seconds
    }

    // ==========================================
    // CAROUSEL 2: TESTIMONIALS (New Student Reviews)
    // ==========================================
    const testSlides = document.querySelectorAll('.testimonial-slide');
    const testDotsContainer = document.querySelector('.testimonial-dots');
    let currentTestSlide = 0;

    if (testSlides.length > 0) {
        // Create Dots for Testimonials
        testSlides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToTestSlide(i));
            testDotsContainer.appendChild(dot);
        });

        const testDots = document.querySelectorAll('.testimonial-dot');

        function goToTestSlide(n) {
            testSlides[currentTestSlide].classList.remove('active');
            testDots[currentTestSlide].classList.remove('active');
            currentTestSlide = (n + testSlides.length) % testSlides.length;
            testSlides[currentTestSlide].classList.add('active');
            testDots[currentTestSlide].classList.add('active');
        }

        // Slower rotation for reading text (6 seconds)
        setInterval(() => goToTestSlide(currentTestSlide + 1), 6000);
    }

    // --- Scroll Animations & Back to Top ---
    const header = document.getElementById('main-header');
    const backToTopButton = document.getElementById('back-to-top');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => scrollObserver.observe(el));

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const icon = button.querySelector('i');
            answer.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });

    // --- Lazy Loading ---
    const lazyImages = document.querySelectorAll('img.lazy');
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.remove('lazy');
                lazyImageObserver.unobserve(lazyImage);
            }
        });
    });
    lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage));

    // --- System Theme Sync ---
    function updateTheme(isDarkMode) {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    updateTheme(darkModeMediaQuery.matches);
    darkModeMediaQuery.addEventListener('change', (e) => {
        updateTheme(e.matches);
    });
});
/**
 * Main script for the Disha Bharti College website.
 * Handles single-page navigation, animations, form submissions, and theme syncing.
 * This script should be loaded at the end of the <body> tag.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500); // Matches the transition duration in the CSS.
    });

    // --- Single-Page Application (SPA) Navigation Logic ---
    const pages = document.querySelectorAll('.page');
    
    /**
     * Manages page visibility for the SPA functionality.
     * Hides all pages and then displays the one with the specified ID.
     * Also updates the active state of the navigation links.
     * @param {string} pageId The ID of the page section to display (e.g., 'about', 'contact').
     */
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.add('hidden');
        });
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.remove('hidden');
        }
        
        const targetHref = `#${pageId}`;
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active-link', link.getAttribute('href') === targetHref);
        });
        
        window.scrollTo(0, 0);
    }
    
    /**
     * Event handler for clicks on any link that starts with '#'.
     * Prevents the default anchor jump and uses the showPage function instead.
     * @param {Event} e The click event object.
     */
    function handleNavClick(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const pageId = href.substring(1);
            showPage(pageId);
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if(anchor.id !== 'back-to-top') {
            anchor.addEventListener('click', handleNavClick);
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('hidden');
    }
    mobileMenuButton.addEventListener('click', toggleMobileMenu);

    // --- Form Submission Handling (Mock) ---
    const infoForm = document.getElementById('info-form');
    if(infoForm) {
        infoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const feedback = document.getElementById('form-feedback');
            feedback.innerHTML = '<p class="text-green-600 font-semibold">Thank you! Your inquiry has been submitted successfully.</p>';
            infoForm.reset();
            setTimeout(() => { feedback.innerHTML = ''; }, 5000);
        });
    }
    
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const feedback = document.getElementById('contact-feedback');
            feedback.innerHTML = '<p class="text-green-600 font-semibold">Thank you for your message. We will get back to you shortly.</p>';
            contactForm.reset();
            setTimeout(() => { feedback.innerHTML = ''; }, 5000);
        });
    }

    // --- Image Carousel Logic ---
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (slides.length > 0) {
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.carousel-dot');

        function goToSlide(n) {
            if (!slides[currentSlide] || !dots[currentSlide]) return;
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        setInterval(() => goToSlide(currentSlide + 1), 5000);
    }

    // --- Scroll-based Animations & Back to Top Button ---
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

    window.onscroll = function() {
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
    };
    
    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const icon = button.querySelector('i');
            answer.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });

    // --- Lazy Loading for Gallery Images ---
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
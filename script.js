/**
 * Main script for the Disha Bharti College website.
 * Handles single-page navigation, animations, form submissions, and theme syncing.
 * This script should be loaded at the end of the <body> tag.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    // Hide the preloader with a fade-out effect once the page content is fully loaded.
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        // Use setTimeout to ensure the preloader is hidden after the transition.
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
        // Hide all page sections.
        pages.forEach(page => {
            page.classList.add('hidden');
        });
        // Show the target page.
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.remove('hidden');
        }
        
        // Update the active link style in the main navigation.
        const targetHref = `#${pageId}`;
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active-link', link.getAttribute('href') === targetHref);
        });
        
        // Scroll to the top of the page for a clean transition.
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
            e.preventDefault(); // Stop the browser's default jump.
            const pageId = href.substring(1);
            showPage(pageId);
            // If the mobile menu is open, close it after navigation.
            if (mobileMenu.offsetParent !== null) {
                toggleMobileMenu();
            }
        }
    }

    // Attach the click handler to all internal navigation links.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Exclude the 'back-to-top' button from this SPA logic.
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
    // This provides user feedback without a real backend.
    const infoForm = document.getElementById('info-form');
    if(infoForm) {
        infoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const feedback = document.getElementById('form-feedback');
            feedback.innerHTML = '<p class="text-green-600 font-semibold">Thank you! Your inquiry has been submitted successfully.</p>';
            infoForm.reset();
            setTimeout(() => { feedback.innerHTML = ''; }, 5000); // Message disappears after 5s.
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
        // Dynamically create navigation dots based on the number of slides.
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
            currentSlide = (n + slides.length) % slides.length; // Loop through slides.
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        // Auto-play the carousel.
        setInterval(() => goToSlide(currentSlide + 1), 5000);
    }

    // --- Scroll-based Animations & Back to Top Button ---
    const header = document.getElementById('main-header');
    const backToTopButton = document.getElementById('back-to-top');
    
    // Use Intersection Observer for efficient scroll animations.
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element is in the viewport, add the 'visible' class to trigger the animation.
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible.

    document.querySelectorAll('.fade-in-up').forEach(el => scrollObserver.observe(el));

    // Handle header style and back-to-top button visibility on scroll.
    window.onscroll = function() {
        // Style the header when scrolling down.
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Show/hide the back-to-top button.
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
                lazyImage.src = lazyImage.dataset.src; // Load the actual image.
                lazyImage.classList.remove('lazy');
                lazyImageObserver.unobserve(lazyImage); // Stop observing once loaded.
            }
        });
    });

    lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage));

    // --- System Theme Sync ---
    /**
     * Toggles the 'dark' class on the root <html> element based on system preference.
     * @param {boolean} isDarkMode - True if the system is in dark mode.
     */
    function updateTheme(isDarkMode) {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }

    // Check the system's preferred color scheme.
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Set the initial theme on page load.
    updateTheme(darkModeMediaQuery.matches);

    // Listen for changes in the system theme (e.g., user changes it in OS settings).
    darkModeMediaQuery.addEventListener('change', (e) => {
        updateTheme(e.matches);
    });
});

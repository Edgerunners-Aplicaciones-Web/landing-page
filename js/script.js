/**
 * @fileoverview Main script for the Smart Stay landing page.
 * Handles view switching, carousels, and language internationalization.
 */

// =================================================================
// --- GLOBAL FUNCTIONS ---
// Accessible from inline HTML event handlers (e.g., onclick).
// =================================================================

/**
 * Hides all main page views and shows the one with the specified ID.
 * @param {string} viewId The ID of the page section to show.
 * @param {string|null} elementId Optional. A CSS selector for an element to scroll to within the view.
 */
function showView(viewId, elementId = null) {
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.add('hidden');
    });

    const viewToShow = document.getElementById(viewId);
    if (viewToShow) {
        viewToShow.classList.remove('hidden');
        if (elementId) {
            document.querySelector(elementId).scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo(0, 0);
        }
    } else {
        console.error(`View with ID "${viewId}" not found.`);
    }
}

/**
 * Scrolls a horizontal carousel element left or right.
 * @param {string} carouselId The ID of the carousel track element.
 * @param {'left'|'right'} direction The direction to scroll.
 */
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (carousel) {
        const card = carousel.querySelector('.doc-card, .blog-card');
        if (!card) return;

        // Calculate scroll amount based on card width + gap
        const scrollAmount = card.offsetWidth + 24;
        const newScrollLeft = direction === 'left'
            ? carousel.scrollLeft - scrollAmount
            : carousel.scrollLeft + scrollAmount;

        carousel.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    }
}


// =================================================================
// --- PAGE INITIALIZATION LOGIC ---
// Runs after the entire HTML document has been loaded.
// =================================================================

document.addEventListener('DOMContentLoaded', async function () {

    /**
     * Fetches translation files (en.json, es.json) from the server.
     * @returns {Promise<Object|null>} A promise that resolves to the translations object or null on failure.
     */
    async function loadTranslations() {
        try {
            const [responseEN, responseES] = await Promise.all([
                fetch('./language/en.json'),
                fetch('./language/es.json')
            ]);
            if (!responseEN.ok || !responseES.ok) throw new Error('Failed to load JSON files');

            const translationsEN = await responseEN.json();
            const translationsES = await responseES.json();

            return { en: translationsEN, es: translationsES };
        } catch (error) {
            console.error("Critical error loading translation files:", error);
            return null;
        }
    }

    /**
     * Initializes all functionality for the language switcher component.
     */
    async function initLanguageSwitcher() {
        try {
            const translations = await loadTranslations();
            if (!translations) {
                console.error("Could not load translations. Language switcher will be disabled.");
                return;
            }

            const langToggleButton = document.getElementById('lang-toggle-btn');
            const langDropdown = document.getElementById('lang-dropdown');
            const enButton = document.getElementById('lang-en-btn');
            const esButton = document.getElementById('lang-es-btn');

            if (!langToggleButton || !langDropdown || !enButton || !esButton) {
                console.error('Missing HTML elements for the language switcher.');
                return;
            }

            const setLanguage = (lang) => {
                localStorage.setItem('language', lang);
                document.documentElement.lang = lang;

                document.querySelectorAll('[data-key]').forEach(element => {
                    const key = element.getAttribute('data-key');
                    if (translations[lang] && translations[lang][key]) {
                        element.innerHTML = translations[lang][key];
                    }
                });

                // Re-render Lucide icons after updating the DOM.
                if (window.lucide) {
                    window.lucide.createIcons();
                }

                const currentLangDisplay = document.getElementById('current-lang-display');
                if (currentLangDisplay) {
                    currentLangDisplay.textContent = lang.toUpperCase();
                }
                langDropdown.classList.add('hidden');
            };

            langToggleButton.addEventListener('click', (event) => {
                event.stopPropagation();
                langDropdown.classList.toggle('hidden');
            });

            enButton.addEventListener('click', (e) => { e.preventDefault(); setLanguage('en'); });
            esButton.addEventListener('click', (e) => { e.preventDefault(); setLanguage('es'); });

            // Add listener to close dropdown when clicking outside
            document.addEventListener('click', (event) => {
                if (!langDropdown.classList.contains('hidden') && !langToggleButton.contains(event.target)) {
                    langDropdown.classList.add('hidden');
                }
            });

            // Set the initial language on page load
            const initialLang = localStorage.getItem('language') || 'en';
            setLanguage(initialLang);
        } catch (error) {
            console.error('Fatal error initializing language switcher:', error);
        }
    }

    /**
     * Initializes all functionality for the testimonial carousel.
     */
    function initCarousel() {
        const slider = document.querySelector('.testimonial-slider');
        if (slider) {
            const wrapper = slider.querySelector('.testimonial-wrapper');
            const prevBtn = slider.parentElement.querySelector('.prev-btn');
            const nextBtn = slider.parentElement.querySelector('.next-btn');
            const dotsContainer = slider.parentElement.querySelector('.testimonial-dots');

            if (!wrapper || !prevBtn || !nextBtn || !dotsContainer) return;

            const testimonials = slider.querySelectorAll('.testimonial');
            if (testimonials.length <= 1) return;

            let currentIndex = 0;
            const totalSlides = testimonials.length;
            dotsContainer.innerHTML = ''; // Clear any existing dots

            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.dataset.index = i;
                dotsContainer.appendChild(dot);
            }
            const dots = dotsContainer.querySelectorAll('.dot');

            const updateCarousel = () => {
                wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach(d => d.classList.remove('active'));
                dots[currentIndex].classList.add('active');
            };

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateCarousel();
            });
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateCarousel();
            });
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    currentIndex = parseInt(dot.dataset.index);
                    updateCarousel();
                });
            });
        }
    }

    // --- APPLICATION BOOTSTRAP ---
    // Initializes all modules in the correct order.

    // 1. Wait for the language to be set first.
    await initLanguageSwitcher();

    // 2. Then, initialize other components like carousels.
    initCarousel();

    // 3. Show the default view.
    showView('home-view');

    // 4. Finally, do a global icon render to catch any icons loaded dynamically.
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
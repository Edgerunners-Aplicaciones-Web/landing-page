// js/script.js (CORRECTED)

// Global variable to hold the currently loaded translations
let currentTranslations = {};

// Function to fetch and apply translations
async function switchLanguage(lang) {
    try {
        // FIX #1: Added the correct path to the language files
        const response = await fetch(`./language/${lang}.json`);

        if (!response.ok) {
            console.error(`Error: Could not load the translation file for '${lang}'. Check the path and filename.`);
            return;
        }
        currentTranslations = await response.json();

        document.documentElement.lang = lang;
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (currentTranslations[key]) {
                // FIX #2: Improved check to render HTML tags like <br> correctly
                if (currentTranslations[key].includes('<br>') || currentTranslations[key].includes('<i>')) {
                    element.innerHTML = currentTranslations[key];
                } else {
                    element.textContent = currentTranslations[key];
                }
            }
        });

        document.getElementById('current-lang').textContent = lang.toUpperCase();
        localStorage.setItem('preferredLanguage', lang);
        closeLangMenu();
    } catch (error) {
        console.error('Failed to switch language:', error);
    }
}

// --- VIEW MANAGEMENT & ACTIVE LINK LOGIC ---
function showView(viewId, anchor) {
    // Hide all page views
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.add('hidden');
    });

    // Show the requested view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    // Scroll to anchor if provided, otherwise scroll to top
    if (anchor) {
        document.querySelector(anchor).scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update the active state on navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        // Check if the link's onclick function contains the current viewId
        if (link.getAttribute('onclick')?.includes(`'${viewId}'`)) {
            link.classList.add('active');
        }
    });
}


// --- LANGUAGE MENU ---
function toggleLangMenu(event) {
    event.stopPropagation();
    const switcher = event.currentTarget.closest('.lang-switcher');
    switcher.classList.toggle('active');
}

function closeLangMenu() {
    document.querySelectorAll('.lang-switcher.active').forEach(sw => sw.classList.remove('active'));
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Set the default language from localStorage or default to Spanish ('es')
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'es';
    switchLanguage(preferredLanguage);

    // Set initial view and active link
    showView('home-view');

    // Close language dropdown when clicking outside
    document.addEventListener('click', closeLangMenu);
});


/* ===== CAROUSEL SCROLL FUNCTION ===== */
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (carousel) {
        const card = carousel.querySelector('.doc-card, .blog-card');
        if (card) {
            const cardWidth = card.offsetWidth;
            const gap = parseFloat(getComputedStyle(carousel).gap);
            const scrollAmount = cardWidth + gap;

            if (direction === 'left') {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    }
}
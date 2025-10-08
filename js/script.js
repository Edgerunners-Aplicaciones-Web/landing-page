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
        console.error('La vista con el ID "' + viewId + '" no fue encontrada.');
    }
}

function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (carousel) {
        const scrollAmount = carousel.querySelector('.doc-card, .blog-card').offsetWidth + 24; // Ancho de la tarjeta + gap
        const newScrollLeft = direction === 'left'
            ? carousel.scrollLeft - scrollAmount
            : carousel.scrollLeft + scrollAmount;

        carousel.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    }
}


document.addEventListener('DOMContentLoaded', function () {
// --- Mobile Menu ---
    /*
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuBtn.addEventListener('click', function () {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
    */

    // --- Language Switcher ---

    async function initLanguageSwitcher() {
        const langToggleButton = document.getElementById('lang-toggle-btn');
        const langDropdown = document.getElementById('lang-dropdown');
        const currentLangDisplay = document.getElementById('current-lang-display');
        const enButton = document.getElementById('lang-en-btn');
        const esButton = document.getElementById('lang-es-btn');

        if (!langToggleButton || !langDropdown) {
            return;
        }


        async function loadTranslations() {
            try {
                const responseEN = await fetch('./language/en.json');
                const responseES = await fetch('./language/es.json');

                if (!responseEN.ok || !responseES.ok) {
                    throw new Error('Network response was not ok');
                }

                const translationsEN = await responseEN.json();
                const translationsES = await responseES.json();

                return { en: translationsEN, es: translationsES };
            } catch (error) {
                console.error("No se pudieron cargar los archivos de traducción:", error);
                return null;
            }
        }

        const translations = await loadTranslations();
        if (!translations) return;

        let currentLang = localStorage.getItem('language') || 'en';

        const setLanguage = (lang) => {
            currentLang = lang;
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang;

            document.querySelectorAll('[data-key]').forEach(element => {
                const key = element.getAttribute('data-key');
                if (translations[lang] && translations[lang][key]) {
                    const value = translations[lang][key];
                    // Usamos innerHTML en lugar de textContent por si hay etiquetas como <br>
                    element.innerHTML = value;
                }
            });

            currentLangDisplay.textContent = lang.toUpperCase();
            langDropdown.classList.add('hidden'); // Oculta el menú al seleccionar
        };


        langToggleButton.addEventListener('click', (event) => {
            event.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });

        enButton.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage('en');
        });

        esButton.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage('es');
        });


        document.addEventListener('click', (event) => {
            if (!langDropdown.classList.contains('hidden') && !langToggleButton.contains(event.target)) {
                langDropdown.classList.add('hidden');
            }
        });

        setLanguage(currentLang);
    }

    initLanguageSwitcher();

    // --- Testimonial Carousel ---
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const wrapper = slider.querySelector('.testimonial-wrapper');
        const testimonials = slider.querySelectorAll('.testimonial');
        const prevBtn = slider.parentElement.querySelector('.prev-btn');
        const nextBtn = slider.parentElement.querySelector('.next-btn');
        const dotsContainer = slider.parentElement.querySelector('.testimonial-dots');

        if (testimonials.length > 1) {
            let currentIndex = 0;
            const totalSlides = testimonials.length;

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
                dots.forEach(dot => dot.classList.remove('active'));
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


    function showView(viewId, elementId = null) {
        document.querySelectorAll('.page-view').forEach(view => {
            view.style.display = 'none';
        });

        const viewToShow = document.getElementById(viewId);
        if (viewToShow) {
            viewToShow.style.display = 'block';
            // Si se pasó un ID de elemento, hace scroll hacia él
            if (elementId) {
                document.querySelector(elementId).scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo(0, 0);
            }
        } else {
            console.error('La vista con el ID "' + viewId + '" no fue encontrada.');
        }
    }

    window.showView = showView;
});


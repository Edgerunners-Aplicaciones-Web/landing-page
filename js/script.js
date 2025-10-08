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
        const scrollAmount = carousel.querySelector('.doc-card, .blog-card').offsetWidth + 24;
        const newScrollLeft = direction === 'left'
            ? carousel.scrollLeft - scrollAmount
            : carousel.scrollLeft + scrollAmount;

        carousel.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    }
}

// FUNCIÓN CORREGIDA PARA EL LANGUAGE SWITCHER
async function initLanguageSwitcher() {
    try {
        const langToggleButton = document.getElementById('lang-toggle-btn');
        const langDropdown = document.getElementById('lang-dropdown');
        const currentLangDisplay = document.getElementById('current-lang-display');
        const enButton = document.getElementById('lang-en-btn');
        const esButton = document.getElementById('lang-es-btn');

        // Verificar que los elementos existen
        if (!langToggleButton || !langDropdown || !currentLangDisplay || !enButton || !esButton) {
            console.warn('Language switcher elements not found');
            return;
        }

        // Función para cargar traducciones
        async function loadTranslations() {
            try {
                const [responseEN, responseES] = await Promise.all([
                    fetch('./language/en.json'),
                    fetch('./language/es.json')
                ]);

                if (!responseEN.ok || !responseES.ok) {
                    throw new Error('Network response was not ok');
                }

                const [translationsEN, translationsES] = await Promise.all([
                    responseEN.json(),
                    responseES.json()
                ]);

                return { en: translationsEN, es: translationsES };
            } catch (error) {
                console.error("No se pudieron cargar los archivos de traducción:", error);
                return null;
            }
        }

        const translations = await loadTranslations();
        if (!translations) {
            console.warn('Translations could not be loaded');
            return;
        }

        let currentLang = localStorage.getItem('language') || 'en';

        // Función para cambiar idioma
        const setLanguage = (lang) => {
            currentLang = lang;
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang;

            // Actualizar elementos con data-key
            document.querySelectorAll('[data-key]').forEach(element => {
                const key = element.getAttribute('data-key');
                if (translations[lang] && translations[lang][key]) {
                    const value = translations[lang][key];
                    element.innerHTML = value;
                }
            });

            // Re-renderizar iconos de Lucide
            if (typeof lucide !== 'undefined') {
                lucide.replace();
            }

            // Actualizar display del idioma actual
            currentLangDisplay.textContent = lang.toUpperCase();
            langDropdown.classList.add('hidden');
        };

        // Event listeners
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

        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', (event) => {
            if (!langDropdown.classList.contains('hidden') &&
                !langToggleButton.contains(event.target) &&
                !langDropdown.contains(event.target)) {
                langDropdown.classList.add('hidden');
            }
        });

        // Establecer idioma inicial
        setLanguage(currentLang);

    } catch (error) {
        console.error('Error initializing language switcher:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar language switcher
    initLanguageSwitcher().catch(error => {
        console.error('Failed to initialize language switcher:', error);
    });

    // --- Testimonial Carousel ---
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const wrapper = slider.querySelector('.testimonial-wrapper');
        const testimonials = slider.querySelectorAll('.testimonial');
        const prevBtn = slider.parentElement.querySelector('.prev-btn');
        const nextBtn = slider.parentElement.querySelector('.next-btn');
        const dotsContainer = slider.parentElement.querySelector('.testimonial-dots');

        if (testimonials.length > 1 && wrapper && prevBtn && nextBtn && dotsContainer) {
            let currentIndex = 0;
            const totalSlides = testimonials.length;

            // Crear dots
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

    // Hacer la función showView global
    window.showView = showView;
});

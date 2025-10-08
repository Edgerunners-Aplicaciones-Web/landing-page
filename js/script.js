// Función global para mostrar vistas
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

// Variables globales para el language switcher
let translations = {};
let currentLang = 'en';

// Función para cargar traducciones
async function loadTranslations() {
    try {
        console.log('Cargando traducciones...');
        const [responseEN, responseES] = await Promise.all([
            fetch('./language/en.json'),
            fetch('./language/es.json')
        ]);

        if (!responseEN.ok) {
            console.warn('No se pudo cargar en.json');
        }
        if (!responseES.ok) {
            console.warn('No se pudo cargar es.json');
        }

        const translationsEN = responseEN.ok ? await responseEN.json() : {};
        const translationsES = responseES.ok ? await responseES.json() : {};

        translations = { en: translationsEN, es: translationsES };
        console.log('Traducciones cargadas:', translations);
        return true;
    } catch (error) {
        console.error("Error al cargar archivos de traducción:", error);
        // Usar traducciones por defecto si no se pueden cargar
        translations = {
            en: { "nav.home": "Home", "nav.about": "About", "nav.contact": "Contact" },
            es: { "nav.home": "Inicio", "nav.about": "Acerca de", "nav.contact": "Contacto" }
        };
        return false;
    }
}

// Función para aplicar traducciones
function applyTranslations(lang) {
    console.log('Aplicando traducciones para idioma:', lang);

    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            const value = translations[lang][key];
            element.innerHTML = value; // Usar innerHTML para tags como <br>
            console.log(`Traducido: ${key} -> ${value}`);
        } else {
            console.warn(`Traducción no encontrada para: ${key} en idioma ${lang}`);
        }
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }

// Función para cambiar idioma
    function changeLanguage(lang) {
        console.log('Cambiando idioma a:', lang);
        currentLang = lang;

        // Guardar en localStorage
        localStorage.setItem('language', lang);

        // Cambiar atributo del documento
        document.documentElement.lang = lang;

        // Aplicar traducciones
        applyTranslations(lang);

        // Actualizar display del idioma actual
        const currentLangDisplay = document.getElementById('current-lang-display');
        if (currentLangDisplay) {
            currentLangDisplay.textContent = lang.toUpperCase();
        }

        // Cerrar dropdown
        const langDropdown = document.getElementById('lang-dropdown');
        if (langDropdown) {
            langDropdown.classList.add('hidden');
        }
    }

// Inicializar language switcher
    async function initLanguageSwitcher() {
        console.log('Inicializando language switcher...');

        try {
            // Cargar traducciones
            await loadTranslations();

            // Obtener elementos
            const langToggleButton = document.getElementById('lang-toggle-btn');
            const langDropdown = document.getElementById('lang-dropdown');
            const currentLangDisplay = document.getElementById('current-lang-display');
            const enButton = document.getElementById('lang-en-btn');
            const esButton = document.getElementById('lang-es-btn');

            console.log('Elementos encontrados:', {
                langToggleButton: !!langToggleButton,
                langDropdown: !!langDropdown,
                currentLangDisplay: !!currentLangDisplay,
                enButton: !!enButton,
                esButton: !!esButton
            });

            // Verificar que los elementos existen
            if (!langToggleButton || !langDropdown || !currentLangDisplay || !enButton || !esButton) {
                console.error('Faltan elementos del language switcher');
                return;
            }

            // Obtener idioma inicial
            currentLang = localStorage.getItem('language') || 'en';
            console.log('Idioma inicial:', currentLang);

            // Event listener para el botón principal
            langToggleButton.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                console.log('Click en botón de idioma');

                langDropdown.classList.toggle('hidden');
                console.log('Dropdown visible:', !langDropdown.classList.contains('hidden'));
            });

            // Event listener para botón inglés
            enButton.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click en botón inglés');
                changeLanguage('en');
            });

            // Event listener para botón español
            esButton.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click en botón español');
                changeLanguage('es');
            });

            // Cerrar dropdown al hacer click fuera
            document.addEventListener('click', function (event) {
                if (!langDropdown.classList.contains('hidden')) {
                    if (!langToggleButton.contains(event.target) && !langDropdown.contains(event.target)) {
                        langDropdown.classList.add('hidden');
                        console.log('Dropdown cerrado por click fuera');
                    }
                }
            });

            // Aplicar idioma inicial
            changeLanguage(currentLang);

            console.log('Language switcher inicializado correctamente');

        } catch (error) {
            console.error('Error al inicializar language switcher:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
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
        window.changeLanguage = changeLanguage;

        console.log('Inicialización completa');
    });
}

// =================================================================
// --- LÓGICA DE INICIALIZACIÓN ---
// Este código se ejecuta solo cuando el HTML está completamente cargado.
// =================================================================

document.addEventListener('DOMContentLoaded', async function () { // <-- AÑADIMOS ASYNC AQUÍ

    // --- Language Switcher (Función Principal) ---
    async function initLanguageSwitcher() {
        try {
            const translations = await loadTranslations();
            if (!translations) {
                console.error("No se pudieron cargar las traducciones. El switcher no funcionará.");
                return;
            }

            const langToggleButton = document.getElementById('lang-toggle-btn');
            const langDropdown = document.getElementById('lang-dropdown');
            const enButton = document.getElementById('lang-en-btn');
            const esButton = document.getElementById('lang-es-btn');

            if (!langToggleButton || !langDropdown || !enButton || !esButton) {
                console.error('Faltan elementos HTML para el language switcher.');
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

            document.addEventListener('click', (event) => {
                if (!langDropdown.classList.contains('hidden') && !langToggleButton.contains(event.target)) {
                    langDropdown.classList.add('hidden');
                }
            });

            const initialLang = localStorage.getItem('language') || 'en';
            setLanguage(initialLang);
            console.log('Language switcher inicializado correctamente.');
        } catch (error) {
            console.error('Error fatal al inicializar language switcher:', error);
        }
    }

    async function loadTranslations() {
        try {
            const [responseEN, responseES] = await Promise.all([
                fetch('./language/en.json'),
                fetch('./language/es.json')
            ]);
            if (!responseEN.ok || !responseES.ok) throw new Error('Fallo al cargar archivos JSON');

            const translationsEN = await responseEN.json();
            const translationsES = await responseES.json();

            return { en: translationsEN, es: translationsES };
        } catch (error) {
            console.error("Error crítico al cargar archivos de traducción:", error);
            return null;
        }
    }

    // --- Testimonial Carousel ---
    function initCarousel() {
        const slider = document.querySelector('.testimonial-slider');
        if (slider) {
            // ... (El código del carrusel que ya tienes, no cambia)
            const wrapper = slider.querySelector('.testimonial-wrapper');
            const testimonials = slider.querySelectorAll('.testimonial');
            const prevBtn = slider.parentElement.querySelector('.prev-btn');
            const nextBtn = slider.parentElement.querySelector('.next-btn');
            const dotsContainer = slider.parentElement.querySelector('.testimonial-dots');

            if (testimonials.length > 1) {
                let currentIndex = 0;
                const totalSlides = testimonials.length;
                dotsContainer.innerHTML = ''; // Limpiar dots por si acaso

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
    }

    // ===================================
    // --- ARRANQUE DE LA APLICACIÓN ---
    // ===================================

    // 1. ESPERAMOS a que el switcher de idioma se inicialice y aplique el idioma.
    await initLanguageSwitcher();

    // 2. LUEGO, inicializamos el carrusel.
    initCarousel();

    // 3. LUEGO, mostramos la vista de inicio.
    showView('home-view');

    // 4. (Opcional, ya se hace en setLanguage) Refrescamos los íconos una vez más por si acaso.
    if (window.lucide) {
        window.lucide.createIcons();
    }

    console.log('¡TODA la inicialización de la página ha sido completada en orden!');
});
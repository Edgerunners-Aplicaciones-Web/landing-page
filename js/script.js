document.addEventListener('DOMContentLoaded', function () {
    // --- Mobile Menu ---
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

    // --- Language Switcher ---
    if (typeof translationsEN === 'undefined' || typeof translationsES === 'undefined') {
        console.error("Translation files (en.js, es.js) are not loaded correctly.");
        return;
    }

    const translations = {
        en: translationsEN,
        es: translationsES
    };

    const languageSwitcher = document.getElementById('language-switcher');
    let currentLang = localStorage.getItem('language') || 'en'; // Default to English

    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('language', lang);

        document.documentElement.lang = lang;

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                const value = translations[lang][key];
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = value;
                } else {
                    element.textContent = value;
                }
            }
        });

        languageSwitcher.textContent = lang === 'en' ? 'ES' : 'EN';
    };

    languageSwitcher.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        setLanguage(newLang);
    });

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

    // Set initial language on page load
    setLanguage(currentLang);
});


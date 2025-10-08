// En tu script.js, reemplaza la función initLanguageSwitcher por esta:

async function initLanguageSwitcher() {
    // ... (el código de carga de traducciones y obtención de elementos no cambia)
    try {
        const translations = await loadTranslations();
        if (!translations) { return; }

        const langToggleButton = document.getElementById('lang-toggle-btn');
        const langDropdown = document.getElementById('lang-dropdown');
        const enButton = document.getElementById('lang-en-btn');
        const esButton = document.getElementById('lang-es-btn');

        if (!langToggleButton || !langDropdown || !enButton || !esButton) { return; }

        const setLanguage = (lang) => {
            // ... (esta función interna no cambia)
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
            // MODIFICACIÓN: En lugar de ocultar el dropdown, quitamos la clase 'active' del padre
            langToggleButton.parentElement.classList.remove('active');
        };

        // =======================================================
        // --- EL CAMBIO CLAVE ESTÁ AQUÍ ---
        // =======================================================

        // Event listener para el botón principal
        langToggleButton.addEventListener('click', (event) => {
            event.stopPropagation();
            // ANTES: langDropdown.classList.toggle('hidden');
            // AHORA: Le ponemos/quitamos la clase 'active' al DIV padre (.lang-switcher)
            langToggleButton.parentElement.classList.toggle('active');
        });

        // Event listeners para los botones de idioma
        enButton.addEventListener('click', (e) => { e.preventDefault(); setLanguage('en'); });
        esButton.addEventListener('click', (e) => { e.preventDefault(); setLanguage('es'); });

        // Cerrar dropdown al hacer click fuera (también necesita un ajuste)
        document.addEventListener('click', (event) => {
            const langSwitcher = langToggleButton.parentElement;
            // Si el padre tiene la clase 'active' y el click fue fuera...
            if (langSwitcher.classList.contains('active') && !langSwitcher.contains(event.target)) {
                langSwitcher.classList.remove('active');
            }
        });

        // Aplicar idioma inicial
        const initialLang = localStorage.getItem('language') || 'en';
        setLanguage(initialLang);
        console.log('Language switcher inicializado con la lógica de la clase "active".');

    } catch (error) {
        console.error('Error fatal al inicializar language switcher:', error);
    }
}
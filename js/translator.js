let translations = {};
let currentLang = "en";

async function loadTranslations() {
    const res = await fetch("./assets/lang/languages.json");
    translations = await res.json();
    applyTranslations();
}

function applyTranslations() {
    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.getAttribute("data-key");
        el.innerText = translations[currentLang][key] || key;
    });

    document.querySelectorAll("[data-key-placeholder]").forEach(el => {
        const key = el.getAttribute("data-key-placeholder");
        el.placeholder = translations[currentLang][key] || el.placeholder;
    });

    document.getElementById("current-lang-display").innerText =
        currentLang.toUpperCase();
}

function changeLanguage(lang) {
    currentLang = lang;
    applyTranslations();
}

document.getElementById("lang-en-btn").addEventListener("click", () => changeLanguage("en"));
document.getElementById("lang-es-btn").addEventListener("click", () => changeLanguage("es"));

window.addEventListener("DOMContentLoaded", loadTranslations);

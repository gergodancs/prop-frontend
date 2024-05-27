// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';

// The translations
const resources = {
    en: {
        translation: translationEN,
    },
    de: {
        translation: translationDE,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

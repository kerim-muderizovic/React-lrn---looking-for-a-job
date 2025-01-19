import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../public/locales/en/enTranslations.json'; // Adjust path as needed
import deTranslations from '../public/locales/de/deTranslations.json'; // Adjust path as needed

const resources = {
  en: {
    translation: enTranslations
  },
  de: {
    translation: deTranslations
  }
};
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;
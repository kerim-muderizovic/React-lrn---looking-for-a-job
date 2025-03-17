import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../public/locales/en/enTranslations.json'; // Adjust path as needed
import deTranslations from '../public/locales/de/deTranslations.json'; // Adjust path as needed

// For debugging
console.log('Loading translations:', {
  en: enTranslations,
  de: deTranslations
});

const resources = {
  en: {
    translation: enTranslations
  },
  de: {
    translation: deTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    debug: true, // Enable debug mode to see more information in console
    keySeparator: '.', // Ensure this is set to use dot notation for nested keys
    nsSeparator: ':', // Namespace separator
    returnEmptyString: false, // Don't return empty strings
    returnNull: false, // Don't return null
  });

export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fr from './fr.json';
import en from './en.json';
import ar from './ar.json';

const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('gamouze_lang') : null;
const initialLanguage = savedLanguage || 'fr';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  ar: { translation: ar },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Apply document direction and language attribute
export const applyDocumentDirection = (lang) => {
  if (typeof document === 'undefined') return;
  const isRtl = lang === 'ar';
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
};

// Initial apply
applyDocumentDirection(initialLanguage);

// On language change listener
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gamouze_lang', lng);
  }
  applyDocumentDirection(lng);
});

export default i18n;


import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language || 'fr';
  const isRtl = currentLanguage === 'ar';

  const changeLanguage = useCallback(
    (lang) => {
      i18n.changeLanguage(lang);
    },
    [i18n]
  );

  return {
    language: currentLanguage,
    isRtl,
    changeLanguage,
    t,
  };
};


import { siteConfig } from '../config/site';

/**
 * Format price according to active language and currency
 */
export const formatPrice = (amount, lang = 'fr') => {
  if (amount === undefined || amount === null) return '';
  const num = Number(amount);
  const formattedNumber = new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
    maximumFractionDigits: 0,
  }).format(num);

  const currencySymbol = siteConfig.currency[lang] || siteConfig.currency.fr;

  if (lang === 'ar') {
    return `${formattedNumber} ${currencySymbol}`;
  }
  return `${formattedNumber} ${currencySymbol}`;
};

/**
 * Format dates
 */
export const formatDate = (dateString, lang = 'fr') => {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
};


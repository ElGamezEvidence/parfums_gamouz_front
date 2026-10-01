import { contactConfig } from '../config/contact';

/**
 * Generate sanitized WhatsApp click-to-chat URL with encoded text
 */
export const createWhatsAppLink = (message) => {
  const base = contactConfig.whatsappUrl; // https://wa.me/212671545193
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
};

/**
 * Get general WhatsApp URL based on language
 */
export const getGeneralWhatsAppUrl = (lang = 'fr') => {
  const message = contactConfig.defaultMessages[lang] || contactConfig.defaultMessages.fr;
  return createWhatsAppLink(message);
};

/**
 * Get direct product order WhatsApp link
 */
export const getProductOrderWhatsAppUrl = (product, volume, quantity, price, lang = 'fr') => {
  const productName = product?.name?.[lang] || product?.name?.fr || 'Parfum GAMOUZE';
  const generator = contactConfig.productOrderMessage[lang] || contactConfig.productOrderMessage.fr;
  const message = generator(productName, quantity, volume, price);
  return createWhatsAppLink(message);
};

/**
 * Get order confirmation follow-up WhatsApp link
 */
export const getOrderFollowupWhatsAppUrl = (orderNumber, total, lang = 'fr') => {
  const generator = contactConfig.orderFollowupMessage[lang] || contactConfig.orderFollowupMessage.fr;
  const message = generator(orderNumber, total);
  return createWhatsAppLink(message);
};


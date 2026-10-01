export const contactConfig = {
  whatsapp: "+212671545193",
  whatsappUrl: "https://wa.me/212671545193",
  phoneDisplay: "+212 671-545193",
  email: "contact@gamouze.com",
  instagram: "https://instagram.com/gamouze",
  tiktok: "https://tiktok.com/@gamouze",
  facebook: "https://facebook.com/gamouze",
  address: "Boulevard d'Anfa, Casablanca, Maroc",
  businessHours: "Lun - Sam : 10h00 - 20h00",

  defaultMessages: {
    fr: "Bonjour GAMOUZE, je souhaite avoir plus d'informations sur vos parfums.",
    en: "Hello GAMOUZE, I would like to get more information about your perfumes.",
    ar: "مرحباً GAMOUZE، أود الحصول على مزيد من المعلومات حول عطوركم."
  },

  productOrderMessage: {
    fr: (name, qty, volume, price) => 
      `Bonjour GAMOUZE, je souhaite commander :\n- Produit : ${name}\n- Quantité : ${qty}\n- Volume : ${volume}\n- Prix : ${price} MAD`,
    en: (name, qty, volume, price) => 
      `Hello GAMOUZE, I would like to order:\n- Product: ${name}\n- Quantity: ${qty}\n- Volume: ${volume}\n- Price: ${price} MAD`,
    ar: (name, qty, volume, price) => 
      `مرحباً GAMOUZE، أود طلب:\n- العطر: ${name}\n- الكمية: ${qty}\n- الحجم: ${volume}\n- السعر: ${price} د.م.`
  },

  orderFollowupMessage: {
    fr: (orderNumber, total) => 
      `Bonjour GAMOUZE, voici ma commande N° ${orderNumber} d'un montant de ${total} MAD. Pourriez-vous me confirmer les détails de livraison ?`,
    en: (orderNumber, total) => 
      `Hello GAMOUZE, here is my order N° ${orderNumber} for an amount of ${total} MAD. Could you confirm delivery details?`,
    ar: (orderNumber, total) => 
      `مرحباً GAMOUZE، هذه تفاصيل طلبي رقم ${orderNumber} بمبلغ ${total} د.م. هل يمكن تأكيد تفاصيل التوصيل؟`
  }
};


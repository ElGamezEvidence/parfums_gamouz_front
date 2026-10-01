import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { formatPrice } from '../utils/formatters';
import { createWhatsAppLink } from '../utils/whatsapp';

export const Cart = () => {
  const { language, isRtl, t } = useLanguage();
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shipping,
    total,
    isFreeShipping,
    freeShippingRemaining,
  } = useCart();
  const navigate = useNavigate();

  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <EmptyState
          icon={ShoppingBag}
          title={t('cart.emptyTitle')}
          subtitle={t('cart.emptySubtitle')}
          actionText={t('cart.discoverShop')}
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  // WhatsApp order text builder for whole cart
  const generateCartWhatsAppMessage = () => {
    let msg =
      language === 'ar'
        ? `مرحباً GAMOUZE، أود تأكيد سلة مشترياتي:\n`
        : language === 'en'
        ? `Hello GAMOUZE, I would like to confirm my cart order:\n`
        : `Bonjour GAMOUZE, je souhaite valider mon panier :\n`;

    items.forEach((item, index) => {
      const name = item.product.name[language] || item.product.name.fr;
      msg += `\n${index + 1}. ${name} (${item.volume}) x${item.quantity} = ${item.price * item.quantity} MAD`;
    });

    msg += `\n\nTotal : ${total} MAD`;
    return createWhatsAppLink(msg);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="flex items-center justify-between pb-6 border-b border-brand-black/10 mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-black">
          {t('cart.title')}
        </h1>
        <button
          onClick={clearCart}
          className="text-xs uppercase tracking-luxury text-stone-400 hover:text-rose-500 transition-colors"
        >
          {t('cart.clearCart')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Items List (Left) */}
        <div className="lg:col-span-8 space-y-2">
          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-brand-gold/10 border border-brand-gold/30 mb-6">
            <div className="flex items-center justify-between text-xs font-medium text-brand-black mb-1.5">
              <span>
                {isFreeShipping
                  ? t('cart.freeShippingAchieved')
                  : t('cart.freeShippingRemaining', { amount: freeShippingRemaining })}
              </span>
              <span className="font-semibold text-brand-gold-dark">
                {isFreeShipping ? '100%' : `${Math.min(100, Math.round((subtotal / 500) * 100))}%`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-brand-cream-dark overflow-hidden">
              <div
                className="h-full bg-brand-gold transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / 500) * 100)}%` }}
              />
            </div>
          </div>

          {/* Table of items */}
          <div className="divide-y divide-brand-black/10">
            {items.map((item) => (
              <CartItem
                key={`${item.productId}_${item.volume}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="pt-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury font-medium text-brand-black hover:text-brand-gold transition-colors"
            >
              <DirectionalArrow className="w-3.5 h-3.5 rotate-180 rtl:rotate-0" />
              <span>{t('cart.continueShopping')}</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Box (Right) */}
        <div className="lg:col-span-4 bg-brand-cream-dark/50 border border-brand-black/10 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="font-serif text-xl text-brand-black pb-4 border-b border-brand-black/10">
            {t('checkout.summaryTitle')}
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-stone-600 font-light">
              <span>{t('cart.subtotal')}</span>
              <span className="font-medium text-brand-black">{formatPrice(subtotal, language)}</span>
            </div>

            <div className="flex items-center justify-between text-stone-600 font-light">
              <span>{t('cart.shipping')}</span>
              <span className={`font-medium ${isFreeShipping ? 'text-emerald-700' : 'text-brand-black'}`}>
                {isFreeShipping ? t('cart.freeShipping') : formatPrice(shipping, language)}
              </span>
            </div>

            <div className="pt-3 border-t border-brand-black/10 flex items-center justify-between text-base font-semibold text-brand-black">
              <span>{t('cart.total')}</span>
              <span>{formatPrice(total, language)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <Link to="/checkout" className="block">
              <Button variant="primary" size="lg" className="w-full">
                <span>{t('cart.checkout')}</span>
                <DirectionalArrow className="w-4 h-4 ms-2" />
              </Button>
            </Link>

            <a
              href={generateCartWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-luxury font-semibold transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('cart.orderViaWhatsApp')}</span>
            </a>
          </div>

          {/* Reassurance Badges */}
          <div className="pt-4 border-t border-brand-black/10 space-y-2 text-[11px] text-brand-muted">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Livraison express à domicile sous 24/48h</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Paiement sécurisé à la livraison</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


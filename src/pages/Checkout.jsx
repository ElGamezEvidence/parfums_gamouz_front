import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, Building, AlertCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatters';
import { Button } from '../components/common/Button';

export const Checkout = () => {
  const { language, t } = useLanguage();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Casablanca',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-brand-black">{t('cart.emptyTitle')}</h2>
        <Link to="/shop">
          <Button variant="primary">{t('cart.discoverShop')}</Button>
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      setErrorMessage(t('checkout.requiredError'));
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: formData,
        paymentMethod,
        items,
        subtotal,
        shipping,
        total,
      };

      const result = await orderService.createOrder(orderPayload);
      if (!result.success) {
        setErrorMessage(result.error || t('checkout.submitError'));
        return;
      }
      clearCart();
      navigate(`/order-success?orderId=${result.orderNumber || result.orderId}`);
    } catch (err) {
      console.error('Failed to submit order', err);
      setErrorMessage('Une erreur est survenue lors de la validation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-black">
          {t('checkout.title')}
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-2 font-light">
          {t('checkout.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Form Fields (Left) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Error banner */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Customer Details */}
            <div className="bg-brand-cream border border-brand-black/10 p-6 sm:p-8 space-y-4">
              <h2 className="font-serif text-lg text-brand-black pb-3 border-b border-brand-black/10">
                {t('checkout.contactInfo')}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-semibold tracking-wider text-brand-black mb-1.5">
                    {t('checkout.firstName')} *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-black/20 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-semibold tracking-wider text-brand-black mb-1.5">
                    {t('checkout.lastName')} *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-black/20 focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-semibold tracking-wider text-brand-black mb-1.5">
                    {t('checkout.phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="06 12 34 56 78"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-black/20 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-semibold tracking-wider text-brand-black mb-1.5">
                    {t('checkout.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@domaine.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-black/20 focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-semibold tracking-wider text-brand-black mb-1.5">
                  {t('checkout.address')} *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Numéro, rue, quartier, résidence..."
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-black/20 focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-semibold tracking-wider text-brand-black mb-1.5">
                    {t('checkout.city')} *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-black/20 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-semibold tracking-wider text-brand-black mb-1.5">
                    {t('checkout.postalCode')}
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="20000"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-black/20 focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-semibold tracking-wider text-brand-black mb-1.5">
                  {t('checkout.notes')}
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-black/20 focus:border-brand-gold focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-brand-cream border border-brand-black/10 p-6 sm:p-8 space-y-4">
              <h2 className="font-serif text-lg text-brand-black pb-3 border-b border-brand-black/10">
                {t('checkout.paymentMethod')}
              </h2>

              <div className="space-y-3">
                {/* 1. Cash on Delivery */}
                <label
                  className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-brand-gold bg-brand-gold/5 shadow-xs'
                      : 'border-brand-black/15 bg-white hover:border-brand-black/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-brand-gold"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-brand-gold" />
                      <span className="text-xs uppercase tracking-wider font-semibold text-brand-black">
                        {t('checkout.cod')}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted font-light mt-1">
                      {t('checkout.codDesc')}
                    </p>
                  </div>
                </label>

                {/* 2. Credit Card */}
                <label
                  className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-brand-gold bg-brand-gold/5 shadow-xs'
                      : 'border-brand-black/15 bg-white hover:border-brand-black/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 accent-brand-gold"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-brand-gold" />
                      <span className="text-xs uppercase tracking-wider font-semibold text-brand-black">
                        {t('checkout.card')}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted font-light mt-1">
                      {t('checkout.cardDesc')}
                    </p>
                  </div>
                </label>

                {/* 3. Bank Transfer */}
                <label
                  className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'transfer'
                      ? 'border-brand-gold bg-brand-gold/5 shadow-xs'
                      : 'border-brand-black/15 bg-white hover:border-brand-black/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                    className="mt-1 accent-brand-gold"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-brand-gold" />
                      <span className="text-xs uppercase tracking-wider font-semibold text-brand-black">
                        {t('checkout.transfer')}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted font-light mt-1">
                      {t('checkout.transferDesc')}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary & Confirm (Right) */}
          <div className="lg:col-span-5 bg-brand-cream-dark/50 border border-brand-black/10 p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-xl text-brand-black pb-4 border-b border-brand-black/10">
              {t('checkout.summaryTitle')}
            </h2>

            {/* Items mini list */}
            <div className="divide-y divide-brand-black/10 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.productId}_${item.volume}`} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="min-w-0 pe-2">
                    <p className="font-medium text-brand-black truncate">
                      {item.product.name[language] || item.product.name.fr}
                    </p>
                    <p className="text-brand-muted font-light">
                      {item.volume} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-brand-black shrink-0">
                    {formatPrice(item.price * item.quantity, language)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 pt-3 border-t border-brand-black/10 text-xs">
              <div className="flex justify-between text-stone-600 font-light">
                <span>{t('cart.subtotal')}</span>
                <span className="font-medium text-brand-black">{formatPrice(subtotal, language)}</span>
              </div>
              <div className="flex justify-between text-stone-600 font-light">
                <span>{t('cart.shipping')}</span>
                <span className={`font-medium ${shipping === 0 ? 'text-emerald-700' : 'text-brand-black'}`}>
                  {shipping === 0 ? t('cart.freeShipping') : formatPrice(shipping, language)}
                </span>
              </div>
              <div className="pt-3 border-t border-brand-black/10 flex justify-between text-base font-semibold text-brand-black">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(total, language)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? t('checkout.processing') : t('checkout.confirmOrder')}
            </Button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-brand-muted font-light flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                Commande sécurisée & protégée
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};


import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../context/ToastContext';
import { contactConfig } from '../config/contact';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';
import { contactService } from '../services/contactService';
import { Button } from '../components/common/Button';

export const Contact = () => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSending, setIsSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await contactService.sendMessage(formData);
      addToast(t('contact.sentSuccess'), 'success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      addToast('Une erreur est survenue lors de l\'envoi du message.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const faqs = [
    {
      q: language === 'ar' ? 'ما هي مدة توصيل الطلبات في المغرب؟' : 'Quels sont les délais de livraison au Maroc ?',
      a: language === 'ar' ? 'يتم توصيل جميع الطلبات في غضون 24 إلى 48 ساعة في جميع مدن المملكة.' : 'Nos colis sont livrés partout au Maroc en 24 à 48 heures ouvrables.'
    },
    {
      q: language === 'ar' ? 'هل الدفع عند الاستلام متاح؟' : 'Le paiement à la livraison est-il disponible ?',
      a: language === 'ar' ? 'نعم، يمكنك الدفع نقداً عند استلام طلبك ومعاينته بكل راحة.' : 'Oui, vous pouvez régler en espèces directement auprès du livreur à la réception de votre colis.'
    },
    {
      q: language === 'ar' ? 'ما هي نسبة ثبات وتركيز العطور؟' : 'Quelle est la tenue et la concentration de vos parfums ?',
      a: language === 'ar' ? 'عطورنا مصاغة بنسب تركيز عالية كخلاصات نقية وعطور مكثفة تضمن ثباتاً يتجاوز 12 ساعة.' : 'Toutes nos fragrances sont des Extraits et Eaux de Parfum hautement concentrés pour une tenue garantie de plus de 12 heures.'
    },
    {
      q: language === 'ar' ? 'كيف يمكنني استشارة خبير عطور لمساعدتي في الاختيار؟' : 'Comment obtenir un conseil personnalisé pour choisir mon parfum ?',
      a: language === 'ar' ? 'يمكنك التواصل معنا مباشرة عبر واتساب للحصول على استشارة خاصة مجاناً.' : 'Notre conseiller privé est à votre disposition 7j/7 directement sur WhatsApp au +212 671-545193.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
      {/* Header Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold">
          {t('contact.badge')}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-black mt-2 tracking-tight">
          {t('contact.title')}
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-3 font-light">
          {t('contact.subtitle')}
        </p>
      </div>

      {/* Prominent VIP WhatsApp Banner */}
      <div className="bg-gradient-to-r from-brand-black via-brand-dark to-brand-charcoal text-brand-cream border border-brand-gold/40 p-8 sm:p-12 shadow-luxury-dark">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-[11px] uppercase tracking-luxury font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              Service Client WhatsApp Prioritaire
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-cream">
              {t('contact.vipTitle')}
            </h2>
            <p className="text-sm text-stone-300 font-light max-w-xl">
              {t('contact.vipSubtitle')}
            </p>
            <p className="text-brand-gold font-mono text-base font-semibold">
              {contactConfig.phoneDisplay}
            </p>
          </div>

          <a
            href={getGeneralWhatsAppUrl(language)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-luxury font-semibold transition-all duration-300 shadow-lg hover:shadow-xl shrink-0"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t('contact.vipButton')}</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Form + Address Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-brand-cream border border-brand-black/10 p-6 sm:p-10 shadow-sm">
          <h3 className="font-serif text-xl text-brand-black pb-4 border-b border-brand-black/10 mb-6">
            {t('contact.formTitle')}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase font-semibold tracking-wider text-brand-black mb-1.5">
                {t('contact.name')} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-xs bg-white border border-brand-black/20 focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-semibold tracking-wider text-brand-black mb-1.5">
                  {t('contact.email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-xs bg-white border border-brand-black/20 focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-semibold tracking-wider text-brand-black mb-1.5">
                  {t('contact.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                  className="w-full px-4 py-2.5 text-xs bg-white border border-brand-black/20 focus:border-brand-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-semibold tracking-wider text-brand-black mb-1.5">
                {t('contact.message')} *
              </label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-xs bg-white border border-brand-black/20 focus:border-brand-gold focus:outline-none resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSending}
              icon={Send}
              className="w-full sm:w-auto"
            >
              {isSending ? t('contact.sending') : t('contact.send')}
            </Button>
          </form>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-brand-cream-dark/50 border border-brand-black/10 p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-xl text-brand-black pb-3 border-b border-brand-black/10">
              Coordonnées
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 text-stone-700">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-black font-semibold uppercase tracking-wider text-[11px]">
                    {t('contact.addressTitle')}
                  </strong>
                  <p className="text-brand-muted font-light mt-0.5 leading-relaxed">
                    {contactConfig.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-stone-700">
                <Clock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-black font-semibold uppercase tracking-wider text-[11px]">
                    {t('contact.hoursTitle')}
                  </strong>
                  <p className="text-brand-muted font-light mt-0.5">
                    {contactConfig.businessHours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-stone-700">
                <Phone className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-black font-semibold uppercase tracking-wider text-[11px]">
                    Téléphone & WhatsApp
                  </strong>
                  <p className="text-brand-muted font-light mt-0.5">
                    {contactConfig.phoneDisplay}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-stone-700">
                <Mail className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-black font-semibold uppercase tracking-wider text-[11px]">
                    Email
                  </strong>
                  <p className="text-brand-muted font-light mt-0.5">
                    {contactConfig.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-brand-cream border border-brand-black/10 p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-lg text-brand-black pb-2 border-b border-brand-black/10">
              Questions Fréquentes
            </h3>
            <div className="divide-y divide-brand-black/10">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-3">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-brand-black text-start hover:text-brand-gold transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-brand-muted transition-transform ${
                        openFaq === idx ? 'rotate-180 text-brand-gold' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <p className="text-xs text-brand-muted font-light mt-2 leading-relaxed animate-fadeIn">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


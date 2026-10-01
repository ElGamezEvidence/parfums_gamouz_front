import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight, ArrowLeft, Instagram, Facebook } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../context/ToastContext';
import { contactConfig } from '../../config/contact';
import { siteConfig } from '../../config/site';
import { footerLinks } from '../../config/navigation';
import { getGeneralWhatsAppUrl } from '../../utils/whatsapp';
import { contactService } from '../../services/contactService';

export const Footer = () => {
  const { language, isRtl, t } = useLanguage();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast(t('newsletter.invalidEmail'), 'error');
      return;
    }
    setIsSubscribing(true);
    try {
      await contactService.subscribeNewsletter(email);
      addToast(t('newsletter.success'), 'success');
      setEmail('');
    } catch {
      addToast(t('newsletter.invalidEmail'), 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <footer className="bg-brand-black text-brand-cream border-t border-brand-charcoal pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Brand + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-brand-charcoal/80">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-semibold tracking-[0.25em] text-brand-cream hover:text-brand-gold transition-colors">
                GAMOUZE
              </span>
            </Link>
            <p className="font-serif italic text-sm text-brand-gold">
              « {t('brand.slogan')} »
            </p>
            <p className="text-xs text-stone-400 font-light max-w-md leading-relaxed">
              {t('footer.brandDesc')}
            </p>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2">
              <a
                href={getGeneralWhatsAppUrl(language)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-brand-charcoal hover:bg-[#25D366] hover:text-white text-brand-gold border border-brand-border text-xs uppercase tracking-luxury font-medium transition-all duration-300 group"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:text-white transition-colors" />
                <span>WhatsApp VIP : {contactConfig.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-7 bg-brand-dark border border-brand-charcoal p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-2 mb-4">
              <span className="text-[10px] uppercase tracking-luxury text-brand-gold font-semibold">
                {t('newsletter.badge')}
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-brand-cream">
                {t('newsletter.title')}
              </h3>
              <p className="text-xs text-stone-400 font-light">
                {t('newsletter.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                required
                className="flex-1 bg-brand-black border border-brand-charcoal px-4 py-3 text-xs text-brand-cream placeholder:text-stone-500 focus:outline-none focus:border-brand-gold transition-colors"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-3 bg-brand-gold text-brand-black hover:bg-brand-gold-light text-xs uppercase tracking-luxury font-semibold transition-colors shrink-0 flex items-center justify-center gap-2"
              >
                <span>{t('newsletter.button')}</span>
                <DirectionalArrow className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-brand-charcoal/80 text-xs">
          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase font-semibold tracking-luxury text-brand-gold mb-4">
              {t('footer.navTitle')}
            </h4>
            <ul className="space-y-2.5 font-light text-stone-400">
              {footerLinks.navigation.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-brand-cream transition-colors">
                    {t(link.translationKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs uppercase font-semibold tracking-luxury text-brand-gold mb-4">
              {t('footer.collectionsTitle')}
            </h4>
            <ul className="space-y-2.5 font-light text-stone-400">
              {footerLinks.collections.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-brand-cream transition-colors">
                    {t(link.translationKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs uppercase font-semibold tracking-luxury text-brand-gold mb-4">
              {t('footer.supportTitle')}
            </h4>
            <ul className="space-y-2.5 font-light text-stone-400">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-brand-cream transition-colors">
                    {t(link.translationKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-semibold tracking-luxury text-brand-gold mb-4">
              {t('nav.contact')}
            </h4>
            <p className="text-stone-400 font-light leading-relaxed">
              {contactConfig.address}
            </p>
            <p className="text-stone-400 font-light">
              {contactConfig.businessHours}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={contactConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-brand-charcoal border border-brand-border flex items-center justify-center text-stone-300 hover:text-brand-gold hover:border-brand-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={contactConfig.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-brand-charcoal border border-brand-border flex items-center justify-center text-stone-300 hover:text-brand-gold hover:border-brand-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={getGeneralWhatsAppUrl(language)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-brand-charcoal border border-brand-border flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-light">
          <p>{t('footer.copyright', { year: siteConfig.year })}</p>
          <p className="text-brand-gold/70">{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
};


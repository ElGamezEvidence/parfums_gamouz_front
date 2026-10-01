import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { getGeneralWhatsAppUrl } from '../../utils/whatsapp';
import { contactConfig } from '../../config/contact';

export const WhatsAppFloatingButton = () => {
  const { language, t } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 end-6 z-40 flex items-center gap-3">
      {/* Small popover balloon tooltip on desktop hover */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-brand-black text-brand-cream border border-brand-gold/40 px-3.5 py-2 text-xs font-light shadow-luxury-dark animate-fadeIn">
          <span>{t('trust.supportTitle')} ({contactConfig.phoneDisplay})</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-white p-0.5"
            aria-label="Fermer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={getGeneralWhatsAppUrl(language)}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
        aria-label="Contacter GAMOUZE sur WhatsApp"
      >
        {/* Subtle breathing ripple */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />

        <MessageCircle className="w-7 h-7 fill-white/20 transition-transform group-hover:scale-110" />

        {/* Small gold indicator dot */}
        <span className="absolute top-1 end-1 w-3 h-3 rounded-full bg-brand-gold border-2 border-white shadow-xs" />
      </a>
    </div>
  );
};


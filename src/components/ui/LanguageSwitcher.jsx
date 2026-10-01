import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const LanguageSwitcher = ({ variant = 'dropdown' }) => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'fr', label: 'Français', short: 'FR', flag: '🇫🇷' },
    { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', short: 'AR', flag: '🇲🇦' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'segmented') {
    return (
      <div className="inline-flex items-center border border-brand-black/15 bg-brand-cream-dark/50 p-0.5 text-xs font-medium">
        {languages.map((item) => {
          const isActive = language === item.code;
          return (
            <button
              key={item.code}
              onClick={() => changeLanguage(item.code)}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? 'bg-brand-black text-brand-gold shadow-sm font-semibold'
                  : 'text-brand-muted hover:text-brand-black'
              }`}
            >
              {item.short}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative inline-block text-start" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 py-1 px-2 text-xs uppercase tracking-wider text-brand-black hover:text-brand-gold transition-colors focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Sélectionner la langue"
      >
        <Globe className="w-3.5 h-3.5 text-brand-gold" />
        <span className="font-medium text-[11px]">{currentLangObj.short}</span>
        <ChevronDown className={`w-3 h-3 text-brand-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-36 bg-brand-black border border-brand-charcoal text-brand-cream shadow-luxury-dark py-1.5 z-50 animate-fadeIn">
          {languages.map((item) => {
            const isActive = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => {
                  changeLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-start ${
                  isActive
                    ? 'text-brand-gold bg-white/5 font-semibold'
                    : 'text-brand-cream/80 hover:text-brand-cream hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{item.flag}</span>
                  <span>{item.label}</span>
                </span>
                {isActive && <span className="text-brand-gold text-[10px]">●</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};


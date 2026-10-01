import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { FALLBACK_IMAGE } from '../../data/products';

export const CategoryCard = ({ category }) => {
  const { isRtl, t } = useLanguage();
  const [imgSrc, setImgSrc] = useState(category.image);

  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="group relative overflow-hidden bg-brand-black aspect-[4/5] sm:aspect-[3/4] flex flex-col justify-end p-6 md:p-8 border border-brand-black/20 shadow-luxury">
      {/* Background Image */}
      <img
        src={imgSrc}
        alt={t(category.titleKey)}
        loading="lazy"
        onError={() => setImgSrc(FALLBACK_IMAGE)}
        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700 ease-out"
      />

      {/* Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />

      {/* Decorative Gold Border Outline */}
      <div className="absolute inset-3 border border-brand-gold/20 pointer-events-none group-hover:border-brand-gold/60 transition-colors duration-500" />

      {/* Content */}
      <div className="relative z-10 space-y-2.5">
        <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-medium">
          Collection
        </span>
        <h3 className="font-serif text-2xl md:text-3xl text-brand-cream tracking-tight">
          {t(category.titleKey)}
        </h3>
        <p className="text-xs md:text-sm text-brand-cream/80 line-clamp-2 font-light max-w-sm">
          {t(category.descKey)}
        </p>

        <div className="pt-2">
          <Link
            to={`/shop?category=${category.key}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury font-medium text-brand-gold hover:text-white transition-colors group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
          >
            <span>{t('collections.explore')}</span>
            <DirectionalArrow className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};


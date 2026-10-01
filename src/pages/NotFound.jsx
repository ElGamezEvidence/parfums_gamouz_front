import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  const { isRtl, t } = useLanguage();
  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mx-auto">
        <Compass className="w-8 h-8" />
      </div>

      <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
        ERREUR 404
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl text-brand-black">
        Page Introuvable
      </h1>

      <p className="text-sm text-brand-muted font-light max-w-md mx-auto leading-relaxed">
        Le sillage que vous suivez semble s'être dissipé. Découvrez notre collection de parfums signatures pour retrouver votre chemin.
      </p>

      <div className="pt-4">
        <Link to="/">
          <Button variant="primary" size="md">
            <span>{t('orderSuccess.continueShopping')}</span>
            <DirectionalArrow className="w-3.5 h-3.5 ms-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};


import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, HeartHandshake, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { SectionTitle } from '../components/common/SectionTitle';
import { Button } from '../components/common/Button';

export const About = () => {
  const { isRtl, t } = useLanguage();
  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-20 md:space-y-28 pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative py-24 sm:py-32 bg-brand-black text-brand-cream border-b border-brand-charcoal overflow-hidden text-center">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=80"
            alt="Maison GAMOUZE"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-black/70" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 z-10 space-y-4">
          <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold">
            {t('about.badge')}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            {t('about.title')}
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-brand-gold/90 font-light max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* 2. STORYTELLING & HERITAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold">
              ORIGINE & VISION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-black tracking-tight leading-tight">
              {t('about.storyTitle')}
            </h2>
            <p className="text-sm sm:text-base text-brand-muted font-light leading-relaxed">
              {t('about.storyP1')}
            </p>
            <p className="text-sm sm:text-base text-brand-muted font-light leading-relaxed">
              {t('about.storyP2')}
            </p>
            <div className="pt-2">
              <Link to="/shop">
                <Button variant="primary" size="md">
                  <span>{t('bestSellers.viewAll')}</span>
                  <DirectionalArrow className="w-4 h-4 ms-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-brand-cream-dark border border-brand-black/10 overflow-hidden shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
                alt="Flacon GAMOUZE"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] bg-brand-cream-dark border border-brand-black/10 overflow-hidden shadow-luxury mt-8">
              <img
                src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80"
                alt="Essences florales"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE CORE PILLARS */}
      <section className="bg-brand-cream-dark/40 py-20 border-y border-brand-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="NOS ENGAGEMENTS"
            title={t('about.valuesTitle')}
            subtitle="Chaque parfum GAMOUZE est conçu selon un cahier des charges d'une rigueur absolue."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-brand-cream border border-brand-black/10 space-y-3">
              <div className="w-12 h-12 bg-brand-black text-brand-gold flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-brand-black">
                {t('about.artisanatTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted font-light leading-relaxed">
                {t('about.artisanatDesc')}
              </p>
            </div>

            <div className="p-8 bg-brand-cream border border-brand-black/10 space-y-3">
              <div className="w-12 h-12 bg-brand-black text-brand-gold flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-brand-black">
                {t('about.ingredientsTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted font-light leading-relaxed">
                {t('about.ingredientsDesc')}
              </p>
            </div>

            <div className="p-8 bg-brand-cream border border-brand-black/10 space-y-3">
              <div className="w-12 h-12 bg-brand-black text-brand-gold flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-brand-black">
                {t('about.serviceTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted font-light leading-relaxed">
                {t('about.serviceDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE CALLOUT BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">
          LAISSEZ VOTRE EMPREINTE
        </span>
        <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-brand-black italic leading-snug">
          « Un parfum est le miroir le plus sincère de votre âme. Portez-le comme une couronne invisible. »
        </blockquote>
        <div className="pt-4">
          <Link to="/shop">
            <Button variant="primary" size="lg">
              {t('hero.ctaCollection')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};


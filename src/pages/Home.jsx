import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Truck, ShieldCheck, Sparkles, MessageSquare, Compass } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { productService } from '../services/productService';
import { categories } from '../data/products';
import { SectionTitle } from '../components/common/SectionTitle';
import { ProductGrid } from '../components/product/ProductGrid';
import { CategoryCard } from '../components/product/CategoryCard';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';

export const Home = () => {
  const { language, isRtl, t } = useLanguage();
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [bs, na] = await Promise.all([
          productService.getBestSellers(4),
          productService.getNewArrivals(4),
        ]);
        setBestSellers(bs);
        setNewArrivals(na);
      } catch (err) {
        console.error('Failed to load homepage products', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-20 md:space-y-32 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center bg-gradient-to-b from-brand-cream to-brand-cream-dark/60 overflow-hidden border-b border-brand-black/5">
        {/* Subtle decorative gold line background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-32 -start-32 w-96 h-96 rounded-full border border-brand-gold blur-2xl" />
          <div className="absolute top-1/2 -end-32 w-96 h-96 rounded-full border border-brand-gold/40 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-[10px] uppercase tracking-widest text-brand-black font-semibold">
                  {t('hero.brandTag')}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-medium text-brand-black tracking-tight leading-[1.08]">
                {t('hero.title')}
              </h1>

              <p className="font-serif italic text-lg sm:text-xl text-brand-gold-dark font-normal">
                « {t('hero.subtitle')} »
              </p>

              <p className="text-sm sm:text-base text-brand-muted max-w-xl font-light leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    <span>{t('hero.ctaCollection')}</span>
                    <DirectionalArrow className="w-4 h-4 ms-3" />
                  </Button>
                </Link>
                <Link to="/shop?filter=isNew">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <span>{t('hero.ctaNew')}</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] bg-brand-cream-dark border border-brand-gold/30 p-3 shadow-luxury-dark">
                {/* Secondary Decorative Inner Border */}
                <div className="absolute inset-5 border border-brand-gold/20 pointer-events-none z-20" />
                
                <img
                  src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80"
                  alt="GAMOUZE Parfum Signature"
                  loading="eager"
                  className="w-full h-full object-cover shadow-inner"
                />

                {/* Floating Signature Tag Badge */}
                <div className="absolute -bottom-6 -start-6 bg-brand-black text-brand-cream p-4 border border-brand-gold/50 shadow-xl hidden sm:block z-30">
                  <p className="text-[9px] uppercase tracking-luxury text-brand-gold font-semibold">
                    GAMOUZE SIGNATURE
                  </p>
                  <p className="font-serif text-sm font-medium mt-0.5">
                    Extrait de Parfum
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-10 bg-brand-cream-dark/40 border border-brand-black/5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-black text-brand-gold shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-luxury font-semibold text-brand-black">
                {t('trust.deliveryTitle')}
              </h4>
              <p className="text-xs text-brand-muted font-light mt-1 leading-relaxed">
                {t('trust.deliveryDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-black text-brand-gold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-luxury font-semibold text-brand-black">
                {t('trust.authenticTitle')}
              </h4>
              <p className="text-xs text-brand-muted font-light mt-1 leading-relaxed">
                {t('trust.authenticDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-black text-brand-gold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-luxury font-semibold text-brand-black">
                {t('trust.signatureTitle')}
              </h4>
              <p className="text-xs text-brand-muted font-light mt-1 leading-relaxed">
                {t('trust.signatureDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-black text-brand-gold shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-luxury font-semibold text-brand-black">
                {t('trust.supportTitle')}
              </h4>
              <p className="text-xs text-brand-muted font-light mt-1 leading-relaxed">
                {t('trust.supportDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t('bestSellers.badge')}
          title={t('bestSellers.title')}
          subtitle={t('bestSellers.subtitle')}
        />

        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            <ProductGrid products={bestSellers} columns={4} />
            <div className="mt-12 text-center">
              <Link to="/shop?filter=bestSeller">
                <Button variant="outline" size="md">
                  <span>{t('bestSellers.viewAll')}</span>
                  <DirectionalArrow className="w-4 h-4 ms-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* 4. COLLECTIONS (Homme, Femme, Unisexe) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t('collections.badge')}
          title={t('collections.title')}
          subtitle={t('collections.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 5. BRAND EDITORIAL STORY */}
      <section className="relative bg-brand-black text-brand-cream py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] border border-brand-charcoal overflow-hidden shadow-luxury-dark">
                <img
                  src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
                  alt="Maison GAMOUZE"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60" />
              </div>
            </div>

            {/* Text & Values Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold">
                {t('brandStory.badge')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                {t('brandStory.title')}
              </h2>
              <p className="text-stone-300 font-light leading-relaxed text-sm sm:text-base">
                {t('brandStory.p1')}
              </p>
              <p className="text-stone-300 font-light leading-relaxed text-sm sm:text-base">
                {t('brandStory.p2')}
              </p>

              {/* 5 Core Values */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-charcoal">
                <div className="space-y-1">
                  <span className="text-brand-gold text-lg">✦</span>
                  <p className="text-xs uppercase tracking-wider font-medium text-brand-cream">
                    {t('brandStory.values.elegance')}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-brand-gold text-lg">✦</span>
                  <p className="text-xs uppercase tracking-wider font-medium text-brand-cream">
                    {t('brandStory.values.quality')}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-brand-gold text-lg">✦</span>
                  <p className="text-xs uppercase tracking-wider font-medium text-brand-cream">
                    {t('brandStory.values.longevity')}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-brand-gold text-lg">✦</span>
                  <p className="text-xs uppercase tracking-wider font-medium text-brand-cream">
                    {t('brandStory.values.identity')}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-brand-gold text-lg">✦</span>
                  <p className="text-xs uppercase tracking-wider font-medium text-brand-cream">
                    {t('brandStory.values.craftsmanship')}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/about">
                  <Button variant="outline-gold" size="md">
                    <span>{t('brandStory.cta')}</span>
                    <DirectionalArrow className="w-4 h-4 ms-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NOUVEAUTÉS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t('newArrivals.badge')}
          title={t('newArrivals.title')}
          subtitle={t('newArrivals.subtitle')}
        />

        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            <ProductGrid products={newArrivals} columns={4} />
            <div className="mt-12 text-center">
              <Link to="/shop?filter=isNew">
                <Button variant="primary" size="md">
                  <span>{t('newArrivals.viewAll')}</span>
                  <DirectionalArrow className="w-4 h-4 ms-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
};


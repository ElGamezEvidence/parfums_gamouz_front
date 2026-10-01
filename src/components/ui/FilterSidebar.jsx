import React from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { formatPrice } from '../../utils/formatters';

export const FilterSidebar = ({
  category,
  onSelectCategory,
  badge,
  onSelectBadge,
  maxPrice,
  onPriceChange,
  onReset,
  className = '',
}) => {
  const { language, t } = useLanguage();

  const categories = [
    { id: 'all', label: t('shop.all') },
    { id: 'men', label: t('nav.men') },
    { id: 'women', label: t('nav.women') },
    { id: 'unisex', label: t('nav.unisex') },
  ];

  const badges = [
    { id: 'bestSeller', label: t('shop.filterBestSellers') },
    { id: 'isNew', label: t('shop.filterNew') },
    { id: 'sale', label: t('shop.filterPromos') },
  ];

  return (
    <aside className={`space-y-8 ${className}`}>
      {/* Categories */}
      <div>
        <h3 className="text-xs uppercase font-semibold tracking-luxury text-brand-black pb-3 border-b border-brand-black/10 mb-4">
          {t('shop.filterCategory')}
        </h3>
        <ul className="space-y-2">
          {categories.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full flex items-center justify-between text-xs py-1.5 transition-colors text-start ${
                    isSelected
                      ? 'text-brand-gold-dark font-semibold'
                      : 'text-stone-600 hover:text-brand-black'
                  }`}
                >
                  <span>{cat.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-gold" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Special Badges */}
      <div>
        <h3 className="text-xs uppercase font-semibold tracking-luxury text-brand-black pb-3 border-b border-brand-black/10 mb-4">
          {t('shop.filterBadges')}
        </h3>
        <ul className="space-y-2">
          {badges.map((b) => {
            const isSelected = badge === b.id;
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => onSelectBadge(isSelected ? null : b.id)}
                  className={`w-full flex items-center justify-between text-xs py-1.5 transition-colors text-start ${
                    isSelected
                      ? 'text-brand-gold-dark font-semibold'
                      : 'text-stone-600 hover:text-brand-black'
                  }`}
                >
                  <span>{b.label}</span>
                  <div
                    className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-brand-gold bg-brand-gold text-brand-black'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price Filter */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-brand-black/10 mb-4">
          <h3 className="text-xs uppercase font-semibold tracking-luxury text-brand-black">
            {t('shop.filterPrice')}
          </h3>
          <span className="text-xs text-brand-gold font-semibold">
            {formatPrice(maxPrice, language)}
          </span>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min="450"
            max="800"
            step="10"
            value={maxPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full accent-brand-gold cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-brand-muted">
            <span>{formatPrice(450, language)}</span>
            <span>{formatPrice(800, language)}</span>
          </div>
        </div>
      </div>

      {/* Reset Filters */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-[11px] uppercase tracking-luxury text-brand-black/80 hover:text-brand-black border border-dashed border-stone-300 hover:border-brand-black transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('shop.resetFilters')}</span>
        </button>
      </div>
    </aside>
  );
};


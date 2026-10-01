import React from 'react';
import { formatPrice } from '../../utils/formatters';
import { useLanguage } from '../../hooks/useLanguage';

export const Price = ({
  price,
  oldPrice = null,
  size = 'md',
  className = '',
}) => {
  const { language } = useLanguage();

  const sizeClasses = {
    sm: 'text-sm font-medium',
    md: 'text-base font-semibold',
    lg: 'text-xl md:text-2xl font-semibold',
  };

  const hasDiscount = oldPrice && oldPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  return (
    <div className={`flex items-center gap-2.5 flex-wrap ${className}`}>
      <span className={`text-brand-black tracking-tight ${sizeClasses[size] || sizeClasses.md}`}>
        {formatPrice(price, language)}
      </span>

      {hasDiscount && (
        <>
          <span className="text-xs md:text-sm text-brand-muted line-through font-light">
            {formatPrice(oldPrice, language)}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-brand-gold/15 text-brand-gold-dark border border-brand-gold/30">
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  );
};


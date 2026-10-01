import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const Rating = ({ score = 5, reviewsCount = null, size = 'sm', showText = true }) => {
  const { t } = useLanguage();
  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  return (
    <div className="flex items-center gap-1.5" aria-label={`Note: ${score} sur 5`}>
      <div className="flex items-center text-brand-gold">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSizes[size] || starSizes.sm} ${
              star <= Math.round(score) ? 'fill-brand-gold text-brand-gold' : 'text-stone-300'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className="text-xs text-brand-muted font-light ms-1">
          {score.toFixed(1)}
          {reviewsCount !== null && (
            <span className="ms-1 text-stone-400">
              ({reviewsCount} {t('product.reviews')})
            </span>
          )}
        </span>
      )}
    </div>
  );
};


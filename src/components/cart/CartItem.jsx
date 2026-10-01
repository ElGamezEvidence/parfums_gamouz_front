import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { formatPrice } from '../../utils/formatters';
import { FALLBACK_IMAGE } from '../../data/products';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { language, t } = useLanguage();
  const [imgSrc, setImgSrc] = useState(item.product.image);

  const productName = item.product.name[language] || item.product.name.fr;
  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-brand-black/10">
      {/* Product Image & Title */}
      <div className="flex items-center gap-4 min-w-0">
        <Link to={`/product/${item.product.id}`} className="shrink-0">
          <img
            src={imgSrc}
            alt={productName}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="w-16 h-20 sm:w-20 sm:h-24 object-cover border border-brand-black/10 bg-brand-cream-dark"
          />
        </Link>
        <div className="min-w-0">
          <span className="text-[10px] uppercase tracking-widest text-brand-gold block">
            {t(`nav.${item.product.category}`)}
          </span>
          <Link
            to={`/product/${item.product.id}`}
            className="font-serif text-sm sm:text-base font-medium text-brand-black hover:text-brand-gold transition-colors block truncate"
          >
            {productName}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 bg-brand-black/5 text-brand-black border border-brand-black/10">
              {item.volume}
            </span>
            <span className="text-xs text-brand-muted font-light">
              {formatPrice(item.price, language)} / {t('common.piece') || 'u.'}
            </span>
          </div>
        </div>
      </div>

      {/* Quantity & Line Total & Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        {/* Quantity Controls */}
        <div className="flex items-center border border-brand-black/20 bg-white">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.product.id, item.volume, item.quantity - 1)}
            aria-label="Diminuer la quantité"
            className="p-1.5 sm:p-2 text-stone-600 hover:text-brand-black hover:bg-brand-black/5 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 py-1 text-xs font-semibold min-w-[2.2rem] text-center text-brand-black">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.product.id, item.volume, item.quantity + 1)}
            aria-label="Augmenter la quantité"
            className="p-1.5 sm:p-2 text-stone-600 hover:text-brand-black hover:bg-brand-black/5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Line Price */}
        <div className="text-end min-w-[80px]">
          <span className="text-sm font-semibold text-brand-black">
            {formatPrice(lineTotal, language)}
          </span>
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onRemove(item.product.id, item.volume)}
          aria-label={t('cart.remove')}
          className="p-2 text-stone-400 hover:text-rose-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


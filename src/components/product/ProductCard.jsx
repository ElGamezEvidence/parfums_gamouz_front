import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { Price } from '../common/Price';
import { Rating } from '../common/Rating';
import { applyImageFallback, resolveProductImageUrl } from '../../utils/productImages';

export const ProductCard = ({ product }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const [imgSrc, setImgSrc] = useState(() => resolveProductImageUrl(product.image));

  useEffect(() => {
    setImgSrc(resolveProductImageUrl(product.image));
  }, [product.id, product.image]);

  const productName = product.name[language] || product.name.fr;
  const isFavorite = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.defaultVolume || '50ml', 1);
    addToast(t('toast.addedToCart', { name: productName }), 'success');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    if (added) {
      addToast(t('toast.addedToWishlist'), 'success');
    } else {
      addToast(t('toast.removedFromWishlist'), 'info');
    }
  };

  const renderBadge = () => {
    if (product.badge === 'isNew' || product.isNew) {
      return (
        <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-luxury bg-brand-black text-brand-gold border border-brand-gold/40">
          {t('product.badgeNew')}
        </span>
      );
    }
    if (product.badge === 'bestSeller' || product.isBestSeller) {
      return (
        <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-luxury bg-brand-gold text-brand-black shadow-sm">
          {t('product.badgeBestSeller')}
        </span>
      );
    }
    if (product.oldPrice && product.oldPrice > product.price) {
      return (
        <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-luxury bg-stone-900 text-brand-cream border border-stone-700">
          {t('product.badgeSale')}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="group relative flex flex-col bg-brand-cream border border-brand-black/5 hover:border-brand-gold/40 transition-all duration-300 shadow-sm hover:shadow-luxury">
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-cream-dark/50">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={imgSrc}
            alt={productName}
            loading="lazy"
            onError={(e) => {
              applyImageFallback(e);
              setImgSrc(e.currentTarget.src);
            }}
            className="w-full h-full object-cover img-zoom"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 start-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {renderBadge()}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={t('nav.wishlist')}
          className={`absolute top-3 end-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isFavorite
              ? 'bg-brand-black text-rose-400 shadow-md'
              : 'bg-white/80 text-brand-black hover:bg-brand-black hover:text-brand-gold'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
        </button>

        {/* Quick Actions Hover Bar (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden md:flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickAdd}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-brand-black text-brand-cream text-[11px] uppercase tracking-luxury hover:bg-brand-gold hover:text-brand-black font-medium transition-colors shadow-luxury-dark"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('product.addToCart')}</span>
          </button>
          <Link
            to={`/product/${product.id}`}
            className="p-3 bg-white text-brand-black hover:text-brand-gold border border-brand-black/10 transition-colors shadow-sm flex items-center justify-center"
            aria-label="Voir le produit"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 md:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-brand-gold font-medium mb-1.5">
            <span>{t(`nav.${product.category}`)}</span>
            <Rating score={product.rating} reviewsCount={product.reviews} size="xs" showText={false} />
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="font-serif text-base md:text-lg text-brand-black font-medium group-hover:text-brand-gold-dark transition-colors line-clamp-1">
              {productName}
            </h3>
          </Link>

          <p className="text-xs text-brand-muted line-clamp-2 mt-1 font-light leading-relaxed">
            {product.description[language] || product.description.fr}
          </p>
        </div>

        <div className="pt-2 border-t border-brand-black/5 flex items-center justify-between">
          <Price price={product.price} oldPrice={product.oldPrice} size="sm" />
          <span className="text-[11px] text-stone-400 font-light">
            {product.defaultVolume || '50ml'}
          </span>
        </div>

        {/* Mobile Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className="md:hidden w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-brand-black text-brand-cream text-[10px] uppercase tracking-luxury hover:bg-brand-gold hover:text-brand-black font-medium transition-colors"
        >
          <ShoppingBag className="w-3 h-3" />
          <span>{t('product.addToCart')}</span>
        </button>
      </div>
    </div>
  );
};


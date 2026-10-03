import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { productService } from '../services/productService';
import { Price } from '../components/common/Price';
import { Rating } from '../components/common/Rating';
import { Button } from '../components/common/Button';
import { ProductGrid } from '../components/product/ProductGrid';
import { LoadingState } from '../components/common/LoadingState';
import { getProductOrderWhatsAppUrl } from '../utils/whatsapp';
import { PRODUCT_IMAGE_PLACEHOLDER, applyImageFallback } from '../utils/productImages';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, isRtl, t } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState('50ml');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState('notes');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      window.scrollTo(0, 0);
      try {
        const found = await productService.getProductById(id);
        if (found) {
          setProduct(found);
          setSelectedVolume(found.defaultVolume || '50ml');
          const gallery = (found.images || []).filter(Boolean);
          setActiveImage(gallery[0] || found.image || PRODUCT_IMAGE_PLACEHOLDER);
          const related = await productService.getRelatedProducts(found.id, found.category, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (isLoading) {
    return <LoadingState message={t('common.loading') || 'Chargement du parfum...'} />;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-brand-black">Parfum introuvable</h2>
        <Link to="/shop">
          <Button variant="primary">{t('shop.all')}</Button>
        </Link>
      </div>
    );
  }

  const productName = product.name[language] || product.name.fr;
  const isFavorite = isInWishlist(product.id);
  const currentPrice = product.volumePrices?.[selectedVolume] ?? product.price;
  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

  const handleAddToCart = () => {
    addToCart(product, selectedVolume, quantity);
    addToast(t('toast.addedToCart', { name: productName }), 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVolume, quantity);
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist(product.id);
    if (added) addToast(t('toast.addedToWishlist'), 'success');
    else addToast(t('toast.removedFromWishlist'), 'info');
  };

  const whatsappOrderUrl = getProductOrderWhatsAppUrl(
    product,
    selectedVolume,
    quantity,
    currentPrice * quantity,
    language
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16 sm:space-y-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brand-muted uppercase tracking-wider">
        <Link to="/" className="hover:text-brand-black transition-colors">
          {t('nav.home')}
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-brand-black transition-colors">
          {t('nav.shop')}
        </Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-brand-black transition-colors">
          {t(`nav.${product.category}`)}
        </Link>
        <span>/</span>
        <span className="text-brand-gold font-medium truncate">{productName}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Gallery Visuals (Left) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[3/4] bg-brand-cream-dark/50 border border-brand-black/10 overflow-hidden shadow-luxury">
            <img
              src={activeImage}
              alt={productName}
              onError={applyImageFallback}
              className="w-full h-full object-cover transition-all duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 start-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="px-3 py-1 text-[10px] uppercase tracking-luxury font-semibold bg-brand-black text-brand-gold border border-brand-gold/40">
                  {t('product.badgeNew')}
                </span>
              )}
              {product.isBestSeller && (
                <span className="px-3 py-1 text-[10px] uppercase tracking-luxury font-semibold bg-brand-gold text-brand-black shadow-sm">
                  {t('product.badgeBestSeller')}
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-4 end-4 p-2.5 rounded-full backdrop-blur-md transition-colors ${
                isFavorite
                  ? 'bg-brand-black text-rose-400'
                  : 'bg-white/80 text-brand-black hover:bg-brand-black hover:text-brand-gold'
              }`}
              aria-label={t('nav.wishlist')}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-400' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-24 border transition-all overflow-hidden shrink-0 ${
                    activeImage === img
                      ? 'border-brand-gold ring-1 ring-brand-gold shadow-sm'
                      : 'border-brand-black/15 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={applyImageFallback}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Controls (Right) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold block mb-2">
              {t(`nav.${product.category}`)} • Haute Parfumerie
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-brand-black tracking-tight leading-tight">
              {productName}
            </h1>
            <div className="mt-3 flex items-center gap-4">
              <Rating score={product.rating} reviewsCount={product.reviews} size="sm" />
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-medium">
                {t('product.inStock')}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="py-3 border-y border-brand-black/10">
            <Price price={currentPrice} oldPrice={product.oldPrice} size="lg" />
            <p className="text-[11px] text-brand-muted font-light mt-1">
              {t('product.freeDeliveryNotice')}
            </p>
          </div>

          {/* Short Description */}
          <p className="text-sm text-brand-muted font-light leading-relaxed">
            {product.description?.[language] || product.description?.fr || ''}
          </p>

          {/* Volume Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase font-semibold tracking-luxury text-brand-black">
                {t('product.volume')}
              </label>
              <span className="text-xs text-brand-gold font-medium">{selectedVolume}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(product.volumes || []).map((vol) => {
                const volPrice = product.volumePrices?.[vol] ?? product.price;
                const isSelected = selectedVolume === vol;
                return (
                  <button
                    key={vol}
                    type="button"
                    onClick={() => setSelectedVolume(vol)}
                    className={`py-3 px-4 border text-center transition-all ${
                      isSelected
                        ? 'border-brand-black bg-brand-black text-brand-gold font-semibold shadow-sm'
                        : 'border-brand-black/20 bg-white text-brand-black hover:border-brand-gold'
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-wider">{vol}</span>
                    <span className="block text-[11px] mt-0.5 text-brand-muted font-light">
                      {volPrice} MAD
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs uppercase font-semibold tracking-luxury text-brand-black">
              {t('product.quantity')}
            </span>
            <div className="flex items-center border border-brand-black/20 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 text-stone-600 hover:text-brand-black hover:bg-brand-black/5 transition-colors"
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 text-xs font-semibold text-brand-black min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2.5 text-stone-600 hover:text-brand-black hover:bg-brand-black/5 transition-colors"
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CTA Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                className="flex-1"
                icon={ShoppingBag}
              >
                {t('product.addToCart')}
              </Button>
              <Button
                variant="gold"
                size="lg"
                onClick={handleBuyNow}
                className="flex-1"
              >
                {t('product.buyNow')}
              </Button>
            </div>

            {/* Direct WhatsApp Order Button */}
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-luxury font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('product.orderViaWhatsApp')}</span>
            </a>
          </div>

          {/* Trust Value Props */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-black/10 text-[11px] text-brand-muted">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Livraison 24/48h au Maroc</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Paiement à la livraison</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion / Tabs: Pyramide Olfactive, Conseils, Livraison */}
      <div className="border-t border-brand-black/10 pt-12">
        <div className="flex items-center justify-center gap-4 sm:gap-8 border-b border-brand-black/10 pb-4 overflow-x-auto">
          {[
            { id: 'notes', label: t('product.notesTitle') },
            { id: 'usage', label: t('product.usageTips') },
            { id: 'delivery', label: t('product.deliveryInfo') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs uppercase tracking-luxury font-semibold pb-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-brand-gold text-brand-black'
                  : 'border-transparent text-brand-muted hover:text-brand-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="max-w-3xl mx-auto py-8">
          {activeTab === 'notes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {/* Top Notes */}
              <div className="p-6 bg-brand-cream-dark/50 border border-brand-black/5 space-y-2">
                <span className="text-[10px] uppercase tracking-luxury text-brand-gold font-bold">
                  {t('product.topNotes')}
                </span>
                <p className="text-xs text-brand-muted font-light">
                  {product.notes?.top?.[language]?.join(' • ') ||
                    product.notes?.top?.fr?.join(' • ') ||
                    '—'}
                </p>
              </div>

              {/* Heart Notes */}
              <div className="p-6 bg-brand-cream-dark/50 border border-brand-black/5 space-y-2">
                <span className="text-[10px] uppercase tracking-luxury text-brand-gold font-bold">
                  {t('product.heartNotes')}
                </span>
                <p className="text-xs text-brand-muted font-light">
                  {product.notes?.heart?.[language]?.join(' • ') ||
                    product.notes?.heart?.fr?.join(' • ') ||
                    '—'}
                </p>
              </div>

              {/* Base Notes */}
              <div className="p-6 bg-brand-cream-dark/50 border border-brand-black/5 space-y-2">
                <span className="text-[10px] uppercase tracking-luxury text-brand-gold font-bold">
                  {t('product.baseNotes')}
                </span>
                <p className="text-xs text-brand-muted font-light">
                  {product.notes?.base?.[language]?.join(' • ') ||
                    product.notes?.base?.fr?.join(' • ') ||
                    '—'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <p className="text-sm text-brand-muted font-light leading-relaxed">
                {t('product.usageContent')}
              </p>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <p className="text-sm text-brand-muted font-light leading-relaxed">
                {t('product.deliveryContent')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products: Vous pourriez également aimer */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-brand-black/10 pt-16">
          <div className="text-center mb-10">
            <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold">
              RECOMMANDATIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-black mt-2">
              {t('product.relatedTitle')}
            </h2>
            <p className="text-xs text-brand-muted mt-2 font-light">
              {t('product.relatedSubtitle')}
            </p>
          </div>
          <ProductGrid products={relatedProducts} columns={4} />
        </div>
      )}
    </div>
  );
};


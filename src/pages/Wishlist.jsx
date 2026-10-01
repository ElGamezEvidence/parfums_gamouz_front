import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useWishlist } from '../context/WishlistContext';
import { productService } from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';

export const Wishlist = () => {
  const { t } = useLanguage();
  const { wishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWishlistProducts = async () => {
      setIsLoading(true);
      try {
        const all = await productService.getProducts();
        const filtered = all.filter((p) => wishlist.includes(p.id));
        setProducts(filtered);
      } catch (err) {
        console.error('Failed to load wishlist products', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlistProducts();
  }, [wishlist]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <EmptyState
          icon={Heart}
          title={t('wishlist.emptyTitle')}
          subtitle={t('wishlist.emptySubtitle')}
          actionText={t('wishlist.explore')}
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="flex items-center justify-between pb-6 border-b border-brand-black/10 mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-black">
            {t('wishlist.title')}
          </h1>
          <p className="text-xs text-brand-muted mt-1 font-light">
            {products.length} {products.length === 1 ? 'création sauvegardée' : 'créations sauvegardées'}
          </p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs uppercase tracking-luxury text-stone-400 hover:text-rose-500 transition-colors"
        >
          Tout effacer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useLanguage } from '../../hooks/useLanguage';
import { formatPrice } from '../../utils/formatters';

export const SearchBarModal = ({ isOpen, onClose }) => {
  const { language, isRtl, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const suggestions = ['Oud', 'Noir', 'Rose', 'Signature', 'Élégance', 'Ambre'];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await productService.getProducts({ query: query.trim() });
      setResults(res.slice(0, 5));
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (product) => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-brand-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-brand-cream text-brand-black border border-brand-gold/30 shadow-luxury-dark p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-2 text-brand-muted hover:text-brand-black transition-colors"
          aria-label={t('common.close') || 'Fermer'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Search Header Form */}
        <form onSubmit={handleSubmitSearch} className="relative mb-6">
          <label htmlFor="search-input" className="sr-only">
            {t('search.placeholder')}
          </label>
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-brand-gold" />
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full ps-11 pe-10 py-3.5 bg-transparent border-b-2 border-brand-black/20 focus:border-brand-gold focus:outline-none text-base md:text-lg font-light tracking-wide text-brand-black placeholder:text-stone-400 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute top-1/2 -translate-y-1/2 end-3 p-1 text-stone-400 hover:text-brand-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Quick suggestions */}
        {!query && (
          <div className="pt-2">
            <span className="text-[11px] uppercase tracking-luxury text-brand-muted font-semibold block mb-3">
              {t('search.quickSuggestions')}
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuery(item)}
                  className="px-3 py-1.5 text-xs bg-brand-cream-dark/60 hover:bg-brand-black hover:text-brand-gold text-brand-black/80 border border-brand-black/10 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div className="mt-4 divide-y divide-brand-black/10 max-h-80 overflow-y-auto">
            {isSearching ? (
              <p className="py-6 text-center text-xs uppercase tracking-luxury text-brand-muted">
                {t('common.loading') || 'Recherche...'}
              </p>
            ) : results.length > 0 ? (
              <>
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="flex items-center gap-4 py-3 px-2 hover:bg-brand-black/5 cursor-pointer transition-colors group"
                  >
                    <img
                      src={product.image}
                      alt={product.name[language] || product.name.fr}
                      className="w-14 h-14 object-cover border border-brand-black/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-brand-gold block">
                        {t(`nav.${product.category}`)}
                      </span>
                      <h4 className="font-serif text-sm font-medium text-brand-black truncate group-hover:text-brand-gold-dark transition-colors">
                        {product.name[language] || product.name.fr}
                      </h4>
                      <p className="text-xs text-brand-muted font-medium mt-0.5">
                        {formatPrice(product.price, language)}
                      </p>
                    </div>
                    <DirectionalArrow className="w-4 h-4 text-stone-300 group-hover:text-brand-gold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
                <div className="pt-4 text-center">
                  <button
                    onClick={handleSubmitSearch}
                    className="text-xs uppercase font-medium tracking-luxury text-brand-gold hover:text-brand-black transition-colors"
                  >
                    {t('shop.all')} ({results.length}+)
                  </button>
                </div>
              </>
            ) : (
              <p className="py-8 text-center text-sm text-brand-muted font-light">
                {t('search.noResults', { query })}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


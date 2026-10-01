import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { productService } from '../services/productService';
import { SectionTitle } from '../components/common/SectionTitle';
import { ProductGrid } from '../components/product/ProductGrid';
import { FilterSidebar } from '../components/ui/FilterSidebar';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';

export const Shop = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const categoryParam = searchParams.get('category') || 'all';
  const filterParam = searchParams.get('filter') || null;
  const searchParam = searchParams.get('search') || '';

  // Local state
  const [category, setCategory] = useState(categoryParam);
  const [badge, setBadge] = useState(filterParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState('relevant');
  const [maxPrice, setMaxPrice] = useState(800);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    if (categoryParam !== category) setCategory(categoryParam);
    if (filterParam !== badge) setBadge(filterParam);
    if (searchParam !== searchQuery) setSearchQuery(searchParam);
  }, [categoryParam, filterParam, searchParam]);

  // Load products based on active filters
  useEffect(() => {
    const fetchFiltered = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getProducts({
          category,
          badge,
          query: searchQuery,
          maxPrice,
          sortBy,
        });
        setProducts(data);
      } catch (err) {
        console.error('Failed to filter products', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiltered();
  }, [category, badge, searchQuery, maxPrice, sortBy]);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    setSearchParams((prev) => {
      if (newCat === 'all') prev.delete('category');
      else prev.set('category', newCat);
      return prev;
    });
  };

  const handleBadgeChange = (newBadge) => {
    setBadge(newBadge);
    setSearchParams((prev) => {
      if (!newBadge) prev.delete('filter');
      else prev.set('filter', newBadge);
      return prev;
    });
  };

  const handleResetFilters = () => {
    setCategory('all');
    setBadge(null);
    setSearchQuery('');
    setMaxPrice(800);
    setSortBy('relevant');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Shop Title */}
      <SectionTitle
        badge="COLLECTION COMPLÈTE"
        title={t('shop.title')}
        subtitle={t('shop.subtitle')}
      />

      {/* Quick Category Tabs Header */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 border-b border-brand-black/10 pb-6 mb-8 overflow-x-auto">
        {[
          { id: 'all', label: t('shop.all') },
          { id: 'men', label: t('nav.men') },
          { id: 'women', label: t('nav.women') },
          { id: 'unisex', label: t('nav.unisex') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleCategoryChange(tab.id)}
            className={`px-4 py-2 text-xs uppercase tracking-luxury font-medium transition-all shrink-0 ${
              category === tab.id
                ? 'bg-brand-black text-brand-gold font-semibold shadow-sm'
                : 'text-brand-muted hover:text-brand-black hover:bg-brand-black/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toolbar: Search input, Sort Dropdown & Mobile filter toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-brand-cream-dark/30 p-4 border border-brand-black/5">
        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-brand-gold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full ps-9 pe-8 py-2 text-xs bg-white border border-brand-black/15 focus:border-brand-gold focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 -translate-y-1/2 end-2.5 text-stone-400 hover:text-brand-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side controls: Count, Sort, Mobile Filter Button */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
          <span className="text-xs text-brand-muted font-light">
            {t('shop.showingResults', { count: products.length })}
          </span>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="shop-sort" className="sr-only">
              {t('shop.sortBy')}
            </label>
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-brand-black/15 text-brand-black focus:border-brand-gold focus:outline-none cursor-pointer"
            >
              <option value="relevant">{t('shop.sortRelevant')}</option>
              <option value="price-asc">{t('shop.sortPriceAsc')}</option>
              <option value="price-desc">{t('shop.sortPriceDesc')}</option>
              <option value="newest">{t('shop.sortNewest')}</option>
              <option value="popularity">{t('shop.sortPopularity')}</option>
            </select>
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 py-2 px-3 bg-brand-black text-brand-gold text-xs uppercase tracking-luxury font-medium"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t('shop.filterTitle')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <FilterSidebar
            category={category}
            onSelectCategory={handleCategoryChange}
            badge={badge}
            onSelectBadge={handleBadgeChange}
            maxPrice={maxPrice}
            onPriceChange={setMaxPrice}
            onReset={handleResetFilters}
          />
        </div>

        {/* Products Grid Column */}
        <div className="lg:col-span-9">
          {isLoading ? (
            <LoadingState />
          ) : products.length > 0 ? (
            <ProductGrid products={products} columns={3} />
          ) : (
            <EmptyState
              title={t('shop.noResults')}
              subtitle={t('shop.clearSearch')}
              actionText={t('shop.resetFilters')}
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-brand-black/60 backdrop-blur-sm lg:hidden animate-fadeIn">
          <div className="w-full max-w-xs bg-brand-cream h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-brand-black/10 mb-6">
                <h3 className="font-serif text-lg font-medium text-brand-black">
                  {t('shop.filterTitle')}
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-stone-500 hover:text-brand-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterSidebar
                category={category}
                onSelectCategory={handleCategoryChange}
                badge={badge}
                onSelectBadge={handleBadgeChange}
                maxPrice={maxPrice}
                onPriceChange={setMaxPrice}
                onReset={handleResetFilters}
              />
            </div>

            <div className="pt-6 border-t border-brand-black/10 mt-6">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-brand-black text-brand-gold text-xs uppercase tracking-luxury font-semibold"
              >
                {t('shop.showingResults', { count: products.length })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


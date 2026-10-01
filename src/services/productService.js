import api from './api';
import { products as mockProducts } from '../data/products';
import { normalizeProductFromApi, normalizeProductsFromApi } from '../utils/productNormalizer';

export const productService = {
  // Get all products with filters, sorting and pagination
  async getProducts(filters = {}) {
    try {
      const locale = localStorage.getItem('gamouze_lang') || 'fr';
      const params = {
        locale,
        ...(filters.category && filters.category !== 'all' ? { category: filters.category } : {}),
        ...(filters.badge ? { badge: filters.badge } : {}),
        ...(filters.query ? { q: filters.query } : {}),
        ...(filters.minPrice !== undefined ? { minPrice: filters.minPrice } : {}),
        ...(filters.maxPrice !== undefined ? { maxPrice: filters.maxPrice } : {}),
        ...(filters.sortBy ? { sortBy: filters.sortBy } : {}),
        ...(filters.page ? { page: filters.page } : {}),
        ...(filters.limit ? { limit: filters.limit } : {}),
      };

      const res = await api.get('/products', { params });
      if (res.data?.data?.items) {
        return normalizeProductsFromApi(res.data.data.items);
      }
    } catch (err) {
      console.warn('API /products unreachable, falling back to embedded catalog', err.message);
    }

    // Graceful fallback to rich embedded dataset
    let result = [...mockProducts];
    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.badge) {
      if (filters.badge === 'bestSeller') result = result.filter((p) => p.isBestSeller);
      else if (filters.badge === 'isNew') result = result.filter((p) => p.isNew);
      else if (filters.badge === 'sale') result = result.filter((p) => p.oldPrice && p.oldPrice > p.price);
    }
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice);
    }
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter((p) => {
        const matchName =
          p.name.fr?.toLowerCase().includes(q) ||
          p.name.en?.toLowerCase().includes(q) ||
          p.name.ar?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        return matchName || matchCat;
      });
    }
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'popularity':
          result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
          break;
      }
    }
    return result;
  },

  // Get single product by slug or numeric ID
  async getProductBySlug(slug) {
    try {
      const locale = localStorage.getItem('gamouze_lang') || 'fr';
      const res = await api.get(`/products/${slug}`, { params: { locale } });
      if (res.data?.data) {
        return normalizeProductFromApi(res.data.data);
      }
    } catch (err) {
      console.warn(`API /products/${slug} unavailable, trying local fallback`, err.message);
    }

    const found = mockProducts.find((p) => p.slug === slug || String(p.id) === String(slug));
    return found || null;
  },

  async getProductById(id) {
    return this.getProductBySlug(id);
  },

  // Get featured products
  async getFeaturedProducts(limit = 4) {
    try {
      const locale = localStorage.getItem('gamouze_lang') || 'fr';
      const res = await api.get('/products/featured', { params: { limit, locale } });
      if (res.data?.data) {
        return normalizeProductsFromApi(res.data.data);
      }
    } catch (err) {
      console.warn('API /products/featured unavailable, using fallback', err.message);
    }
    return mockProducts.filter((p) => p.isFeatured).slice(0, limit);
  },

  // Get best sellers
  async getBestSellers(limit = 4) {
    const all = await this.getProducts({ badge: 'bestSeller', limit });
    return all.slice(0, limit);
  },

  // Get new arrivals
  async getNewArrivals(limit = 4) {
    const all = await this.getProducts({ badge: 'isNew', limit });
    return all.slice(0, limit);
  },

  // Get related products
  async getRelatedProducts(currentProductId, category, limit = 4) {
    const all = await this.getProducts({ category });
    return all
      .filter((p) => String(p.id) !== String(currentProductId))
      .slice(0, limit);
  },
};

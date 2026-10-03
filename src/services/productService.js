import api from './api';
import { products as mockProducts } from '../data/products';
import { normalizeProductFromApi, normalizeProductsFromApi } from '../utils/productNormalizer';

/** Catalogue embarqué uniquement en dev local explicite — jamais sur Netlify prod. */
const USE_EMBEDDED_MOCK =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_CATALOG === 'true';

export const productService = {
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
      return [];
    } catch (err) {
      console.warn('API /products unreachable', err.message);
      if (USE_EMBEDDED_MOCK) {
        return filterMockProducts(mockProducts, filters);
      }
      return [];
    }
  },

  async getProductBySlug(slug) {
    try {
      const locale = localStorage.getItem('gamouze_lang') || 'fr';
      const res = await api.get(`/products/${slug}`, { params: { locale } });
      if (res.data?.data) {
        return normalizeProductFromApi(res.data.data);
      }
    } catch (err) {
      console.warn(`API /products/${slug} unavailable`, err.message);
    }

    if (USE_EMBEDDED_MOCK) {
      return (
        mockProducts.find((p) => p.slug === slug || String(p.id) === String(slug)) || null
      );
    }
    return null;
  },

  async getProductById(id) {
    return this.getProductBySlug(id);
  },

  async getFeaturedProducts(limit = 4) {
    try {
      const locale = localStorage.getItem('gamouze_lang') || 'fr';
      const res = await api.get('/products/featured', { params: { limit, locale } });
      if (res.data?.data) {
        return normalizeProductsFromApi(res.data.data);
      }
    } catch (err) {
      console.warn('API /products/featured unavailable', err.message);
    }
    if (USE_EMBEDDED_MOCK) {
      return mockProducts.filter((p) => p.isFeatured).slice(0, limit);
    }
    return [];
  },

  async getBestSellers(limit = 4) {
    const all = await this.getProducts({ badge: 'bestSeller', limit });
    return all.slice(0, limit);
  },

  async getNewArrivals(limit = 4) {
    const all = await this.getProducts({ badge: 'isNew', limit });
    return all.slice(0, limit);
  },

  async getRelatedProducts(currentProductId, category, limit = 4) {
    const all = await this.getProducts({ category });
    return all
      .filter((p) => String(p.id) !== String(currentProductId))
      .slice(0, limit);
  },
};

function filterMockProducts(list, filters) {
  let result = [...list];
  if (filters.category && filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.badge) {
    if (filters.badge === 'bestSeller') result = result.filter((p) => p.isBestSeller);
    else if (filters.badge === 'isNew') result = result.filter((p) => p.isNew);
    else if (filters.badge === 'sale') {
      result = result.filter((p) => p.oldPrice && p.oldPrice > p.price);
    }
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
      default:
        break;
    }
  }
  return result;
}

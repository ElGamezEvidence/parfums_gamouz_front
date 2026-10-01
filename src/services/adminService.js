import api from './api';

export const adminService = {
  // Dashboard Metrics
  async getDashboardStats(period = '30d') {
    const res = await api.get('/admin/dashboard/stats', { params: { period } });
    return res.data.data;
  },

  // Products
  async getProducts(params = {}) {
    const res = await api.get('/admin/products', { params });
    return res.data.data;
  },

  async createProduct(productData) {
    const res = await api.post('/admin/products', productData);
    return res.data.data;
  },

  async updateProduct(id, productData) {
    const res = await api.put(`/admin/products/${id}`, productData);
    return res.data;
  },

  /** Téléverse une image produit (JPEG, PNG, WebP, GIF — max 5 Mo) */
  async uploadProductImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/admin/media/upload', formData, {
      timeout: 60000,
    });
    return res.data.data;
  },

  async uploadProductImages(files) {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const res = await api.post('/admin/media/upload-many', formData, {
      timeout: 120000,
    });
    return res.data.data.items;
  },

  // Inventory / Stock Movement
  async adjustStock(variantId, quantityChange, reason, type = 'ADJUSTMENT') {
    const res = await api.post('/admin/inventory/movement', {
      variantId,
      quantityChange,
      reason,
      type,
    });
    return res.data.data;
  },

  // Categories
  async getCategories() {
    const res = await api.get('/admin/categories');
    return res.data.data;
  },

  async createCategory(categoryData) {
    const res = await api.post('/admin/categories', categoryData);
    return res.data.data;
  },

  // Orders
  async getOrders(params = {}) {
    const res = await api.get('/admin/orders', { params });
    return res.data.data;
  },

  async updateOrderStatus(id, statusData) {
    const res = await api.put(`/admin/orders/${id}/status`, statusData);
    return res.data;
  },

  // Coupons
  async getCoupons() {
    const res = await api.get('/admin/coupons');
    return res.data.data;
  },

  async createCoupon(couponData) {
    const res = await api.post('/admin/coupons', couponData);
    return res.data.data;
  },

  // Reviews
  async getReviews(params = {}) {
    const res = await api.get('/admin/reviews', { params });
    return res.data.data;
  },

  async moderateReview(id, status, brandReply = '') {
    const res = await api.put(`/admin/reviews/${id}/moderate`, { status, brandReply });
    return res.data;
  },

  // CMS Content & Settings
  async getContent() {
    const res = await api.get('/admin/content');
    return res.data.data;
  },

  async updateContent(key, contentJson, isPublished = true) {
    const res = await api.put(`/admin/content/${key}`, { contentJson, isPublished });
    return res.data;
  },

  async getSettings() {
    const res = await api.get('/admin/settings');
    return res.data.data;
  },

  async updateSetting(key, value) {
    const res = await api.put(`/admin/settings/${key}`, { value });
    return res.data;
  },

  // Contact Messages & Subscribers
  async getMessages() {
    const res = await api.get('/admin/messages');
    return res.data.data;
  },

  async getSubscribers() {
    const res = await api.get('/admin/subscribers');
    return res.data.data;
  },

  // Customers & Users
  async getCustomers(params = {}) {
    const res = await api.get('/admin/customers', { params });
    return res.data.data;
  },

  async getUsers() {
    const res = await api.get('/admin/users');
    return res.data.data;
  },

  async createUser(userData) {
    const res = await api.post('/admin/users', userData);
    return res.data.data;
  },

  // Audit Logs
  async getAuditLogs(params = {}) {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data.data;
  },
};

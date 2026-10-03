import api from './api';

const STORAGE_KEY = 'gamouze_orders';
const LAST_ORDER_KEY = 'gamouze_last_order';

/** API attend COD | ONLINE ; le checkout utilise cod | card | transfer */
function normalizePaymentMethod(method) {
  const key = String(method || 'cod').toLowerCase();
  if (key === 'cod') return 'COD';
  if (['online', 'card', 'transfer'].includes(key)) return 'ONLINE';
  return 'COD';
}

export const orderService = {
  // Create order via backend API
  async createOrder(orderData) {
    try {
      const payload = {
        customer: {
          firstName: orderData.customer.firstName,
          lastName: orderData.customer.lastName,
          phone: orderData.customer.phone,
          email: orderData.customer.email || undefined,
          city: orderData.customer.city,
          region: orderData.customer.region || undefined,
          address: orderData.customer.address,
          notes: orderData.customer.notes || undefined,
        },
        items: orderData.items.map((i) => ({
          productId: String(i.productId),
          variantId: i.variantId ? String(i.variantId) : undefined,
          volume: i.volume || undefined,
          quantity: i.quantity,
        })),
        couponCode: orderData.couponCode || undefined,
        paymentMethod: normalizePaymentMethod(orderData.paymentMethod),
      };

      const res = await api.post('/orders', payload);
      const created = res.data.data;

      // Cache locally for the OrderSuccess screen
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(created));
          const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          existing.unshift(created);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
        } catch (e) {
          console.warn('LocalStorage save failed', e);
        }
      }

      return {
        success: true,
        orderId: created.orderId || created.id,
        orderNumber: created.orderNumber,
        order: created,
      };
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.message ||
        'Impossible de créer la commande. Vérifiez votre connexion ou réessayez.';
      console.warn('Server order submission failed', message);
      return {
        success: false,
        error: message,
        code: err.response?.data?.error?.code || 'ORDER_FAILED',
      };
    }
  },

  async getLastOrder() {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(LAST_ORDER_KEY);
        if (raw) return JSON.parse(raw);
      } catch (err) {
        console.error('Error fetching last order', err);
      }
    }
    return null;
  },

  async getOrderByNumber(orderNumber, phone = '') {
    try {
      const res = await api.get(`/orders/${orderNumber}`, { params: { phone } });
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('Error fetching order by number from API', err.message);
    }

    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return existing.find((o) => o.orderNumber === orderNumber || o.orderId === orderNumber) || null;
      } catch {
        return null;
      }
    }
    return null;
  },
};

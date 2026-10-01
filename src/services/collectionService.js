import api from './api';

export const collectionService = {
  async getCollections() {
    const locale = localStorage.getItem('gamouze_lang') || 'fr';
    const res = await api.get('/collections', { params: { locale } });
    return res.data?.data || [];
  },
};

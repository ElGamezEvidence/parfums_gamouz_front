import api from './api';

export const authService = {
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    const { user, accessToken } = res.data.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('gamouze_access_token', accessToken);
      localStorage.setItem('gamouze_user', JSON.stringify(user));
    }
    return { user, accessToken };
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout call completed locally', err);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gamouze_access_token');
        localStorage.removeItem('gamouze_user');
      }
    }
  },

  async register(data) {
    const res = await api.post('/auth/register', data);
    const { user, accessToken } = res.data.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('gamouze_access_token', accessToken);
      localStorage.setItem('gamouze_user', JSON.stringify(user));
    }
    return { user, accessToken };
  },

  async changePassword(currentPassword, newPassword, confirmNewPassword) {
    const res = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmNewPassword: confirmNewPassword ?? newPassword,
    });
    try {
      const freshUser = await authService.getMe();
      if (typeof window !== 'undefined') {
        localStorage.setItem('gamouze_user', JSON.stringify(freshUser));
      }
      return { ...res.data, user: freshUser };
    } catch {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('gamouze_user');
        if (raw) {
          const u = JSON.parse(raw);
          u.mustChangePassword = false;
          localStorage.setItem('gamouze_user', JSON.stringify(u));
        }
      }
      return res.data;
    }
  },

  async forgotPassword(email) {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(token, newPassword) {
    const res = await api.post('/auth/reset-password', { token, newPassword });
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data.data.user;
  },

  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('gamouze_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('gamouze_access_token');
  },
};

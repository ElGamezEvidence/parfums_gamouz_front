import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach bearer token from localStorage if present
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('gamouze_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized & expired sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        const isAuthRoute =
          window.location.pathname.includes('/admin/login') ||
          window.location.pathname.includes('/account/login');
        if (!isAuthRoute && !window.location.pathname.startsWith('/shop')) {
          localStorage.removeItem('gamouze_access_token');
          localStorage.removeItem('gamouze_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

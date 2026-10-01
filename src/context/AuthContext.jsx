import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const freshUser = await authService.getMe();
          setUser(freshUser);
          localStorage.setItem('gamouze_user', JSON.stringify(freshUser));
        } catch (err) {
          // Token expired or invalid
          console.warn('Session verification failed, logging out locally', err.message);
          setUser(null);
          localStorage.removeItem('gamouze_access_token');
          localStorage.removeItem('gamouze_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const { user: loggedInUser, accessToken } = await authService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const register = async (data) => {
    const { user: registeredUser } = await authService.register(data);
    setUser(registeredUser);
    return registeredUser;
  };

  const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
    const res = await authService.changePassword(currentPassword, newPassword, confirmNewPassword);
    if (res.user) {
      setUser(res.user);
    } else {
      setUser((prev) => (prev ? { ...prev, mustChangePassword: false } : null));
    }
    return res;
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user && ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR', 'SUPPORT'].includes(user.role);
  const isSuperAdmin = user && user.role === 'SUPER_ADMIN';
  const mustChangePassword = user && Boolean(user.mustChangePassword);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        mustChangePassword,
        login,
        logout,
        register,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

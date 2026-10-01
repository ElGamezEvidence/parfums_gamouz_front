import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLanguage } from './hooks/useLanguage';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloatingButton } from './components/layout/WhatsAppFloatingButton';
import { AdminProtectedRoute } from './components/common/AdminProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Wishlist } from './pages/Wishlist';
import { NotFound } from './pages/NotFound';

// Customer Account Pages
import { AccountLogin } from './pages/account/AccountLogin';
import { AccountRegister } from './pages/account/AccountRegister';
import { AccountOrders } from './pages/account/AccountOrders';

// Admin Back-Office Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminForgotPassword } from './pages/admin/AdminForgotPassword';
import { AdminResetPassword } from './pages/admin/AdminResetPassword';
import { AdminChangePassword } from './pages/admin/AdminChangePassword';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminContent as AdminContentPage } from './pages/admin/AdminContent';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

// Helper to scroll to top on page change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main Routing Container
const AppRouting = () => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Dynamic browser title
    const brandName = t('brand.name') || 'GAMOUZE';
    const slogan = t('brand.slogan') || 'Laissez votre empreinte.';
    document.title = `${brandName} | ${slogan}`;
  }, [language, t]);

  if (isAdminRoute) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          {/* Public Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="change-password" element={<AdminChangePassword />} />
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
          </Route>
        </Routes>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-black selection:bg-brand-gold selection:text-brand-black">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Customer account */}
          <Route path="/account/login" element={<AccountLogin />} />
          <Route path="/account/register" element={<AccountRegister />} />
          <Route path="/account/orders" element={<AccountOrders />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>
              <AppRouting />
            </CartProvider>
          </WishlistProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { SearchBarModal } from '../ui/SearchBarModal';
import { contactConfig } from '../../config/contact';
import { getGeneralWhatsAppUrl } from '../../utils/whatsapp';

export const Navbar = () => {
  const { language, t } = useLanguage();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/shop', label: t('nav.shop') },
    { path: '/shop?category=men', label: t('nav.men') },
    { path: '/shop?category=women', label: t('nav.women') },
    { path: '/shop?category=unisex', label: t('nav.unisex') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-cream/95 backdrop-blur-md shadow-sm border-b border-brand-black/10 py-3.5'
            : 'bg-brand-cream/80 backdrop-blur-sm border-b border-brand-black/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-brand-black hover:text-brand-gold transition-colors"
              aria-label="Menu principal"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-brand-black hover:text-brand-gold transition-colors"
              aria-label={t('nav.search')}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <Link
            to="/"
            className="flex flex-col items-center group transition-transform duration-300"
          >
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-[0.25em] text-brand-black group-hover:text-brand-gold-dark transition-colors">
              GAMOUZE
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-brand-gold -mt-1 font-medium">
              Haute Parfumerie
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            {navLinks.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path.includes('?') && location.pathname + location.search === item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs uppercase tracking-luxury font-medium transition-colors py-1 relative ${
                    isActive
                      ? 'text-brand-gold-dark font-semibold'
                      : 'text-brand-black hover:text-brand-gold'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-brand-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
            {/* Desktop Search */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex p-2 text-brand-black hover:text-brand-gold transition-colors"
              aria-label={t('nav.search')}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher variant="dropdown" />

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 text-brand-black hover:text-brand-gold transition-colors"
              aria-label={t('nav.wishlist')}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 w-4 h-4 rounded-full bg-brand-gold text-brand-black text-[9px] font-bold flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2 text-brand-black hover:text-brand-gold transition-colors"
              aria-label={t('nav.cart')}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 w-4 h-4 rounded-full bg-brand-black text-brand-gold text-[9px] font-bold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-brand-black/10 bg-brand-cream px-6 py-6 space-y-4 animate-slide-up shadow-luxury">
            <nav className="flex flex-col space-y-3 divide-y divide-brand-black/5">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm uppercase tracking-luxury font-medium text-brand-black hover:text-brand-gold pt-3 first:pt-0 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-brand-black/10 flex flex-col gap-3">
              <a
                href={getGeneralWhatsAppUrl(language)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] text-white text-xs uppercase tracking-luxury font-medium shadow-sm hover:bg-[#1EBE5D] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {contactConfig.phoneDisplay}</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchBarModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { siteConfig } from '../config/site';

const CartContext = createContext(null);
const STORAGE_KEY = 'gamouze_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [items]);

  const addToCart = (product, volume, quantity = 1) => {
    const selectedVolume = volume || product.defaultVolume || '50ml';
    const unitPrice = product.volumePrices?.[selectedVolume] ?? product.price;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === product.id && i.volume === selectedVolume
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            volume: selectedVolume,
            price: unitPrice,
            quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId, volume) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === Number(productId) && i.volume === volume))
    );
  };

  const updateQuantity = (productId, volume, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, volume);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.productId === Number(productId) && i.volume === volume) {
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= siteConfig.shipping.freeThreshold;
  const shipping = items.length === 0 ? 0 : (isFreeShipping ? 0 : siteConfig.shipping.standardFee);
  const total = subtotal + shipping;
  const freeShippingRemaining = Math.max(0, siteConfig.shipping.freeThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        shipping,
        total,
        isFreeShipping,
        freeShippingRemaining,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};


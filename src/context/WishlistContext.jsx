import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'gamouze_wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (err) {
      console.error('Failed to save wishlist', err);
    }
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.includes(Number(productId));
  };

  const toggleWishlist = (productId) => {
    const numId = Number(productId);
    let isAdded = false;
    setWishlist((prev) => {
      if (prev.includes(numId)) {
        isAdded = false;
        return prev.filter((id) => id !== numId);
      } else {
        isAdded = true;
        return [...prev, numId];
      }
    });
    return isAdded;
  };

  const removeFromWishlist = (productId) => {
    const numId = Number(productId);
    setWishlist((prev) => prev.filter((id) => id !== numId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};


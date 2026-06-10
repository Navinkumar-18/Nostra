import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], updatedAt: null });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart({ items: [], updatedAt: null });
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await api.cart.get();
      setCart(data);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, size = null, color = null) => {
    try {
      const data = await api.cart.add(productId, quantity, size, color);
      setCart(data);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity, size = null, color = null) => {
    try {
      const data = await api.cart.update(productId, quantity, size, color);
      setCart(data);
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId, size = null, color = null) => {
    try {
      const data = await api.cart.remove(productId, size, color);
      setCart(data);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const data = await api.cart.clear();
      setCart(data);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const getItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getItemCount,
      getSubtotal,
      loadCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

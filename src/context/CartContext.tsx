import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Product, OrderItem } from '../lib/api';

interface CartContextType {
  cart: OrderItem[];
  addToCart: (product: Product | OrderItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  formatWhatsAppOrderMessage: (customerDetails?: { name?: string; phone?: string; address?: string }) => string;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<OrderItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('bhfs_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('bhfs_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product: Product | OrderItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        toast.success(`Updated ${product.name} quantity`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`Added ${product.name} to cart`);
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    toast.success('Removed item from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('bhfs_cart');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formatWhatsAppOrderMessage = (customerDetails?: {
    name?: string;
    phone?: string;
    address?: string;
  }) => {
    let text = `🌾 *BHFS - Big Heart Farmers Order* 🌾\n\n`;
    if (customerDetails?.name) {
      text += `*Customer:* ${customerDetails.name}\n`;
      text += `*Phone:* ${customerDetails.phone || 'N/A'}\n`;
      text += `*Delivery Address:* ${customerDetails.address || 'N/A'}\n\n`;
    }
    text += `*Items Ordered:*\n`;
    cart.forEach((item, idx) => {
      text += `${idx + 1}. ${item.name} x ${item.quantity} = ₹${(
        item.price * item.quantity
      ).toFixed(2)}\n`;
    });
    text += `\n*Total Order Value:* ₹${totalPrice.toFixed(2)}`;
    text += `\n*Free Farm Delivery* (if above ₹499)`;
    text += `\n\nPlease confirm my order and delivery time. Thank you!`;
    return encodeURIComponent(text);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isOpen,
    setIsOpen,
    formatWhatsAppOrderMessage,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

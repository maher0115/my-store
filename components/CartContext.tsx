"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  isCartOpen: boolean; // 👈 إضافة الحالة العالمية هنا
  setIsCartOpen: (isOpen: boolean) => void; // 👈 إضافة الدالة العالمية هنا
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // 👈 الـ State صار هون للكل

  // تحميل السلة من ذاكرة المتصفح
  useEffect(() => {
    const savedCart = localStorage.getItem("cyber_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cyber_cart", JSON.stringify(newCart));
  };

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      const updated = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updated);
    } else {
      saveCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const decreaseQuantity = (id: string) => {
    const existing = cart.find((item) => item.id === id);
    if (existing && existing.quantity > 1) {
      const updated = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
      saveCart(updated);
    } else {
      removeFromCart(id);
    }
  };

  const removeFromCart = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, decreaseQuantity, removeFromCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
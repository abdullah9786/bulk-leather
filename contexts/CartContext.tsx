"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { Product } from "@/types";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  syncWithDatabase: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadCart();
  }, [status]);

  const loadCart = () => {
    // Load from localStorage initially
    const savedCart = localStorage.getItem("bulk-leather-cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // If user is logged in, sync with database
    if (status === "authenticated" && session?.user) {
      syncFromDatabase();
    }
  };

  const syncFromDatabase = async () => {
    try {
      console.log("🔄 Syncing cart from database...");
      const response = await fetch("/api/cart");
      const data = await response.json();
      
      console.log("Cart sync response:", data);
      
      if (data.success && data.data.length > 0) {
        // Use database cart if exists
        console.log("✅ Using cart from database:", data.data.length, "items");
        setCartItems(data.data);
        localStorage.removeItem("bulk-leather-cart");
      } else {
        // Sync localStorage cart to database
        const localCart = localStorage.getItem("bulk-leather-cart");
        if (localCart) {
          const cartData = JSON.parse(localCart);
          console.log("📤 Syncing localStorage cart to database:", cartData.length, "items");
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: cartData }),
          });
          console.log("✅ Cart synced to database");
          localStorage.removeItem("bulk-leather-cart");
        } else {
          console.log("ℹ️ No cart data to sync");
        }
      }
    } catch (error) {
      console.error("❌ Error syncing cart:", error);
    }
  };

  const syncWithDatabase = async () => {
    if (status === "authenticated" && cartItems.length > 0) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: cartItems }),
        });
      } catch (error) {
        console.error("Error syncing to database:", error);
      }
    }
  };

  useEffect(() => {
    if (mounted) {
      if (status === "authenticated") {
        // Sync to database if logged in
        syncWithDatabase();
      } else {
        // Save to localStorage if not logged in
        localStorage.setItem("bulk-leather-cart", JSON.stringify(cartItems));
      }
    }
  }, [cartItems, mounted, status]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { id: product.id, product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (!mounted) {
    return null;
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}


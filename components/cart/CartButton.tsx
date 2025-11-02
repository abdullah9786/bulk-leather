"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function CartButton() {
  const { cartCount, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className="relative p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
      aria-label="Open cart"
    >
      <ShoppingCart className="w-6 h-6 text-[var(--color-text)]" />
      {cartCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-accent)] text-[var(--color-text)] rounded-full flex items-center justify-center text-xs font-bold"
        >
          {cartCount > 99 ? "99+" : cartCount}
        </motion.div>
      )}
    </button>
  );
}


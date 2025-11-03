"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, Package, CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, isCartOpen, closeCart, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-[100vh] h-[100dvh] w-full md:w-[500px] bg-[var(--color-bg)] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-[var(--color-secondary)]">
              <div>
                <h2 className="text-2xl font-serif text-[var(--color-text)]">Sample Requests</h2>
                <p className="text-sm text-[var(--color-body)]">
                  {cartCount} {cartCount === 1 ? "sample" : "samples"} selected
                </p>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
              >
                <X className="w-6 h-6 text-[var(--color-text)]" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Package className="w-20 h-20 text-[var(--color-body)]/30 mb-4" />
                  <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                    No samples selected
                  </h3>
                  <p className="text-[var(--color-body)] mb-6">
                    Add products to request samples
                  </p>
                  <Button onClick={closeCart}>
                    Browse Products
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <CartItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t-2 border-[var(--color-secondary)] p-6 bg-[var(--color-card)]">
                <div className="space-y-4">
                  <div className="bg-[var(--color-accent)]/10 rounded-lg p-4 border border-[var(--color-accent)]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-[var(--color-accent)]" />
                      <span className="font-semibold text-[var(--color-text)]">Total Samples:</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--color-text)]">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)} {cartItems.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
                    </p>
                    <p className="text-xs text-[var(--color-body)] mt-1">
                      Maximum 5 samples per request
                    </p>
                  </div>
                  
                  <div>
                    <Link href="/checkout" onClick={closeCart}>
                      <Button size="lg" className="w-full mb-3">
                        <CheckCircle className="mr-2 w-5 h-5" />
                        Checkout Now
                      </Button>
                    </Link>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full"
                      onClick={closeCart}
                    >
                      Continue Browsing
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CartItemCard({ item }: { item: any }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-4 p-4 bg-[var(--color-card)] rounded-lg border-2 border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 transition-colors"
    >
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={item.product.images[0]}
          alt={item.product.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-1 right-1 bg-[var(--color-accent)] text-[var(--color-text)] text-xs px-2 py-0.5 rounded-full font-bold">
          SAMPLE
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[var(--color-text)] text-sm mb-1 truncate">
          {item.product.name}
        </h4>
        <p className="text-xs text-[var(--color-body)] mb-2">
          {item.product.category.charAt(0).toUpperCase() + item.product.category.slice(1)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 rounded-md hover:bg-[var(--color-secondary)] transition-colors"
            >
              <Minus className="w-4 h-4 text-[var(--color-text)]" />
            </button>
            <span className="w-8 text-center font-semibold text-[var(--color-text)]">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 rounded-md hover:bg-[var(--color-secondary)] transition-colors"
            >
              <Plus className="w-4 h-4 text-[var(--color-text)]" />
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}


"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { X, UserPlus, Sparkles } from "lucide-react";
import { Button } from "./Button";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
}

export function LoginPromptModal({ isOpen, onClose, onContinueAsGuest }: LoginPromptModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[var(--color-card)] rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-[var(--color-secondary)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-body)]" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent)]/10 mb-4">
                <UserPlus className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <h3 className="text-2xl font-serif text-[var(--color-text)] mb-2">
                Sign In for Better Experience
              </h3>
              <p className="text-[var(--color-body)]">
                Track your inquiries, orders, and get personalized service
              </p>
            </div>

            <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">Benefits of signing in:</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-[var(--color-body)]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  Track all your inquiries and orders
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  Faster response times
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  Personalized recommendations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  Save your preferences
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  signIn("google", { callbackUrl: window.location.pathname });
                  onClose();
                }}
              >
                Sign In with Google
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => {
                  onClose();
                  onContinueAsGuest();
                }}
              >
                Continue as Guest
              </Button>
            </div>

            <p className="text-xs text-center text-[var(--color-body)] mt-4">
              You can submit without signing in, but we recommend it for the best experience
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


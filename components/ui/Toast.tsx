"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "success" | "error" | "info";
  title: string;
  message?: string;
  duration?: number;
}

export function Toast({ 
  isOpen, 
  onClose, 
  type = "success", 
  title, 
  message,
  duration = 5000 
}: ToastProps) {
  React.useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "bg-green-50 border-green-500 text-green-900",
    error: "bg-red-50 border-red-500 text-red-900",
    info: "bg-blue-50 border-blue-500 text-blue-900",
  };

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-4 left-0 right-0 z-[999] flex justify-center px-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="w-full max-w-md pointer-events-auto"
          >
            <div className={`${colors[type]} border-2 rounded-xl shadow-2xl p-4`}>
            <div className="flex items-start gap-3">
              <Icon className={`w-6 h-6 ${iconColors[type]} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{title}</h4>
                {message && (
                  <p className="text-sm opacity-90">{message}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-black/10 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


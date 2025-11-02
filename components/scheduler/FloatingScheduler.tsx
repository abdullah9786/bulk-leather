"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X } from "lucide-react";
import { SchedulerModal } from "./SchedulerModal";

export function FloatingScheduler() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && !isModalOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[var(--color-accent)] text-[var(--color-text)] px-6 py-4 rounded-full shadow-2xl hover:shadow-[0_8px_30px_var(--color-glow)] transition-all font-semibold"
            aria-label="Schedule a meeting"
          >
            <Calendar className="w-5 h-5" />
            <span className="hidden sm:inline">Schedule Meeting</span>
          </motion.button>
        )}
      </AnimatePresence>

      <SchedulerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}


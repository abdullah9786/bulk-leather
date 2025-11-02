"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -8, boxShadow: "0 12px 40px var(--color-glow)" } : {}}
      className={cn(
        "bg-[var(--color-card)] rounded-2xl p-6 transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
};


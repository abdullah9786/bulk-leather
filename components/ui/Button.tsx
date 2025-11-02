"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyles = "font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center";
  
  const variants = {
    primary: "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-text)] hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] text-[var(--color-text)] hover:shadow-md",
    outline: "border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text)]",
    ghost: "text-[var(--color-body)] hover:text-[var(--color-accent)] hover:bg-[var(--color-secondary)]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};


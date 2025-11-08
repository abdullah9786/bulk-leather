"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, helperText, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full px-4 py-3 rounded-lg border-2 border-[var(--color-secondary)] bg-[var(--color-card)] text-[var(--color-text)] transition-all duration-300 resize-none",
          "focus:border-[var(--color-accent)] focus:outline-none focus:ring-4 focus:ring-[var(--color-glow)]",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-[var(--color-body)] opacity-70">{helperText}</p>}
    </div>
  );
};


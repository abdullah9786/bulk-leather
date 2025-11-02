"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full px-4 py-3 rounded-lg border-2 border-[var(--color-secondary)] bg-[var(--color-card)] text-[var(--color-text)] transition-all duration-300",
          "focus:border-[var(--color-accent)] focus:outline-none focus:ring-4 focus:ring-[var(--color-glow)]",
          error && "border-red-500",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};


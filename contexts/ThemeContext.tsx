"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeType } from "@/types";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themeConfig = {
  luxurySand: {
    name: "Luxury Sand",
    bg: "#FAF8F5",
    secondary: "#EFE7DD",
    text: "#3A2D28",
    body: "#6C5F57",
    accent: "#D6A76C",
    accentHover: "#C89654",
    card: "#FFFFFF",
    glow: "rgba(214,167,108,0.35)",
  },
  darkElegance: {
    name: "Dark Elegance",
    bg: "#1A1816",
    secondary: "#2C2824",
    text: "#F5F1EA",
    body: "#D4CFC6",
    accent: "#D6A76C",
    accentHover: "#E8BC7E",
    card: "#252220",
    glow: "rgba(214,167,108,0.25)",
  },
  warmEarth: {
    name: "Warm Earthy Craftsmanship",
    bg: "#2C1810",
    secondary: "#3E2415",
    text: "#F2E8DC",
    body: "#C9B8A6",
    accent: "#D6A76C",
    accentHover: "#E8BC7E",
    card: "#362318",
    glow: "rgba(214,167,108,0.30)",
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>("luxurySand");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("bulk-leather-theme") as ThemeType;
    if (savedTheme && themeConfig[savedTheme]) {
      setThemeState(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem("bulk-leather-theme", newTheme);
  };

  useEffect(() => {
    if (!mounted) return;
    
    const colors = themeConfig[theme];
    const root = document.documentElement;
    
    root.style.setProperty("--color-bg", colors.bg);
    root.style.setProperty("--color-secondary", colors.secondary);
    root.style.setProperty("--color-text", colors.text);
    root.style.setProperty("--color-body", colors.body);
    root.style.setProperty("--color-accent", colors.accent);
    root.style.setProperty("--color-accent-hover", colors.accentHover);
    root.style.setProperty("--color-card", colors.card);
    root.style.setProperty("--color-glow", colors.glow);
  }, [theme, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}


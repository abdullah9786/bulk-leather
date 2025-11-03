"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Palette, ChevronDown } from "lucide-react";
import { useTheme, themeConfig } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeType } from "@/types";
import { CartButton } from "@/components/cart/CartButton";
import { UserMenu } from "./UserMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/customization", label: "Customization" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface Category {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description: string;
}

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const themeMenuRef = React.useRef<HTMLDivElement>(null);
  const categoriesMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Close theme menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setThemeMenuOpen(false);
      }
    }

    if (themeMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [themeMenuOpen]);

  // Categories menu is now controlled by hover, no click-outside needed

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?isActive=true");
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const themes: { key: ThemeType; name: string }[] = [
    { key: "luxurySand", name: themeConfig.luxurySand.name },
    { key: "darkElegance", name: themeConfig.darkElegance.name },
    { key: "warmEarth", name: themeConfig.warmEarth.name },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-card)] shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold font-serif text-[var(--color-text)]"
            >
              Bulk<span className="text-[var(--color-accent)]">Leather</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Home */}
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors duration-300 hover:text-[var(--color-accent)]",
                pathname === "/"
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-body)]"
              )}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div 
              className="relative" 
              ref={categoriesMenuRef}
              onMouseEnter={() => setCategoriesMenuOpen(true)}
              onMouseLeave={() => setCategoriesMenuOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-sm font-medium text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors"
              >
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {categoriesMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-64 bg-[var(--color-card)] rounded-lg shadow-xl border-2 border-[var(--color-secondary)] p-2"
                  >
                    {categories.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-[var(--color-body)]">
                        Loading...
                      </div>
                    ) : (
                      categories.map((category) => (
                        <Link
                          key={category._id || category.id}
                          href={`/products?category=${category.slug}`}
                          onClick={() => setCategoriesMenuOpen(false)}
                          className="block px-4 py-2 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm"
                        >
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xs text-[var(--color-body)] mt-0.5">
                            {category.description}
                          </div>
                        </Link>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Nav Links */}
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300 hover:text-[var(--color-accent)]",
                  pathname === link.href
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-body)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu, Cart, Theme Switcher & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <UserMenu />

            {/* Cart Button */}
            <CartButton />

            {/* Theme Switcher */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
                aria-label="Change theme"
              >
                <Palette className="w-5 h-5 text-[var(--color-accent)]" />
              </button>

              <AnimatePresence>
                {themeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-[var(--color-card)] rounded-lg shadow-xl border-2 border-[var(--color-secondary)] p-2"
                  >
                    {themes.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => {
                          setTheme(t.key);
                          setThemeMenuOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 rounded-lg transition-colors text-sm",
                          theme === t.key
                            ? "bg-[var(--color-accent)] text-[var(--color-text)] font-semibold"
                            : "hover:bg-[var(--color-secondary)] text-[var(--color-body)]"
                        )}
                      >
                        {t.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[var(--color-text)]" />
              ) : (
                <Menu className="w-6 h-6 text-[var(--color-text)]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4"
            >
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-2 rounded-lg transition-colors font-medium",
                      pathname === link.href
                        ? "bg-[var(--color-accent)] text-[var(--color-text)]"
                        : "hover:bg-[var(--color-secondary)] text-[var(--color-body)]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Categories in Mobile Menu */}
                <div className="border-t border-[var(--color-secondary)] pt-3 mt-2">
                  <div className="px-4 py-2 text-xs font-semibold text-[var(--color-accent)] uppercase">
                    Categories
                  </div>
                  {categories.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-[var(--color-body)]">
                      Loading categories...
                    </div>
                  ) : (
                    categories.map((category) => (
                      <Link
                        key={category._id || category.id}
                        href={`/products?category=${category.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-body)] transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};


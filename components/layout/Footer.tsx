"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[var(--color-secondary)] mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold font-serif text-[var(--color-text)] mb-4">
              Bulk<span className="text-[var(--color-accent)]">Leather</span>
            </h3>
            <p className="text-[var(--color-body)] text-sm leading-relaxed">
              Premium wholesale leather goods for retailers, distributors, and resellers worldwide. 
              Craftsmanship meets quality.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-[var(--color-text)] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/customization" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                  Customization
                </Link>
              </li>
              <li>
                <Link href="/schedule-meeting" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                  Schedule Meeting
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-[var(--color-text)] mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=bags" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                  Bags
                </Link>
              </li>
              <li>
                <Link href="/products?category=jackets" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                  Jackets
                </Link>
              </li>
              <li>
                <Link href="/products?category=wallets" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                  Wallets
                </Link>
              </li>
              <li>
                <Link href="/products?category=belts" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                  Belts
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-[var(--color-text)] mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--color-body)]">
                  123 Leather District, Industrial Area<br />
                  Manufacturing Hub, IN 456789
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="w-5 h-5 text-[var(--color-accent)]" />
                <a href="tel:+1234567890" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail className="w-5 h-5 text-[var(--color-accent)]" />
                <a href="mailto:inquiry@houseoflamode.com.com" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors">
                  inquiry@houseoflamode.com.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--color-body)]/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[var(--color-body)] text-sm">
              © {new Date().getFullYear()} BulkLeather. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors text-sm">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ShoppingBag, ChevronDown, Mail, Calendar } from "lucide-react";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("👤 UserMenu - Auth status:", status);
    if (session) {
      console.log("✅ Session active:", session.user?.email);
      console.log("User role:", (session.user as any)?.role);
    }
  }, [status, session]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [menuOpen]);

  if (status === "loading") {
    console.log("⏳ Loading session...");
    return (
      <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] animate-pulse" />
    );
  }

  if (!session) {
    console.log("🔓 No session - showing Sign In button");
    return (
      <button
        onClick={() => {
          console.log("🚀 Sign In button clicked");
          signIn("google");
        }}
        className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-text)] rounded-lg transition-colors font-medium text-sm"
      >
        Sign In
      </button>
    );
  }

  console.log("✅ Showing user menu for:", session.user?.email);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
          <span className="text-[var(--color-text)] font-semibold text-sm">
            {session.user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-[var(--color-body)]" />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-64 bg-[var(--color-card)] rounded-lg shadow-xl border-2 border-[var(--color-secondary)] p-2 z-50"
          >
            <div className="px-4 py-3 border-b border-[var(--color-secondary)]">
              <p className="font-semibold text-[var(--color-text)] text-sm truncate">
                {session.user?.name}
              </p>
              <p className="text-xs text-[var(--color-body)] truncate">
                {session.user?.email}
              </p>
            </div>

            <div className="py-2">
              <a
                href="/my-orders"
                className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-secondary)] rounded-lg transition-colors text-sm text-[var(--color-body)]"
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingBag className="w-4 h-4" />
                My Orders
              </a>
              <a
                href="/my-enquiries"
                className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-secondary)] rounded-lg transition-colors text-sm text-[var(--color-body)]"
                onClick={() => setMenuOpen(false)}
              >
                <Mail className="w-4 h-4" />
                My Enquiries
              </a>
              <a
                href="/my-meetings"
                className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-secondary)] rounded-lg transition-colors text-sm text-[var(--color-body)]"
                onClick={() => setMenuOpen(false)}
              >
                <Calendar className="w-4 h-4" />
                My Meetings
              </a>
            </div>

            <div className="border-t border-[var(--color-secondary)] pt-2">
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors text-sm text-red-600 w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


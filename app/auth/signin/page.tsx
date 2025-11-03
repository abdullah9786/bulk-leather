"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Chrome, ArrowLeft, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      console.log("🚀 Starting Google sign-in...");
      console.log("Callback URL:", callbackUrl);
      console.log("Environment check:");
      console.log("- NEXTAUTH_URL:", process.env.NEXT_PUBLIC_APP_URL);
      console.log("- Google Provider configured:", !!process.env.GOOGLE_CLIENT_ID);
      
      setLoading(true);
      setError("");
      
      // Call signIn - it will redirect, so result might be undefined
      await signIn("google", { 
        callbackUrl,
        redirect: true,
      });
      
      // This line may not execute due to redirect
      console.log("✅ Redirect initiated (if you see this, redirect failed)");
    } catch (err: any) {
      console.error("❌ Sign in exception:", err);
      console.error("Error stack:", err.stack);
      setError(err.message || "Sign in failed. Check console for details.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-secondary)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[var(--color-card)] rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-serif text-[var(--color-text)] mb-2">
              Bulk<span className="text-[var(--color-accent)]">Leather</span>
            </h1>
            <p className="text-[var(--color-body)]">Sign in to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-600">Sign In Failed</p>
                <p className="text-xs text-red-500 mt-1">{error}</p>
                <p className="text-xs text-red-500 mt-1">Check browser console for details</p>
              </div>
            </div>
          )}

          {/* Sign In Options */}
          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <Chrome className="mr-2 w-5 h-5" />
                  Continue with Google
                </>
              )}
            </Button>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-[var(--color-secondary)] rounded-lg">
            <p className="text-sm text-[var(--color-body)] text-center">
              Sign in required to checkout and track your sample orders
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[var(--color-body)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


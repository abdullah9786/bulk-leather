"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Home } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration. Check Google OAuth settings.",
    AccessDenied: "You denied access to your Google account.",
    Verification: "The verification token has expired or already been used.",
    OAuthSignin: "Error starting OAuth sign in. Check your Google OAuth configuration.",
    OAuthCallback: "Error in OAuth callback. Check redirect URI in Google Console.",
    OAuthCreateAccount: "Could not create account. Check database connection.",
    EmailCreateAccount: "Could not create account with that email.",
    Callback: "Error in callback handler.",
    OAuthAccountNotLinked: "Account already exists with a different provider.",
    EmailSignin: "Check your email address.",
    CredentialsSignin: "Sign in failed. Check your credentials.",
    SessionRequired: "Session required. Please sign in.",
    Default: "An error occurred during sign in.",
  };

  const errorMessage = error ? (errorMessages[error] || errorMessages.Default) : errorMessages.Default;

  console.error("🚨 NextAuth Error Page:");
  console.error("Error code:", error);
  console.error("Error message:", errorMessage);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-secondary)] px-4">
      <div className="max-w-md w-full bg-[var(--color-card)] rounded-2xl shadow-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold font-serif text-[var(--color-text)] mb-4">
          Sign In Error
        </h1>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-600 font-semibold mb-2">
            Error Code: {error || "Unknown"}
          </p>
          <p className="text-sm text-red-700">
            {errorMessage}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-xs text-blue-700 mb-2">
            <strong>Common Fixes:</strong>
          </p>
          <ul className="text-xs text-blue-600 text-left space-y-1">
            <li>• Check .env.local has all Google OAuth variables</li>
            <li>• Verify redirect URI in Google Console</li>
            <li>• Restart dev server after env changes</li>
            <li>• Check browser console (F12) for details</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Link href="/auth/signin" className="flex-1">
            <Button variant="outline" className="w-full">
              Try Again
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full">
              <Home className="mr-2 w-4 h-4" />
              Go Home
            </Button>
          </Link>
        </div>

        <p className="text-xs text-[var(--color-body)] mt-6">
          Need help? Check <strong>GOOGLE_OAUTH_SETUP.md</strong> for setup guide
        </p>
      </div>
    </div>
  );
}


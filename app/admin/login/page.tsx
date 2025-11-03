"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, AlertCircle, Database } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [setupRunning, setSetupRunning] = useState(false);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const response = await fetch("/api/setup");
      const data = await response.json();
      setSetupNeeded(data.setupNeeded);
    } catch (error) {
      console.error("Error checking setup:", error);
    }
  };

  const runSetup = async () => {
    setSetupRunning(true);
    setError("");

    try {
      const response = await fetch("/api/setup", { method: "POST" });
      const data = await response.json();

      if (data.success) {
        alert("✅ Setup completed! You can now login with:\n\nEmail: admin@bulkleather.com\nPassword: admin123");
        setSetupNeeded(false);
        setFormData({
          email: "admin@bulkleather.com",
          password: "admin123",
        });
      } else {
        setError(data.error || "Setup failed");
      }
    } catch (error: any) {
      setError("Setup failed. Check your MongoDB connection in .env.local");
    } finally {
      setSetupRunning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and user data
      localStorage.setItem("admin-token", data.token);
      localStorage.setItem("admin-user", JSON.stringify(data.user));

      // Redirect to dashboard
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bulk<span className="text-amber-600">Leather</span>
            </h1>
            <p className="text-gray-500">Admin Dashboard Login</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="admin@bulkleather.com"
              />
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="mr-2 w-5 h-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Setup Notice */}
          {setupNeeded && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-800 mb-2">
                    First Time Setup Required
                  </p>
                  <p className="text-xs text-blue-700 mb-3">
                    Database is empty. Click below to create admin user and import initial data.
                  </p>
                  <Button
                    size="sm"
                    onClick={runSetup}
                    disabled={setupRunning}
                    className="w-full"
                  >
                    {setupRunning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Running Setup...
                      </>
                    ) : (
                      <>
                        <Database className="mr-2 w-4 h-4" />
                        Run Initial Setup
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Demo Credentials */}
          {!setupNeeded && (
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs font-semibold text-amber-800 mb-2">Default Credentials:</p>
              <p className="text-xs text-amber-700">Email: admin@bulkleather.com</p>
              <p className="text-xs text-amber-700">Password: admin123</p>
            </div>
          )}

          {/* Back to Site */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-amber-600 transition-colors"
            >
              ← Back to Main Site
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


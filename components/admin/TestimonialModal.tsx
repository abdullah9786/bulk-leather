"use client";

import React, { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  testimonial?: any;
  mode: "add" | "edit";
}

export function TestimonialModal({ isOpen, onClose, onSuccess, testimonial, mode }: TestimonialModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    role: "",
    content: "",
    avatar: "",
    rating: 5,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testimonial && mode === "edit") {
      setFormData({
        name: testimonial.name || "",
        company: testimonial.company || "",
        role: testimonial.role || "",
        content: testimonial.content || "",
        avatar: testimonial.avatar || "",
        rating: testimonial.rating || 5,
        isActive: testimonial.isActive !== false,
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        company: "",
        role: "",
        content: "",
        avatar: "",
        rating: 5,
        isActive: true,
      });
    }
  }, [testimonial, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin-token");
      const testimonialData = {
        name: formData.name,
        company: formData.company,
        role: formData.role,
        content: formData.content,
        avatar: formData.avatar || undefined,
        rating: formData.rating,
        isActive: formData.isActive,
      };

      const url = mode === "edit" ? `/api/testimonials/${testimonial._id}` : "/api/testimonials";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(testimonialData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save testimonial");
      }

      alert(mode === "edit" ? "Testimonial updated successfully!" : "Testimonial created successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Failed to save testimonial");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "edit" ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="ABC Corporation"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role/Title *
            </label>
            <Input
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="CEO / Procurement Manager"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testimonial Content *
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your experience..."
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar URL (Optional)
            </label>
            <Input
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
              type="url"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty for default avatar
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= formData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating} {formData.rating === 1 ? "star" : "stars"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active (Show on website)
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Saving..." : mode === "edit" ? "Update Testimonial" : "Create Testimonial"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


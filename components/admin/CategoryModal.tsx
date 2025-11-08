"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: any;
  mode: "add" | "edit";
}

export function CategoryModal({ isOpen, onClose, onSuccess, category, mode }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    isActive: true,
    metaTitle: "",
    metaDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");
  const [showRedirectOption, setShowRedirectOption] = useState(false);
  const [createRedirect, setCreateRedirect] = useState(true);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  // Reset form when modal closes or opens
  useEffect(() => {
    if (isOpen) {
      if (category && mode === "edit") {
        // Populate form with category data
        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
          image: category.image || "",
          isActive: category.isActive !== false,
          metaTitle: category.metaTitle || "",
          metaDescription: category.metaDescription || "",
        });
        setOriginalSlug(category.slug || "");
        setSlugTouched(false); // Allow auto-generation even when editing
        setShowRedirectOption(false);
      } else {
        // Reset form for add mode
        resetForm();
      }
    }
  }, [isOpen, category, mode]);

  // Auto-generate slug when name changes (only if slug hasn't been manually edited)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const newSlug = slugTouched ? formData.slug : generateSlug(newName);
    
    setFormData(prev => ({
      ...prev,
      name: newName,
      slug: newSlug
    }));
    
    // Show redirect option if editing and slug has changed
    if (mode === "edit" && originalSlug && newSlug !== originalSlug && !slugTouched) {
      setShowRedirectOption(true);
    } else if (newSlug === originalSlug) {
      setShowRedirectOption(false);
    }
  };

  // Mark slug as manually touched
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugTouched(true);
    const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({
      ...prev,
      slug: newSlug
    }));
    
    // Show redirect option if editing and slug has changed
    if (mode === "edit" && originalSlug && newSlug !== originalSlug) {
      setShowRedirectOption(true);
    } else {
      setShowRedirectOption(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin-token");
      const url = mode === "edit" ? `/api/categories/${category._id}` : "/api/categories";
      const method = mode === "edit" ? "PUT" : "POST";

      // Prepare payload
      const payload: any = { ...formData };
      
      // If slug changed and redirect option is shown, include redirect flag
      if (showRedirectOption && createRedirect && originalSlug !== formData.slug) {
        payload.createRedirect = true;
        payload.oldSlug = originalSlug;
      }

      console.log("📤 Sending category data:", payload);
      console.log("🔍 SEO Meta Title being sent:", payload.metaTitle);
      console.log("🔍 SEO Meta Description being sent:", payload.metaDescription);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        if (showRedirectOption && createRedirect) {
          alert(`Category updated successfully! Redirect created from "${originalSlug}" to "${formData.slug}"`);
        }
        onSuccess();
        onClose();
        resetForm();
      } else {
        alert(`Error: ${responseData.error || "Failed to save category"}`);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
      isActive: true,
      metaTitle: "",
      metaDescription: "",
    });
    setSlugTouched(false);
    setOriginalSlug("");
    setShowRedirectOption(false);
    setCreateRedirect(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto my-4 md:my-8 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "add" ? "Add New Category" : "Edit Category"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name *"
            value={formData.name}
            onChange={handleNameChange}
            required
            placeholder="Bags"
          />

          <div>
            <Input
              label="Slug *"
              value={formData.slug}
              onChange={handleSlugChange}
              required
              placeholder="bags"
              helperText="URL-friendly version of name (auto-generated)"
            />
            
            {showRedirectOption && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="createRedirect"
                    checked={createRedirect}
                    onChange={(e) => setCreateRedirect(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor="createRedirect" className="text-sm font-medium text-blue-900 cursor-pointer">
                      Create redirect from old URL
                    </label>
                    <p className="text-xs text-blue-700 mt-1">
                      Automatically redirect <span className="font-mono bg-blue-100 px-1 rounded">/categories/{originalSlug}</span> to <span className="font-mono bg-blue-100 px-1 rounded">/categories/{formData.slug}</span>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      ✓ Recommended to prevent broken links and maintain SEO
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Textarea
            label="Description *"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
            placeholder="Premium leather bags for every occasion..."
          />

          <Input
            label="Image URL *"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
            placeholder="https://images.unsplash.com/photo-xxx"
          />

          {/* SEO Fields */}
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">SEO Settings (Optional)</h3>
            
            <Input
              label="Meta Title"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="Custom SEO title (defaults to category name)"
              helperText={`${formData.metaTitle.length}/60 characters. Leave empty to use category name.`}
              maxLength={60}
            />

            <Textarea
              label="Meta Description"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              rows={3}
              placeholder="Custom SEO description (defaults to category description)"
              helperText={`${formData.metaDescription.length}/160 characters. Leave empty to use category description.`}
              maxLength={160}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active (visible on website)
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Saving..." : mode === "add" ? "Add Category" : "Update Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


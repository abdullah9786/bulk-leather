"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
  mode: "add" | "edit";
}

export function ProductModal({ isOpen, onClose, onSuccess, product, mode }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    description: "",
    material: "",
    images: "",
    moq: "",
    priceRange: "",
    samplePrice: "",
    features: "",
    colors: "",
    sizes: "",
    isActive: true,
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

  // Define resetForm before useEffect
  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      category: "",
      description: "",
      material: "",
      images: "",
      moq: "",
      priceRange: "",
      samplePrice: "",
      features: "",
      colors: "",
      sizes: "",
      isActive: true,
    });
    setSlugTouched(false);
    setOriginalSlug("");
    setShowRedirectOption(false);
    setCreateRedirect(true);
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (product && mode === "edit") {
        // Auto-generate slug if product doesn't have one
        const productSlug = product.slug || generateSlug(product.name);
        
        // Populate form with product data
        setFormData({
          name: product.name || "",
          slug: productSlug,
          category: product.category || "",
          description: product.description || "",
          material: product.material || "",
          images: product.images?.join("\n") || "",
          moq: product.moq?.toString() || "",
          priceRange: product.priceRange || "",
          samplePrice: product.samplePrice?.toString() || "",
          features: product.features?.join("\n") || "",
          colors: product.colors?.join(", ") || "",
          sizes: product.sizes?.join(", ") || "",
          isActive: product.isActive !== false,
        });
        setOriginalSlug(product.slug || "");
        setSlugTouched(false);
        setShowRedirectOption(false);
      } else {
        // Reset form for add mode
        resetForm();
      }
    }
  }, [isOpen, product, mode]);

  // Auto-generate slug when name changes
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
      const productData: any = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        description: formData.description,
        material: formData.material,
        images: formData.images.split("\n").map(img => img.trim()).filter(Boolean),
        moq: parseInt(formData.moq),
        priceRange: formData.priceRange,
        samplePrice: formData.samplePrice ? parseFloat(formData.samplePrice) : 0,
        features: formData.features.split("\n").map(f => f.trim()).filter(Boolean),
        colors: formData.colors.split(",").map(c => c.trim()).filter(Boolean),
        sizes: formData.sizes ? formData.sizes.split(",").map(s => s.trim()).filter(Boolean) : undefined,
        isActive: formData.isActive,
      };

      // If slug changed and redirect option is shown, include redirect flag
      if (showRedirectOption && createRedirect && originalSlug !== formData.slug) {
        productData.createRedirect = true;
        productData.oldSlug = originalSlug;
      }
      
      console.log("📤 Sending product data:", productData);
      console.log("💰 Sample Price being sent:", productData.samplePrice);

      const url = mode === "edit" ? `/api/products/${product._id}` : "/api/products";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();
      console.log("📥 API Response:", responseData);
      console.log("💰 Sample Price in response:", responseData.data?.samplePrice);

      if (response.ok) {
        if (showRedirectOption && createRedirect) {
          alert(`Product updated successfully! Redirect created from "${originalSlug}" to "${formData.slug}"`);
        }
        onSuccess();
        onClose();
        resetForm();
      } else {
        alert(`Error: ${responseData.error || "Failed to save product"}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[95vh] overflow-y-auto my-4 md:my-8 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name *"
              value={formData.name}
              onChange={handleNameChange}
              required
              placeholder="Executive Leather Briefcase"
            />
            <Select
              label="Category *"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: "bags", label: "Bags" },
                { value: "jackets", label: "Jackets" },
                { value: "wallets", label: "Wallets" },
                { value: "belts", label: "Belts" },
                { value: "accessories", label: "Accessories" },
              ]}
            />
          </div>

          <Input
            label="URL Slug *"
            value={formData.slug}
            onChange={handleSlugChange}
            required
            placeholder="executive-leather-briefcase"
            helperText="Auto-generated from product name. Used in URL: /products/your-slug"
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
                    Automatically redirect <span className="font-mono bg-blue-100 px-1 rounded">/products/{originalSlug}</span> to <span className="font-mono bg-blue-100 px-1 rounded">/products/{formData.slug}</span>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    ✓ Recommended to prevent broken links and maintain SEO
                  </p>
                </div>
              </div>
            </div>
          )}

          <Textarea
            label="Description *"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
            placeholder="Premium full-grain leather briefcase..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Material *"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              required
              placeholder="Full-Grain Italian Leather"
            />
            <Input
              label="Price Range *"
              value={formData.priceRange}
              onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
              required
              placeholder="$85 - $120"
            />
            <Input
              label="Sample Price"
              type="number"
              value={formData.samplePrice}
              onChange={(e) => setFormData({ ...formData, samplePrice: e.target.value })}
              placeholder="25.00"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="MOQ (Minimum Order Quantity) *"
              type="number"
              value={formData.moq}
              onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
              required
              min="1"
              placeholder="50"
            />
            <Input
              label="Colors (comma separated) *"
              value={formData.colors}
              onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
              required
              placeholder="Black, Brown, Tan"
            />
          </div>

          <Input
            label="Sizes (comma separated, optional)"
            value={formData.sizes}
            onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
            placeholder="S, M, L, XL"
          />

          <Textarea
            label="Image URLs (one per line) *"
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            required
            rows={3}
            placeholder="https://images.unsplash.com/photo-xxx"
          />

          <Textarea
            label="Features (one per line) *"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            required
            rows={4}
            placeholder="Full-grain Italian leather\nMultiple compartments\nBrass hardware"
          />

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
              {loading ? "Saving..." : mode === "add" ? "Add Product" : "Update Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


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
    category: "",
    description: "",
    material: "",
    images: "",
    moq: "",
    priceRange: "",
    features: "",
    colors: "",
    sizes: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        description: product.description || "",
        material: product.material || "",
        images: product.images?.join("\n") || "",
        moq: product.moq?.toString() || "",
        priceRange: product.priceRange || "",
        features: product.features?.join("\n") || "",
        colors: product.colors?.join(", ") || "",
        sizes: product.sizes?.join(", ") || "",
        isActive: product.isActive !== false,
      });
    }
  }, [product, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin-token");
      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        material: formData.material,
        images: formData.images.split("\n").map(img => img.trim()).filter(Boolean),
        moq: parseInt(formData.moq),
        priceRange: formData.priceRange,
        features: formData.features.split("\n").map(f => f.trim()).filter(Boolean),
        colors: formData.colors.split(",").map(c => c.trim()).filter(Boolean),
        sizes: formData.sizes ? formData.sizes.split(",").map(s => s.trim()).filter(Boolean) : undefined,
        isActive: formData.isActive,
      };

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

      if (response.ok) {
        onSuccess();
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to save product"}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      material: "",
      images: "",
      moq: "",
      priceRange: "",
      features: "",
      colors: "",
      sizes: "",
      isActive: true,
    });
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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


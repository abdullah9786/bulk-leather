"use client";

import { useState, useEffect } from "react";
import { XCircle, Upload, Image as ImageIcon, Video } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { IGallery } from "@/models/Gallery";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item?: IGallery | null;
}

export function GalleryModal({ isOpen, onClose, onSuccess, item }: GalleryModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaType: "image" as "image" | "video",
    mediaUrl: "",
    thumbnailUrl: "",
    category: "other" as "factory-tour" | "manufacturing" | "workers" | "products" | "other",
    tags: "",
    isActive: true,
    displayOrder: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description || "",
        mediaType: item.mediaType,
        mediaUrl: item.mediaUrl,
        thumbnailUrl: item.thumbnailUrl || "",
        category: item.category,
        tags: item.tags?.join(", ") || "",
        isActive: item.isActive,
        displayOrder: item.displayOrder || 0,
      });
    } else {
      // Reset form for new item
      setFormData({
        title: "",
        description: "",
        mediaType: "image",
        mediaUrl: "",
        thumbnailUrl: "",
        category: "other",
        tags: "",
        isActive: true,
        displayOrder: 0,
      });
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("admin-token");
      const payload: any = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      };

      // Remove thumbnailUrl if it's empty
      if (!payload.thumbnailUrl || payload.thumbnailUrl.trim() === "") {
        delete payload.thumbnailUrl;
      }

      const url = item
        ? `/api/gallery/${item._id}`
        : "/api/gallery";

      const method = item ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save gallery item");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto my-4 md:my-8 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {item ? "Edit Gallery Item" : "Add Gallery Item"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Upload images or videos to showcase your factory and processes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mediaType: "image" })}
                className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                  formData.mediaType === "image"
                    ? "border-amber-600 bg-amber-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <ImageIcon className={`w-5 h-5 ${
                  formData.mediaType === "image" ? "text-amber-600" : "text-gray-400"
                }`} />
                <span className={`font-medium ${
                  formData.mediaType === "image" ? "text-amber-900" : "text-gray-700"
                }`}>
                  Image
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mediaType: "video" })}
                className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                  formData.mediaType === "video"
                    ? "border-amber-600 bg-amber-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Video className={`w-5 h-5 ${
                  formData.mediaType === "video" ? "text-amber-600" : "text-gray-400"
                }`} />
                <span className={`font-medium ${
                  formData.mediaType === "video" ? "text-amber-900" : "text-gray-700"
                }`}>
                  Video
                </span>
              </button>
            </div>
          </div>

          {/* Title */}
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="e.g., Leather Cutting Process"
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Brief description of the media"
            />
          </div>

          {/* Category */}
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            options={[
              { value: "factory-tour", label: "Factory Tour" },
              { value: "manufacturing", label: "Manufacturing Process" },
              { value: "workers", label: "Workers & Skills" },
              { value: "products", label: "Products" },
              { value: "other", label: "Other" },
            ]}
            required
          />

          {/* Media URL */}
          <Input
            label={`${formData.mediaType === "image" ? "Image" : "Video"} URL`}
            type="url"
            value={formData.mediaUrl}
            onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
            required
            placeholder="https://example.com/media.jpg"
          />

          {/* Thumbnail URL (for videos) */}
          {formData.mediaType === "video" && (
            <Input
              label="Thumbnail URL (Optional)"
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              placeholder="https://example.com/thumbnail.jpg"
              helperText="Provide a thumbnail image for the video"
            />
          )}

          {/* Tags */}
          <Input
            label="Tags (Optional)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="leather, manufacturing, quality"
            helperText="Separate tags with commas"
          />

          {/* Display Order */}
          <Input
            label="Display Order"
            type="number"
            value={formData.displayOrder}
            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
            placeholder="0"
            helperText="Lower numbers appear first"
          />

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Show in gallery (active)
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Saving..." : item ? "Update Item" : "Add Item"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


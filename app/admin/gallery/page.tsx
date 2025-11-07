"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GalleryModal } from "@/components/admin/GalleryModal";
import { IGallery } from "@/models/Gallery";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<IGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IGallery | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string>("all");

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/gallery?admin=true");
      const data = await response.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchItems();
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete item");
    }
  };

  const handleToggleActive = async (item: IGallery) => {
    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch(`/api/gallery/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !item.isActive }),
      });

      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error("Toggle active error:", error);
    }
  };

  // Filtering logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesMediaType = mediaTypeFilter === "all" || item.mediaType === mediaTypeFilter;

      return matchesSearch && matchesCategory && matchesMediaType;
    });
  }, [items, searchQuery, categoryFilter, mediaTypeFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: items.length,
    images: items.filter(i => i.mediaType === "image").length,
    videos: items.filter(i => i.mediaType === "video").length,
    active: items.filter(i => i.isActive).length,
  }), [items]);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      "factory-tour": "Factory Tour",
      "manufacturing": "Manufacturing",
      "workers": "Workers",
      "products": "Products",
      "other": "Other",
    };
    return labels[cat] || cat;
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
        <p className="text-gray-600">Manage your factory images and videos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total Items</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Images</p>
          <p className="text-3xl font-bold text-blue-900">{stats.images}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600 mb-1">Videos</p>
          <p className="text-3xl font-bold text-purple-900">{stats.videos}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-900">{stats.active}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="factory-tour">Factory Tour</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="workers">Workers & Skills</option>
            <option value="products">Products</option>
            <option value="other">Other</option>
          </select>

          {/* Media Type Filter */}
          <select
            value={mediaTypeFilter}
            onChange={(e) => setMediaTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Media Types</option>
            <option value="image">Images Only</option>
            <option value="video">Videos Only</option>
          </select>
        </div>

        {(searchQuery || categoryFilter !== "all" || mediaTypeFilter !== "all") && (
          <div className="mt-4 flex items-center gap-2">
            <p className="text-sm text-gray-600">
              Showing {filteredItems.length} of {items.length} items
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setMediaTypeFilter("all");
              }}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Add New Button */}
      <div className="mb-6">
        <Button
          onClick={() => {
            setSelectedItem(null);
            setModalOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </Button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || categoryFilter !== "all" || mediaTypeFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by adding your first gallery item"}
          </p>
          {items.length === 0 && (
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add First Item
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Media Preview */}
              <div className="relative aspect-video bg-gray-100">
                {item.mediaType === "image" ? (
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Video className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 rounded-full p-4">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Media Type Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    item.mediaType === "image"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {item.mediaType === "image" ? (
                      <ImageIcon className="w-3 h-3" />
                    ) : (
                      <Video className="w-3 h-3" />
                    )}
                    {item.mediaType}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {item.description || "No description"}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded">
                  {getCategoryLabel(item.category)}
                </span>
                {item.displayOrder != null && item.displayOrder > 0 && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    Order: {item.displayOrder}
                  </span>
                )}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className="flex-1 py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    title={item.isActive ? "Hide from gallery" : "Show in gallery"}
                  >
                    {item.isActive ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span className="text-sm">Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Show</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setModalOpen(true);
                    }}
                    className="py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="py-2 px-3 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        onSuccess={fetchItems}
        item={selectedItem}
      />
    </div>
  );
}


"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Image as ImageIcon, 
  Video, 
  Play, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Grid3x3,
  List
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IGallery } from "@/models/Gallery";

export default function GalleryPage() {
  const [items, setItems] = useState<IGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<IGallery | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/gallery");
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

  // Filtering logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesMediaType = mediaTypeFilter === "all" || item.mediaType === mediaTypeFilter;
      return matchesCategory && matchesMediaType;
    });
  }, [items, categoryFilter, mediaTypeFilter]);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      "factory-tour": "Factory Tour",
      "manufacturing": "Manufacturing Process",
      "workers": "Workers & Skills",
      "products": "Products",
      "other": "Other",
    };
    return labels[cat] || cat;
  };

  const openLightbox = (item: IGallery, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
  };

  const goToNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedItem(filteredItems[nextIndex]);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedItem(filteredItems[prevIndex]);
    }
  };

  // Categories count
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: items.length,
      "factory-tour": 0,
      "manufacturing": 0,
      "workers": 0,
      "products": 0,
      "other": 0,
    };
    items.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Gallery</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Explore our state-of-the-art factory, skilled craftsmen, and premium leather manufacturing process
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-[var(--color-card)] border-b border-[var(--color-secondary)] sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === "all"
                    ? "bg-[var(--color-accent)] text-white shadow-md"
                    : "bg-[var(--color-secondary)] text-[var(--color-body)] hover:bg-[var(--color-accent)]/20"
                }`}
              >
                All ({categoryCounts.all})
              </button>
              <button
                onClick={() => setCategoryFilter("factory-tour")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === "factory-tour"
                    ? "bg-[var(--color-accent)] text-white shadow-md"
                    : "bg-[var(--color-secondary)] text-[var(--color-body)] hover:bg-[var(--color-accent)]/20"
                }`}
              >
                Factory Tour ({categoryCounts["factory-tour"]})
              </button>
              <button
                onClick={() => setCategoryFilter("manufacturing")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === "manufacturing"
                    ? "bg-[var(--color-accent)] text-white shadow-md"
                    : "bg-[var(--color-secondary)] text-[var(--color-body)] hover:bg-[var(--color-accent)]/20"
                }`}
              >
                Manufacturing ({categoryCounts["manufacturing"]})
              </button>
              <button
                onClick={() => setCategoryFilter("workers")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === "workers"
                    ? "bg-[var(--color-accent)] text-white shadow-md"
                    : "bg-[var(--color-secondary)] text-[var(--color-body)] hover:bg-[var(--color-accent)]/20"
                }`}
              >
                Workers & Skills ({categoryCounts["workers"]})
              </button>
              <button
                onClick={() => setCategoryFilter("products")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === "products"
                    ? "bg-[var(--color-accent)] text-white shadow-md"
                    : "bg-[var(--color-secondary)] text-[var(--color-body)] hover:bg-[var(--color-accent)]/20"
                }`}
              >
                Products ({categoryCounts["products"]})
              </button>
              <button
                onClick={() => setCategoryFilter("other")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === "other"
                    ? "bg-[var(--color-accent)] text-white shadow-md"
                    : "bg-[var(--color-secondary)] text-[var(--color-body)] hover:bg-[var(--color-accent)]/20"
                }`}
              >
                Other ({categoryCounts["other"]})
              </button>
            </div>

            {/* Media Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[var(--color-body)]" />
              <select
                value={mediaTypeFilter}
                onChange={(e) => setMediaTypeFilter(e.target.value)}
                className="px-4 py-2 border border-[var(--color-secondary)] bg-[var(--color-card)] text-[var(--color-text)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="all">All Media</option>
                <option value="image">Images Only</option>
                <option value="video">Videos Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-[var(--color-body)]/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No items found</h3>
            <p className="text-[var(--color-body)]">Try selecting a different category or filter</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-[var(--color-card)] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-[var(--color-secondary)]"
                onClick={() => openLightbox(item, index)}
              >
                {/* Image/Video Preview */}
                <div className="relative aspect-[4/3] bg-[var(--color-secondary)] overflow-hidden">
                  {item.mediaType === "image" ? (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)]">
                          <Video className="w-20 h-20 text-white opacity-50" />
                        </div>
                      )}
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                        <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform flex items-center justify-center">
                          <Play className="w-8 h-8 text-[var(--color-accent)] fill-current" style={{ marginLeft: '2px' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Media Type Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-[var(--color-accent)]/90 text-white">
                      {item.mediaType === "image" ? (
                        <ImageIcon className="w-3 h-3 inline mr-1" />
                      ) : (
                        <Video className="w-3 h-3 inline mr-1" />
                      )}
                      {item.mediaType}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs px-3 py-1 bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-full font-medium">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-[var(--color-text)] mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-[var(--color-body)] line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs text-[var(--color-body)]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center overflow-hidden"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/30 backdrop-blur-sm rounded-full transition-colors z-50"
              aria-label="Close"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/30 backdrop-blur-sm rounded-full transition-colors z-50"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </button>
            )}
            
            {currentIndex < filteredItems.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/30 backdrop-blur-sm rounded-full transition-colors z-50"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </button>
            )}

            {/* Content Container - Responsive & No Scroll */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 gap-4"
            >
              {/* Media Container - Responsive Height */}
              <div className="relative w-full max-w-5xl flex-shrink" style={{ maxHeight: '60vh' }}>
                {selectedItem.mediaType === "image" ? (
                  <img
                    src={selectedItem.mediaUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-contain rounded-lg"
                    style={{ maxHeight: '60vh' }}
                  />
                ) : (
                  <video
                    src={selectedItem.mediaUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain rounded-lg"
                    style={{ maxHeight: '60vh' }}
                  />
                )}
              </div>

              {/* Info - Fixed Height, No Overflow */}
              <div className="w-full max-w-5xl bg-[var(--color-card)] backdrop-blur-md rounded-lg p-4 md:p-6 border border-[var(--color-secondary)] shadow-2xl">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                  <span className="px-2 md:px-3 py-1 bg-[var(--color-accent)] text-white rounded-full text-xs md:text-sm font-medium">
                    {getCategoryLabel(selectedItem.category)}
                  </span>
                  <span className="text-[var(--color-body)] text-xs md:text-sm">
                    {currentIndex + 1} / {filteredItems.length}
                  </span>
                </div>
                
                <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-[var(--color-text)] mb-2 line-clamp-2">
                  {selectedItem.title}
                </h2>
                
                {selectedItem.description && (
                  <p className="text-sm md:text-base text-[var(--color-body)] mb-3 line-clamp-2">
                    {selectedItem.description}
                  </p>
                )}

                {/* Tags */}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {selectedItem.tags.slice(0, 5).map((tag, idx) => (
                      <span key={idx} className="text-xs md:text-sm text-[var(--color-body)] bg-[var(--color-secondary)] px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


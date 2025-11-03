"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SchedulerButton } from "@/components/scheduler/SchedulerButton";
import { Search, Grid, List, Package, ShoppingCart, Check } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";

interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Fetch products and categories from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products?isActive=true"),
        fetch("/api/categories?isActive=true"),
      ]);

      const [productsData, categoriesData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
      ]);
      
      if (productsData.success) {
        setProducts(productsData.data);
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update selected category when URL changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
  }, [categoryParam]);

  const handleQuickAdd = (product: Product) => {
    const productId = (product as any)._id || product.id;
    addToCart(product, 1);
    setAddedProductId(productId);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  // Extract unique materials from products
  const materials = useMemo(() => {
    const mats = new Set(products.map((p) => p.material));
    return ["all", ...Array.from(mats)];
  }, [products]);

  // Create category options from API data
  const categoryOptions = useMemo(() => {
    return [
      { value: "all", label: "All Categories" },
      ...categories.map((cat) => ({
        value: cat.slug,
        label: cat.name,
      })),
    ];
  }, [categories]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (products.length === 0) {
      return [];
    }

    console.log("Filtering products:", {
      totalProducts: products.length,
      searchTerm,
      selectedCategory,
      selectedMaterial,
    });

    const filtered = products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Match against product.category directly (it's the slug like "bags", "jackets")
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      
      const matchesMaterial =
        selectedMaterial === "all" || product.material === selectedMaterial;

      return matchesSearch && matchesCategory && matchesMaterial;
    });

    console.log("Filtered results:", filtered.length);
    console.log("Sample product category:", products[0]?.category);
    console.log("Selected category:", selectedCategory);
    return filtered;
  }, [searchTerm, selectedCategory, selectedMaterial, products]);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
            Our Products
          </h1>
          <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto mb-6">
            Explore our complete range of premium leather products. 
            All items available for wholesale with flexible MOQ.
          </p>
          <SchedulerButton variant="outline" defaultMeetingType="product">
            Schedule Product Consultation
          </SchedulerButton>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--color-card)] rounded-2xl p-6 mb-8 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-body)]" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categoryOptions}
            />

            {/* Material Filter */}
            <Select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              options={materials.map((mat) => ({
                value: mat,
                label: mat === "all" ? "All Materials" : mat,
              }))}
            />
          </div>

          {/* View Mode & Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-[var(--color-body)] text-sm">
              Showing <span className="font-semibold text-[var(--color-text)]">{filteredProducts.length}</span> products
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-[var(--color-accent)] text-[var(--color-text)]"
                    : "bg-[var(--color-secondary)] text-[var(--color-body)]"
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-[var(--color-accent)] text-[var(--color-text)]"
                    : "bg-[var(--color-secondary)] text-[var(--color-body)]"
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="w-20 h-20 text-[var(--color-body)] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
              No products available
            </h3>
            <p className="text-[var(--color-body)]">
              Please run the database setup first or add products via admin panel
            </p>
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="w-20 h-20 text-[var(--color-body)] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
              No products match your filters
            </h3>
            <p className="text-[var(--color-body)]">
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "flex flex-col space-y-6"
            }
          >
            {filteredProducts.map((product, index) => {
              const productId = (product as any)._id || product.id;
              return (
                <motion.div
                  key={productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {viewMode === "grid" ? (
                    <ProductCard 
                      product={product} 
                      onQuickAdd={handleQuickAdd}
                      isAdded={addedProductId === productId}
                    />
                  ) : (
                    <ProductListItem 
                      product={product}
                      onQuickAdd={handleQuickAdd}
                      isAdded={addedProductId === productId}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Product Card Component (Grid View)
function ProductCard({ 
  product, 
  onQuickAdd, 
  isAdded 
}: { 
  product: Product;
  onQuickAdd: (product: Product) => void;
  isAdded: boolean;
}) {
  const productId = (product as any)._id || product.id;
  
  return (
    <Card className="group overflow-hidden p-0 h-full flex flex-col">
      <Link href={`/products/${productId}`}>
        <div className="relative h-64 overflow-hidden cursor-pointer">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-[var(--color-accent)] text-[var(--color-text)] px-3 py-1 rounded-full text-sm font-semibold">
            MOQ: {product.moq}
          </div>
        </div>
      </Link>
      <div className="p-6 flex-1 flex flex-col">
        <Link href={`/products/${productId}`} className="cursor-pointer">
          <div className="mb-2">
            <span className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wide">
              {product.category}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2 hover:text-[var(--color-accent)] transition-colors">
            {product.name}
          </h3>
          <p className="text-[var(--color-body)] text-sm mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>
        </Link>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[var(--color-text)]">
              {product.priceRange}
            </span>
            <Link href={`/products/${productId}`}>
              <Button variant="ghost" size="sm" className="hover:text-[var(--color-accent)]">
                Details →
              </Button>
            </Link>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text)]"
            onClick={(e) => {
              e.preventDefault();
              onQuickAdd(product);
            }}
            disabled={isAdded}
          >
            {isAdded ? (
              <>
                <Check className="mr-2 w-4 h-4" />
                Added to Samples!
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 w-4 h-4" />
                Add Sample to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Product List Item Component (List View)
function ProductListItem({ 
  product,
  onQuickAdd,
  isAdded
}: { 
  product: Product;
  onQuickAdd: (product: Product) => void;
  isAdded: boolean;
}) {
  const productId = (product as any)._id || product.id;
  
  return (
    <Card className="group overflow-hidden p-0">
      <div className="flex flex-col md:flex-row">
        <Link href={`/products/${productId}`} className="relative w-full md:w-80 h-64 flex-shrink-0 cursor-pointer">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-3">
            <Link href={`/products/${productId}`} className="cursor-pointer flex-1">
              <span className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wide">
                {product.category}
              </span>
              <h3 className="text-2xl font-semibold text-[var(--color-text)] mt-1 hover:text-[var(--color-accent)] transition-colors">
                {product.name}
              </h3>
            </Link>
            <div className="bg-[var(--color-accent)] text-[var(--color-text)] px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
              MOQ: {product.moq}
            </div>
          </div>
          <p className="text-[var(--color-body)] mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div>
              <span className="text-sm text-[var(--color-body)]">Material: </span>
              <span className="text-sm font-semibold text-[var(--color-text)]">
                {product.material}
              </span>
            </div>
            <div>
              <span className="text-sm text-[var(--color-body)]">Price Range: </span>
              <span className="text-lg font-bold text-[var(--color-text)]">
                {product.priceRange}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/products/${productId}`}>
              <Button variant="outline" size="sm">
                View Full Details →
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text)]"
              onClick={(e) => {
                e.preventDefault();
                onQuickAdd(product);
              }}
              disabled={isAdded}
            >
              {isAdded ? (
                <>
                  <Check className="mr-2 w-4 h-4" />
                  Added to Samples!
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 w-4 h-4" />
                  Add Sample to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}


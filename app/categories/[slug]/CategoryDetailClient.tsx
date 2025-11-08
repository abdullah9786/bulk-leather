"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  ArrowRight, 
  Package, 
  ArrowLeft,
  Loader2
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface Product {
  _id: string;
  name: string;
  slug?: string;
  category: string;
  description: string;
  images: string[];
  priceRange: string;
  moq: number;
  samplePrice?: number;
}

interface CategoryDetailClientProps {
  slug: string;
}

export default function CategoryDetailClient({ slug }: CategoryDetailClientProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [slug]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch category by slug
      const categoryResponse = await fetch(`/api/categories/slug/${slug}`);
      const categoryData = await categoryResponse.json();

      // Handle redirect
      if (categoryData.redirect && categoryData.newSlug) {
        console.log(`Redirecting from ${slug} to ${categoryData.newSlug}`);
        window.location.href = `/categories/${categoryData.newSlug}`;
        return;
      }

      if (!categoryData.success) {
        setError("Category not found");
        setLoading(false);
        return;
      }

      setCategory(categoryData.data);

      // Fetch products for this category (using slug since products store lowercase category slugs)
      const categorySlug = categoryData.data.slug;
      console.log(`🔍 Fetching products for category slug: "${categorySlug}"`);
      
      const productsResponse = await fetch(`/api/products?category=${categorySlug}&isActive=true`);
      const productsData = await productsResponse.json();

      console.log(`📦 Found ${productsData.data?.length || 0} products for category "${categorySlug}"`);

      if (productsData.success) {
        setProducts(productsData.data || []);
      } else {
        setProducts([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching category:", error);
      setError("Failed to load category");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">
            {error || "Category not found"}
          </h1>
          <Link href="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero Section */}
      <section className="relative bg-[var(--color-secondary)] py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Link 
              href="/products"
              className="inline-flex items-center text-[var(--color-accent)] hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Products
            </Link>
            
            <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-text)] mb-6">
              {category.name}
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--color-body)] leading-relaxed">
              {category.description}
            </p>

            <div className="flex items-center gap-2 mt-6 text-[var(--color-body)]">
              <Package className="w-5 h-5" />
              <span>{products.length} Products Available</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-[var(--color-body)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                No products available
              </h3>
              <p className="text-[var(--color-body)] mb-6">
                Check back soon for new products in this category.
              </p>
              <Link href="/products">
                <Button variant="outline">Browse All Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/products/${product.slug || product._id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
                      <div className="relative h-64 rounded-t-xl overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.samplePrice && product.samplePrice > 0 && (
                          <div className="absolute top-4 right-4 bg-[var(--color-accent)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Sample: ${product.samplePrice}
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                          {product.name}
                        </h3>

                        <p className="text-sm text-[var(--color-body)] mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-[var(--color-body)]">Price Range</p>
                            <p className="text-lg font-bold text-[var(--color-accent)]">
                              {product.priceRange}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-[var(--color-body)]">MOQ</p>
                            <p className="text-sm font-semibold text-[var(--color-text)]">
                              {product.moq} units
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[var(--color-secondary)]">
                          <div className="flex items-center justify-between text-[var(--color-accent)] font-medium">
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


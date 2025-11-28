"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toast } from "@/components/ui/Toast";
import { SchedulerButton } from "@/components/scheduler/SchedulerButton";
import { 
  ArrowLeft, 
  Check, 
  Package, 
  Ruler, 
  Palette, 
  Mail,
  Phone,
  ShoppingCart,
  Sparkles,
  Award,
  Shield,
  Truck,
  ShoppingBag
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types";

interface Testimonial {
  _id?: string;
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  avatar?: string;
  rating?: number;
}

interface Props {
  slug: string;
}

export default function ProductDetailClient({ slug: productSlug }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    quantity: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    fetchTestimonials();
  }, [productSlug]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials?isActive=true");
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      // Check if it's a MongoDB ID (24 character hex) or a slug
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(productSlug);
      
      let response;
      if (isMongoId) {
        // Legacy ID-based URL - fetch by ID and redirect to slug
        console.log(`🔄 Legacy ID detected: ${productSlug}, fetching by ID...`);
        response = await fetch(`/api/products/${productSlug}`);
      } else {
        // Modern slug-based URL
        console.log(`✅ Slug-based URL: ${productSlug}`);
        response = await fetch(`/api/products/slug/${productSlug}`);
      }
      
      const data = await response.json();
      
      // Handle redirect (for changed slugs)
      if (data.redirect && data.newSlug) {
        console.log(`Redirecting from ${productSlug} to ${data.newSlug}`);
        window.location.href = `/products/${data.newSlug}`;
        return;
      }
      
      if (data.success) {
        setProduct(data.data);
        
        // If accessed by ID and product has a slug, redirect to slug URL
        // Use window.history.replaceState to avoid triggering useEffect again
        if (isMongoId && data.data.slug) {
          console.log(`🔀 Updating URL from ID to slug: ${data.data.slug}`);
          window.history.replaceState(null, '', `/products/${data.data.slug}`);
        }
      } else {
        console.error("Product not found");
        router.push("/products");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      router.push("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          inquiryType: "bulk",
          inquirySource: "product-page",
          productInterest: product?.name,
          productId: product?._id,
          message: `Quantity needed: ${formData.quantity}\n\n${formData.message}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormSubmitted(true);
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          quantity: "",
          message: "",
        });
      } else {
        console.error("Error submitting inquiry:", data);
        alert(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit inquiry. Please try again.");
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto"></div>
          <p className="mt-4 text-[var(--color-body)]">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[var(--color-body)] hover:text-[var(--color-accent)] mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--color-secondary)]">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-[var(--color-accent)] scale-105"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-[var(--color-body)] mb-6">
                <span className="inline-flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  MOQ: {product.moq} units
                </span>
                <span className="text-2xl font-bold text-[var(--color-accent)]">
                  {product.priceRange}
                </span>
              </div>
            </div>

            {product.samplePrice && product.samplePrice > 0 && (
              <div className="bg-[var(--color-secondary)] p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-body)]">Sample Price:</span>
                  <span className="text-2xl font-bold text-[var(--color-accent)]">
                    ${product.samplePrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-body)] mt-2">
                  Order a sample to test quality before bulk purchase
                </p>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="bg-[var(--color-secondary)] p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-[var(--color-text)]">
                Request Sample
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-[var(--color-bg)] hover:bg-[var(--color-accent)] hover:text-white transition-colors flex items-center justify-center font-bold"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold text-[var(--color-text)]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-[var(--color-bg)] hover:bg-[var(--color-accent)] hover:text-white transition-colors flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {addedToCart && (
              <Toast
                isOpen={true}
                type="success"
                title="Success"
                message="Product added to cart!"
                onClose={() => setAddedToCart(false)}
              />
            )}

            <p className="text-[var(--color-body)] mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Product Specifications */}
            {((product.colors?.length ?? 0) > 0 || (product.sizes?.length ?? 0) > 0) && (
              <div className="space-y-4 py-6 border-t border-b border-[var(--color-secondary)]">
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="w-5 h-5 text-[var(--color-accent)]" />
                      <h3 className="font-semibold text-[var(--color-text)]">
                        Available Colors:
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full bg-[var(--color-secondary)] text-[var(--color-body)] text-sm"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Ruler className="w-5 h-5 text-[var(--color-accent)]" />
                      <h3 className="font-semibold text-[var(--color-text)]">
                        Available Sizes:
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full bg-[var(--color-secondary)] text-[var(--color-body)] text-sm"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                  <h3 className="font-semibold text-[var(--color-text)]">
                    Key Features:
                  </h3>
                </div>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                      <span className="text-[var(--color-body)]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <SchedulerButton fullWidth className="flex-1" />
              <Link href="/contact" className="flex-1">
                <Button variant="outline" className="w-full h-full">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* USP Features Section */}
        <section className="py-16 mt-12 bg-[var(--color-secondary)] rounded-2xl">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Award, title: "Premium Quality", description: "Handcrafted from finest leather" },
                { icon: Shield, title: "Quality Assured", description: "Rigorous quality control process" },
                { icon: Truck, title: "Global Shipping", description: "Reliable worldwide delivery" },
                { icon: ShoppingBag, title: "Flexible MOQ", description: "Minimum orders from 30 units" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent)] mb-4">
                    <feature.icon className="w-8 h-8 text-[var(--color-text)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-body)]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted by Global Retailers - Testimonials */}
        <section className="py-16 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
              Trusted by Global Retailers
            </h2>
            <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto">
              Join hundreds of satisfied wholesale partners worldwide who trust us 
              for their leather goods supply.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonialsLoading ? (
              <div className="col-span-2 flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <Card key={testimonial._id || testimonial.id}>
                  <div className="mb-4">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 fill-current text-[var(--color-accent)]"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[var(--color-body)] italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </div>
                  <div className="border-t border-[var(--color-secondary)] pt-4 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                          <span className="text-[var(--color-text)] font-bold text-xl">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--color-text)]">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-[var(--color-body)]">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-[var(--color-body)]">No testimonials available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Inquiry Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <Card>
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">
              Request a Quote
            </h2>
            <p className="text-[var(--color-body)] mb-8">
              Fill out the form below and we'll get back to you within 24 hours
            </p>

            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                  Thank You!
                </h3>
                <p className="text-[var(--color-body)]">
                  We've received your inquiry and will respond soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="john@company.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your Company Name"
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <Input
                  label="Quantity Needed"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder={`Minimum ${product.moq} units`}
                />

                <Textarea
                  label="Additional Requirements"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  placeholder="Tell us about your specific requirements, customization needs, timeline, etc."
                />

                <Button type="submit" className="w-full">
                  Submit Inquiry
                </Button>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SchedulerButton } from "@/components/scheduler/SchedulerButton";
import { 
  ArrowRight, 
  ShoppingBag, 
  Shield, 
  Truck, 
  Award,
  Package,
  TrendingDown,
  CheckCircle,
  Star,
  Sparkles,
  BadgeCheck,
  Palette,
  Users,
  Factory,
  Globe,
  Scissors,
  Stamp,
  Settings
} from "lucide-react";
import { Product } from "@/types";

interface Category {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, testimonialsRes] = await Promise.all([
        fetch("/api/products?isActive=true"),
        fetch("/api/categories?isActive=true"),
        fetch("/api/testimonials?isActive=true"),
      ]);

      const [productsData, categoriesData, testimonialsData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        testimonialsRes.json(),
      ]);

      if (productsData.success) setProducts(productsData.data);
      if (categoriesData.success) setCategories(categoriesData.data);
      if (testimonialsData.success) setTestimonials(testimonialsData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1599108859613-88a1fff8e2e4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1287"
            alt="Premium Leather Products"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="hero-title font-serif text-[var(--color-text)] mb-6"
            >
              Premium Leather Goods for{" "}
              <span className="text-gradient">Wholesale Buyers</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hero-subtitle text-[var(--color-body)] mb-8"
            >
              Trusted by global retailers and distributors for exceptional quality, 
              craftsmanship, and competitive wholesale pricing. Minimum order quantities 
              designed for your business growth.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <SchedulerButton size="lg" defaultMeetingType="consultation">
                Schedule Consultation
              </SchedulerButton>
              <Link href="/products">
                <Button size="lg" variant="outline">
                  Browse Products
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[var(--color-secondary)]">
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

      {/* Featured Products - Wholesale Details Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
              Featured <span className="text-gradient">Wholesale Products</span>
            </h2>
            <p className="text-lg text-[var(--color-body)] max-w-3xl mx-auto">
              Explore our most popular wholesale items, carefully selected for their exceptional 
              quality, competitive pricing, and consistent demand. Each product comes with flexible 
              minimum order quantities and volume-based discounts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {loading ? (
              <div className="col-span-2 flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.slice(0, 4).map((product, index) => {
              const productId = (product as any)._id || product.id;
              return (
                <motion.div
                  key={productId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="group cursor-pointer overflow-hidden p-0 h-full">
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Product Image */}
                      <div className="relative w-full md:w-2/5 h-64 md:h-auto flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-[var(--color-accent)] text-[var(--color-text)] px-3 py-1 rounded-full text-xs font-bold">
                          WHOLESALE
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 p-6 flex flex-col">
                        <div className="mb-3">
                          <span className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider">
                            {product.category}
                          </span>
                          <h3 className="text-2xl font-serif text-[var(--color-text)] mt-1 mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-[var(--color-body)] text-sm leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        {/* Wholesale Details */}
                        <div className="space-y-3 mb-4 flex-1">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-[var(--color-accent)]" />
                            <span className="text-sm text-[var(--color-body)]">
                              <strong className="text-[var(--color-text)]">MOQ:</strong> {product.moq} units
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingDown className="w-4 h-4 text-[var(--color-accent)]" />
                            <span className="text-sm text-[var(--color-body)]">
                              <strong className="text-[var(--color-text)]">Wholesale Price:</strong> {product.priceRange}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[var(--color-accent)]" />
                            <span className="text-sm text-[var(--color-body)]">
                              <strong className="text-[var(--color-text)]">Material:</strong> {product.material}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Star className="w-4 h-4 text-[var(--color-accent)] mt-0.5" />
                            <span className="text-sm text-[var(--color-body)]">
                              <strong className="text-[var(--color-text)]">Colors:</strong> {product.colors.join(", ")}
                            </span>
                          </div>
                        </div>

                        {/* Wholesale Benefits */}
                        <div className="bg-[var(--color-secondary)] rounded-lg p-4 mb-4">
                          <p className="text-xs font-semibold text-[var(--color-accent)] mb-2 uppercase">
                            Wholesale Benefits
                          </p>
                          <ul className="space-y-1 text-xs text-[var(--color-body)]">
                            <li>✓ Volume discounts on orders over 100 units</li>
                            <li>✓ Free shipping on bulk orders (200+ units)</li>
                            <li>✓ Custom branding and packaging available</li>
                            <li>✓ Dedicated account manager support</li>
                          </ul>
                        </div>

                        {/* CTA Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                          <Link href={`/products/${productId}`} className="w-full">
                            <Button variant="primary" size="sm" className="w-full h-10 group whitespace-nowrap">
                              Get Quote
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                          <Link href={`/products/${productId}`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full h-10 group whitespace-nowrap">
                              View Details
                              <Package className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Wholesale Advantages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--color-accent)]/10 rounded-2xl p-8 border-2 border-[var(--color-accent)]/30"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent)] mb-3">
                  <TrendingDown className="w-6 h-6 text-[var(--color-text)]" />
                </div>
                <h4 className="font-semibold text-[var(--color-text)] mb-2">Competitive Wholesale Pricing</h4>
                <p className="text-sm text-[var(--color-body)]">
                  Up to 40% off retail prices for bulk orders. Tiered pricing structure rewards larger volumes.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent)] mb-3">
                  <Package className="w-6 h-6 text-[var(--color-text)]" />
                </div>
                <h4 className="font-semibold text-[var(--color-text)] mb-2">Flexible MOQ Options</h4>
                <p className="text-sm text-[var(--color-body)]">
                  Start with MOQs as low as 30 units. Mix and match products to meet minimums.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent)] mb-3">
                  <BadgeCheck className="w-6 h-6 text-[var(--color-text)]" />
                </div>
                <h4 className="font-semibold text-[var(--color-text)] mb-2">Quality Guarantee</h4>
                <p className="text-sm text-[var(--color-body)]">
                  Every wholesale order includes our 90-day quality guarantee and free replacement for defects.
                </p>
              </div>
            </div>
          </motion.div>

          {/* View All CTA */}
          <div className="text-center mt-10">
            <Link href="/products">
              <Button size="lg" variant="outline">
                View Complete Product Catalog
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
              Explore Our Categories
            </h2>
            <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto">
              From timeless classics to contemporary designs, discover our comprehensive 
              range of premium leather products.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : categories.map((category, index) => (
              <Link key={category._id || category.id} href={`/products?category=${category.slug}`}>
                <Card className="group cursor-pointer overflow-hidden p-0">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-serif text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/90 text-sm">{category.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Collection Showcase - Pricing & Quality */}
      <section className="py-20 bg-[var(--color-secondary)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
              Our Premium Leather Collection
            </h2>
            <p className="text-xl text-[var(--color-body)] max-w-3xl mx-auto mb-8">
              Exceptional quality meets unbeatable wholesale value. Every piece in our collection 
              is crafted from the finest leathers, sourced from certified tanneries, and backed 
              by our commitment to excellence.
            </p>
            <div className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-text)] px-6 py-3 rounded-full">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Starting from just $8 per unit</span>
            </div>
          </motion.div>

          {/* Quality Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Award,
                title: "Premium Materials",
                description: "100% genuine leather from certified Italian and European tanneries",
                highlight: "Full-grain & Top-grain"
              },
              {
                icon: Sparkles,
                title: "Exceptional Craftsmanship",
                description: "Hand-stitched by skilled artisans with over 20 years of experience",
                highlight: "Handcrafted Excellence"
              },
              {
                icon: Shield,
                title: "Quality Tested",
                description: "Every batch undergoes rigorous quality control and durability testing",
                highlight: "ISO Certified Process"
              },
              {
                icon: BadgeCheck,
                title: "Guaranteed Authentic",
                description: "Authentic leather certification included with every wholesale order",
                highlight: "Certificate Included"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-accent)] mb-4">
                    <item.icon className="w-7 h-7 text-[var(--color-text)]" />
                  </div>
                  <div className="inline-block bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-3 py-1 rounded-full text-xs font-bold mb-3">
                    {item.highlight}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--color-body)] leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Collection Pricing Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--color-card)] rounded-2xl p-8 shadow-xl mb-12"
          >
            <h3 className="text-3xl font-serif text-[var(--color-text)] text-center mb-8">
              Collection Pricing by Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { category: "Watch Straps & Accessories", starting: "$8", moq: "200 units", margin: "60-70%" },
                { category: "Wallets & Card Holders", starting: "$10", moq: "100 units", margin: "55-65%" },
                { category: "Belts & Small Goods", starting: "$12", moq: "150 units", margin: "50-60%" },
                { category: "Bags & Totes", starting: "$45", moq: "50 units", margin: "45-55%" },
                { category: "Jackets & Outerwear", starting: "$140", moq: "30 units", margin: "40-50%" }
              ].map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[var(--color-secondary)] rounded-xl p-6 text-center border-2 border-transparent hover:border-[var(--color-accent)] transition-all"
                >
                  <div className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wide mb-3">
                    {tier.category}
                  </div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-[var(--color-text)] mb-1">
                      {tier.starting}
                    </div>
                    <div className="text-xs text-[var(--color-body)]">starting price per unit</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-1 text-[var(--color-body)]">
                      <Package className="w-4 h-4 text-[var(--color-accent)]" />
                      <span>MOQ: {tier.moq}</span>
                    </div>
                    <div className="inline-block bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-3 py-1 rounded-full text-xs font-semibold">
                      {tier.margin} profit margin
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-[var(--color-body)] mt-6">
              * Prices shown are wholesale rates for standard bulk orders. Volume discounts apply for orders over 500 units.
            </p>
          </motion.div>

          {/* Exceptional Quality Promise */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
          >
            {/* Left - Image */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=800"
                alt="Quality Leather Craftsmanship"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-text)] px-4 py-2 rounded-full text-sm font-bold mb-3">
                  <BadgeCheck className="w-5 h-5" />
                  Premium Quality Certified
                </div>
                <p className="text-white text-lg font-semibold">
                  Every product undergoes 7-point quality inspection
                </p>
              </div>
            </div>

            {/* Right - Quality Details */}
            <div>
              <h3 className="text-3xl font-serif text-[var(--color-text)] mb-6">
                Exceptional Quality, <span className="text-gradient">Guaranteed</span>
              </h3>
              <p className="text-[var(--color-body)] mb-6 leading-relaxed">
                Our commitment to exceptional quality isn't just a promise—it's built into every 
                step of our manufacturing process. From leather selection to final packaging, 
                we maintain the highest standards in the industry.
              </p>
              
              <div className="space-y-4 mb-6">
                {[
                  {
                    title: "Premium Leather Selection",
                    description: "Only top 10% of hides selected - full-grain and vegetable-tanned options"
                  },
                  {
                    title: "Master Craftsmanship",
                    description: "Hand-stitched using traditional techniques passed down through generations"
                  },
                  {
                    title: "Rigorous Testing",
                    description: "Color-fastness, tensile strength, and durability tested on every batch"
                  },
                  {
                    title: "Ethical Sourcing",
                    description: "LWG-certified tanneries ensuring environmental and social responsibility"
                  }
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-[var(--color-text)]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--color-text)] mb-1">{point.title}</h4>
                      <p className="text-sm text-[var(--color-body)]">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[var(--color-accent)]/10 border-l-4 border-[var(--color-accent)] p-4 rounded-r-lg">
                <p className="text-sm text-[var(--color-body)]">
                  <strong className="text-[var(--color-text)]">Quality Guarantee:</strong> We stand 
                  behind every product with a 90-day quality guarantee. Any defects? We'll replace 
                  or refund—no questions asked.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Our Collection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <h3 className="text-3xl font-serif text-[var(--color-text)] mb-8">
              Why Retailers Choose Our Collection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: TrendingDown,
                  title: "Maximize Your Margins",
                  description: "Our wholesale pricing structure allows you to achieve 40-70% profit margins while staying competitive in your market."
                },
                {
                  icon: Award,
                  title: "Superior Quality",
                  description: "Premium materials and expert craftsmanship mean fewer returns, higher customer satisfaction, and repeat business."
                },
                {
                  icon: Truck,
                  title: "Reliable Supply Chain",
                  description: "Consistent inventory, on-time delivery, and dedicated support ensure your business never runs out of stock."
                }
              ].map((reason, index) => (
                <Card key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent)] mb-4">
                    <reason.icon className="w-8 h-8 text-[var(--color-text)]" />
                  </div>
                  <h4 className="text-xl font-semibold text-[var(--color-text)] mb-3">
                    {reason.title}
                  </h4>
                  <p className="text-[var(--color-body)]">
                    {reason.description}
                  </p>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Customization Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Palette className="w-4 h-4" />
                Custom Manufacturing Services
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-6">
                Tailored to Your <span className="text-gradient">Brand Vision</span>
              </h2>
              
              <p className="text-lg text-[var(--color-body)] mb-6 leading-relaxed">
                Beyond our extensive product catalog, we specialize in custom manufacturing 
                solutions designed specifically for your brand. From concept to delivery, 
                our team works closely with you to bring your unique vision to life.
              </p>

              <p className="text-lg text-[var(--color-body)] mb-8 leading-relaxed">
                Whether you need custom designs, branded packaging, or unique color combinations, 
                our in-house design team and manufacturing capabilities ensure your products 
                stand out in the market.
              </p>

              {/* Customization Features */}
              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: Scissors,
                    title: "Custom Design & Prototyping",
                    description: "Work with our designers to create unique products from scratch or modify existing designs"
                  },
                  {
                    icon: Palette,
                    title: "Brand Personalization",
                    description: "Add your logo, custom embossing, debossing, or metal hardware with your brand identity"
                  },
                  {
                    icon: Stamp,
                    title: "Custom Packaging",
                    description: "Branded boxes, dust bags, tags, and premium gift packaging options"
                  },
                  {
                    icon: Settings,
                    title: "Flexible Specifications",
                    description: "Choose materials, colors, sizes, and features tailored to your market needs"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 bg-[var(--color-secondary)] rounded-lg p-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-[var(--color-text)]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--color-text)] mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-[var(--color-body)]">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="group">
                    Discuss Your Custom Project
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline">
                    Browse Sample Products
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right - Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1658652303200-171403578620?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=3500"
                    alt="Custom Leather Design"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-[var(--color-card)]/90 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      Custom Embossing
                    </p>
                  </div>
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1600009723489-027195d6b3d3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=3500"
                    alt="Branded Packaging"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-[var(--color-card)]/90 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      Premium Packaging
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1502691876148-a84978e59af8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370"
                    alt="Color Options"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-[var(--color-card)]/90 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      Custom Colors
                    </p>
                  </div>
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1587440871875-191322ee64b0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2371"
                    alt="Design Process"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-[var(--color-card)]/90 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      Design Process
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Custom Process Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-[var(--color-card)] rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-serif text-[var(--color-text)] text-center mb-8">
              Our Custom Manufacturing Process
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { step: "01", title: "Consultation", desc: "Discuss your vision and requirements" },
                { step: "02", title: "Design", desc: "Create samples and prototypes" },
                { step: "03", title: "Approval", desc: "Review and refine until perfect" },
                { step: "04", title: "Production", desc: "Manufacture to exact specifications" },
                { step: "05", title: "Delivery", desc: "Quality check and ship worldwide" }
              ].map((phase, index) => (
                <div key={index} className="text-center relative">
                  {index < 4 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-[var(--color-accent)]/30" />
                  )}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent)] text-[var(--color-text)] font-bold text-xl mb-3 relative z-10">
                    {phase.step}
                  </div>
                  <h4 className="font-semibold text-[var(--color-text)] mb-2">{phase.title}</h4>
                  <p className="text-sm text-[var(--color-body)]">{phase.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats & Achievements Section */}
      <section className="py-20 bg-[var(--color-accent)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
              Numbers That Speak <span className="text-white">Excellence</span>
            </h2>
            <p className="text-lg text-[var(--color-text)]/80 max-w-2xl mx-auto">
              Two decades of delivering premium leather goods to wholesale partners worldwide
            </p>
          </motion.div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              {
                icon: Award,
                number: "20+",
                label: "Years of Excellence",
                description: "Established in 2000"
              },
              {
                icon: Users,
                number: "500+",
                label: "Satisfied Retailers",
                description: "Worldwide partners"
              },
              {
                icon: Factory,
                number: "3",
                label: "Manufacturing Units",
                description: "State-of-the-art facilities"
              },
              {
                icon: Globe,
                number: "40+",
                label: "Countries Served",
                description: "Global reach"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-text)] mb-4">
                  <stat.icon className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                <div className="text-5xl md:text-6xl font-bold text-[var(--color-text)] mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-[var(--color-text)] mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-[var(--color-text)]/70">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              { value: "100K+", label: "Products Delivered Annually" },
              { value: "150+", label: "Skilled Artisans" },
              { value: "98%", label: "Customer Satisfaction Rate" },
              { value: "24/7", label: "Support & Service" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className="bg-[var(--color-text)]/10 backdrop-blur-sm rounded-lg p-6 text-center border-2 border-[var(--color-text)]/20"
              >
                <div className="text-3xl font-bold text-[var(--color-text)] mb-2">
                  {item.value}
                </div>
                <div className="text-sm text-[var(--color-text)]/80">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Certifications & Awards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-block bg-[var(--color-text)] rounded-2xl px-8 py-6">
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-6 h-6 text-[var(--color-accent)]" />
                  <span className="text-[var(--color-accent)] font-semibold">ISO 9001:2015 Certified</span>
                </div>
                <div className="hidden md:block w-px h-8 bg-[var(--color-accent)]/30" />
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-6 h-6 text-[var(--color-accent)]" />
                  <span className="text-[var(--color-accent)] font-semibold">LWG Certified Tanneries</span>
                </div>
                <div className="hidden md:block w-px h-8 bg-[var(--color-accent)]/30" />
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-6 h-6 text-[var(--color-accent)]" />
                  <span className="text-[var(--color-accent)] font-semibold">Eco-Friendly Certified</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Brand Story Section */}
      <section className="py-20 bg-[var(--color-secondary)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-6">
                Craftsmanship Meets <span className="text-gradient">Excellence</span>
              </h2>
              <p className="text-lg text-[var(--color-body)] mb-4 leading-relaxed">
                For over two decades, we've been crafting premium leather goods that stand 
                the test of time. Our commitment to quality begins with selecting the finest 
                full-grain and top-grain leathers from ethical sources worldwide.
              </p>
              <p className="text-lg text-[var(--color-body)] mb-6 leading-relaxed">
                Every piece is meticulously handcrafted by skilled artisans who bring 
                generations of expertise to their work. We combine traditional techniques 
                with modern innovation to create products that exceed expectations.
              </p>
              <Link href="/about">
                <Button variant="primary" className="group">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"
                alt="Leather Craftsmanship"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-2 flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : testimonials.map((testimonial, index) => (
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
                    <p className="font-semibold text-[var(--color-text)]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[var(--color-body)]">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--color-accent)]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-6">
              Ready to Start Your Order?
            </h2>
            <p className="text-lg text-[var(--color-text)]/80 mb-8 max-w-2xl mx-auto">
              Get a quote for your bulk order or request samples to experience 
              our quality firsthand.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <SchedulerButton 
                size="lg" 
                variant="secondary"
                defaultMeetingType="consultation"
              >
                Schedule Meeting
              </SchedulerButton>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-[var(--color-text)] text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-accent)]">
                  Browse Products & Samples
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
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
  Sparkles
} from "lucide-react";
import products from "@/data/products.json";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === productId);

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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-[var(--color-text)] mb-4">
            Product Not Found
          </h1>
          <Button onClick={() => router.push("/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quote request:", { ...formData, product: product.name });
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      quantity: "",
      message: "",
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Products
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-24">
              {/* Main Image */}
              <div className="relative h-[500px] rounded-2xl overflow-hidden mb-4">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[var(--color-accent)] scale-95"
                        : "border-transparent hover:border-[var(--color-secondary)]"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <span className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wide">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
              {product.name}
            </h1>

            <p className="text-lg text-[var(--color-body)] mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-baseline gap-4 mb-8">
              <div className="text-3xl font-bold text-[var(--color-text)]">
                {product.priceRange}
              </div>
              <div className="text-sm text-[var(--color-body)]">per unit</div>
            </div>

            {/* MOQ Badge */}
            <div className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-text)] px-6 py-3 rounded-full mb-8">
              <Package className="w-5 h-5" />
              <span className="font-semibold">Minimum Order: {product.moq} units</span>
            </div>

            {/* Product Specifications */}
            <Card className="mb-8">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                Product Specifications
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-[var(--color-accent)] mt-0.5" />
                  <div>
                    <div className="font-medium text-[var(--color-text)]">Material</div>
                    <div className="text-[var(--color-body)]">{product.material}</div>
                  </div>
                </div>

                {product.colors && product.colors.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Palette className="w-5 h-5 text-[var(--color-accent)] mt-0.5" />
                    <div>
                      <div className="font-medium text-[var(--color-text)]">Available Colors</div>
                      <div className="text-[var(--color-body)]">
                        {product.colors.join(", ")}
                      </div>
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Ruler className="w-5 h-5 text-[var(--color-accent)] mt-0.5" />
                    <div>
                      <div className="font-medium text-[var(--color-text)]">Available Sizes</div>
                      <div className="text-[var(--color-body)]">
                        {product.sizes.join(", ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Features */}
            <Card className="mb-8">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-body)]">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Add to Sample Cart */}
            <Card className="mb-8 bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)]/30">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-[var(--color-accent)]" />
                <h3 className="text-lg font-semibold text-[var(--color-text)]">
                  Request Sample
                </h3>
              </div>
              
              <p className="text-sm text-[var(--color-body)] mb-4">
                Add this product to your sample cart. Experience our quality firsthand before placing bulk orders.
              </p>

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Number of Samples
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-[var(--color-accent)] rounded-lg bg-[var(--color-card)]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-[var(--color-secondary)] transition-colors rounded-l-lg"
                    >
                      <span className="text-xl font-bold text-[var(--color-text)]">−</span>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min={1}
                      max={5}
                      className="w-20 text-center py-3 bg-transparent border-none focus:outline-none font-semibold text-[var(--color-text)]"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(5, quantity + 1))}
                      className="px-4 py-3 hover:bg-[var(--color-secondary)] transition-colors rounded-r-lg"
                    >
                      <span className="text-xl font-bold text-[var(--color-text)]">+</span>
                    </button>
                  </div>
                  <span className="text-xs text-[var(--color-body)]">(max 5 per product)</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="w-full group"
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="mr-2 w-5 h-5" />
                    Added to Sample Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    Add to Sample Cart
                  </>
                )}
              </Button>

              <p className="text-xs text-[var(--color-body)] mt-3 text-center">
                Sample fees are refundable on your first bulk order
              </p>
            </Card>

            {/* Bulk Order CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SchedulerButton 
                size="lg" 
                defaultMeetingType="product"
                fullWidth
              >
                Schedule Meeting
              </SchedulerButton>
              <a href="#quote-form" className="w-full">
                <Button size="lg" variant="outline" className="w-full group">
                  Request Quote
                  <Mail className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="tel:+1234567890" className="w-full">
                <Button size="lg" variant="ghost" className="w-full">
                  <Phone className="mr-2 w-5 h-5" />
                  Call Sales
                </Button>
              </a>
            </div>
            
            <p className="text-sm text-[var(--color-body)] mt-4">
              <strong>For Bulk Orders:</strong> Minimum order quantity is {product.moq} units. 
              Schedule a meeting, fill out the quote form below, or contact our sales team directly.
            </p>
          </motion.div>
        </div>

        {/* Quote Request Form */}
        <motion.div
          id="quote-form"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Card>
            <h2 className="text-3xl font-serif text-[var(--color-text)] mb-6">
              Request a Quote for {product.name}
            </h2>
            <p className="text-[var(--color-body)] mb-6">
              Fill out the form below and our sales team will get back to you within 24 hours 
              with a detailed quote and information.
            </p>

            {formSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 border-2 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6"
              >
                <p className="font-semibold">Quote request submitted successfully!</p>
                <p className="text-sm">We'll contact you shortly.</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                />
                <Input
                  label="Email Address *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@company.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name *"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  placeholder="Your Company Ltd."
                />
                <Input
                  label="Phone Number *"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+1 (234) 567-890"
                />
              </div>

              <Input
                label={`Desired Quantity (Min: ${product.moq}) *`}
                type="number"
                name="quantity"
                min={product.moq}
                value={formData.quantity}
                onChange={handleInputChange}
                required
                placeholder={`${product.moq}`}
              />

              <Textarea
                label="Additional Requirements"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Please include any specific requirements, color preferences, or questions..."
              />

              <Button type="submit" size="lg" className="w-full md:w-auto">
                Submit Quote Request
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { SchedulerButton } from "@/components/scheduler/SchedulerButton";
import { 
  Palette,
  Scissors,
  Stamp,
  Settings,
  CheckCircle,
  Upload,
  MessageCircle,
  Sparkles,
  Award,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  Send
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CustomizationPage() {
  const { cartItems } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    customizationType: "design",
    quantity: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          inquiryType: "general",
          productInterest: formData.customizationType,
          message: `Customization Request:\n\nType: ${formData.customizationType}\nQuantity: ${formData.quantity}\nBudget: ${formData.budget || 'Not specified'}\nTimeline: ${formData.timeline || 'Not specified'}\n\nDetails:\n${formData.message}`,
          sampleCartItems: cartItems.map(item => ({
            productName: item.product.name,
            quantity: item.quantity
          }))
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error submitting customization request:", error);
      alert("Failed to submit request. Please try again.");
    }
  };

  const customizationServices = [
    {
      icon: Scissors,
      title: "Custom Design & Prototyping",
      description: "From Concept to Reality",
      details: [
        "Work directly with our design team to create unique products",
        "Modify existing designs to match your specifications",
        "Create original patterns and styles from scratch",
        "Receive 3D renders and technical drawings",
        "Physical prototypes within 2-3 weeks"
      ],
      image: "https://images.unsplash.com/photo-1658652303200-171403578620?w=800"
    },
    {
      icon: Palette,
      title: "Brand Personalization",
      description: "Make It Uniquely Yours",
      details: [
        "Custom embossing with your logo or brand name",
        "Debossing for subtle, elegant branding",
        "Metal hardware with custom engraving",
        "Color-matched stitching to your brand colors",
        "Branded interior labels and tags"
      ],
      image: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800"
    },
    {
      icon: Stamp,
      title: "Custom Packaging Solutions",
      description: "Elevate Your Brand Experience",
      details: [
        "Branded boxes with custom printing and colors",
        "Premium dust bags with logo embroidery",
        "Custom hang tags and product labels",
        "Protective packaging for safe delivery",
        "Gift packaging options for retail"
      ],
      image: "https://images.unsplash.com/photo-1600009723489-027195d6b3d3?w=800"
    },
    {
      icon: Settings,
      title: "Specification Customization",
      description: "Tailored to Your Market",
      details: [
        "Choose from 50+ leather types and finishes",
        "Custom color matching (Pantone or sample)",
        "Size adjustments for your target market",
        "Hardware selection (brass, silver, gunmetal)",
        "Interior layout and pocket configurations"
      ],
      image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=800"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Initial Consultation",
      description: "Share your vision, requirements, and budget. We'll discuss feasibility and options.",
      duration: "1-2 days",
      icon: MessageCircle
    },
    {
      number: "02",
      title: "Design & Quotation",
      description: "Receive detailed designs, material samples, and comprehensive pricing breakdown.",
      duration: "3-5 days",
      icon: Palette
    },
    {
      number: "03",
      title: "Prototype Development",
      description: "We create physical samples for your approval. Refine until it's perfect.",
      duration: "2-3 weeks",
      icon: Scissors
    },
    {
      number: "04",
      title: "Final Approval",
      description: "Review and approve final prototype, materials, and production specifications.",
      duration: "2-3 days",
      icon: CheckCircle
    },
    {
      number: "05",
      title: "Production",
      description: "Manufacturing begins with regular updates. Quality checks at every stage.",
      duration: "4-8 weeks",
      icon: Settings
    },
    {
      number: "06",
      title: "Quality Control & Delivery",
      description: "Final inspection, packaging, and worldwide shipping with full tracking.",
      duration: "1-2 weeks",
      icon: Award
    }
  ];

  const pricingTiers = [
    {
      name: "Design Consultation",
      price: "Free",
      description: "Initial consultation and feasibility assessment",
      features: [
        "1-hour consultation call",
        "Basic design concepts",
        "Material recommendations",
        "Rough cost estimates"
      ]
    },
    {
      name: "Prototype Development",
      price: "$500-$1,500",
      description: "Physical samples and detailed designs",
      features: [
        "1-3 physical prototypes",
        "Technical drawings",
        "Material samples",
        "Detailed cost breakdown",
        "Refundable on bulk order"
      ]
    },
    {
      name: "Custom Production",
      price: "MOQ: 100-500 units",
      description: "Full custom manufacturing",
      features: [
        "Custom design or modifications",
        "Your branding & packaging",
        "Quality control & certification",
        "Dedicated project manager",
        "Priority production schedule"
      ]
    }
  ];

  if (formSubmitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-4">
                Customization Request Received!
              </h1>
              <p className="text-lg text-[var(--color-body)] mb-6">
                Thank you for your interest in our custom manufacturing services. Our design 
                team will review your requirements and contact you within 24 hours to schedule 
                a consultation.
              </p>
              <div className="bg-[var(--color-secondary)] rounded-lg p-4 mb-6">
                <p className="text-sm text-[var(--color-body)]">
                  Confirmation sent to <strong>{formData.email}</strong>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => window.location.reload()}>
                  Submit Another Request
                </Button>
                <Link href="/products">
                  <Button variant="outline">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Custom Manufacturing Services
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-text)] mb-6">
              Bring Your Vision to <span className="text-gradient">Life</span>
            </h1>
            <p className="text-xl text-[var(--color-body)] max-w-3xl mx-auto mb-8">
              From custom designs to branded packaging, our in-house team transforms your ideas 
              into premium leather products that perfectly represent your brand.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <SchedulerButton size="lg" defaultMeetingType="custom">
                Schedule Consultation
              </SchedulerButton>
              <a href="#request-form">
                <Button size="lg" variant="outline">
                  Submit Request Form
                </Button>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Customization Services Grid */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-4">
              Our Customization Services
            </h2>
            <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto">
              Comprehensive custom manufacturing capabilities to meet your exact requirements
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {customizationServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent)]">
                        <service.icon className="w-6 h-6 text-[var(--color-text)]" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif text-[var(--color-text)] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[var(--color-accent)] font-semibold mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[var(--color-body)]">
                        <CheckCircle className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Process Timeline */}
        <section className="mb-20 bg-[var(--color-secondary)] rounded-3xl p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-4">
              Our Custom Manufacturing Process
            </h2>
            <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto">
              A transparent, collaborative process from concept to delivery
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative mb-12 last:mb-0"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-[var(--color-accent)] flex items-center justify-center mb-2">
                      <step.icon className="w-10 h-10 text-[var(--color-text)]" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[var(--color-accent)]">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 bg-[var(--color-card)] rounded-xl p-6 shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-serif text-[var(--color-text)]">
                        {step.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-[var(--color-accent)] font-semibold">
                        <Clock className="w-4 h-4" />
                        {step.duration}
                      </div>
                    </div>
                    <p className="text-[var(--color-body)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute left-10 top-24 w-0.5 h-16 bg-[var(--color-accent)]/30" />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-4">
              Custom Service Pricing
            </h2>
            <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto">
              Transparent pricing for every stage of your custom project
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`text-center h-full ${index === 1 ? 'ring-2 ring-[var(--color-accent)]' : ''}`}>
                  {index === 1 && (
                    <div className="bg-[var(--color-accent)] text-[var(--color-text)] text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-serif text-[var(--color-text)] mb-2">
                    {tier.name}
                  </h3>
                  <div className="text-3xl font-bold text-[var(--color-accent)] mb-2">
                    {tier.price}
                  </div>
                  <p className="text-sm text-[var(--color-body)] mb-6">
                    {tier.description}
                  </p>
                  <ul className="space-y-2 mb-6 text-left">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[var(--color-body)]">
                        <CheckCircle className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#request-form">
                    <Button 
                      variant={index === 1 ? "primary" : "outline"} 
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-20 bg-[var(--color-accent)]/10 rounded-3xl p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-4">
              Why Choose Our Custom Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: "Expert Team",
                description: "20+ years of design and manufacturing experience"
              },
              {
                icon: Clock,
                title: "Fast Turnaround",
                description: "Prototypes in 2-3 weeks, production in 4-8 weeks"
              },
              {
                icon: DollarSign,
                title: "Competitive Pricing",
                description: "Direct manufacturer pricing with no middleman"
              },
              {
                icon: Award,
                title: "Quality Guaranteed",
                description: "Every custom product backed by our quality promise"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-accent)] mb-4">
                    <benefit.icon className="w-7 h-7 text-[var(--color-text)]" />
                  </div>
                  <h4 className="font-semibold text-[var(--color-text)] mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-[var(--color-body)]">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Request Form */}
        <motion.section
          id="request-form"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card>
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-6">
              Request Custom Manufacturing
            </h2>
            <p className="text-[var(--color-body)] mb-8">
              Fill out the form below to start your custom project. Our team will contact you 
              within 24 hours to discuss your requirements in detail.
            </p>

            {/* Show Cart Items if Any */}
            {cartItems.length > 0 && (
              <div className="bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)]/30 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                  <h3 className="font-semibold text-[var(--color-text)]">
                    Products in Your Sample Cart
                  </h3>
                </div>
                <p className="text-sm text-[var(--color-body)] mb-4">
                  These products from your cart will be referenced in your customization inquiry:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-[var(--color-card)] rounded-lg p-3 border border-[var(--color-accent)]/20"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--color-text)] text-sm truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-[var(--color-body)]">
                          {item.quantity} {item.quantity === 1 ? 'sample' : 'samples'}
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-body)] mt-4">
                  We'll use these as reference for your customization requirements
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                  Contact Information
                </h3>
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
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                  Project Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Select
                    label="Customization Type *"
                    name="customizationType"
                    value={formData.customizationType}
                    onChange={handleInputChange}
                    options={[
                      { value: "design", label: "Custom Design from Scratch" },
                      { value: "modification", label: "Modify Existing Product" },
                      { value: "branding", label: "Branding & Personalization Only" },
                      { value: "packaging", label: "Custom Packaging Only" },
                      { value: "full", label: "Full Custom Solution" },
                    ]}
                  />
                  <Input
                    label="Expected Quantity *"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 500"
                  />
                  <Input
                    label="Budget Range (Optional)"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g., $5,000 - $10,000"
                  />
                  <Input
                    label="Timeline (Optional)"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    placeholder="e.g., 8-10 weeks"
                  />
                </div>

                <Textarea
                  label="Project Description *"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Please describe your custom requirements in detail: design ideas, materials, branding needs, target market, any reference images or sketches you have..."
                />
              </div>

              {/* Upload Section */}
              <div className="bg-[var(--color-secondary)] rounded-lg p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Upload className="w-5 h-5 text-[var(--color-accent)] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[var(--color-text)] mb-1">
                      Have Reference Materials?
                    </h4>
                    <p className="text-sm text-[var(--color-body)]">
                      After submitting, you can email sketches, photos, or design files to 
                      <strong> custom@bulkleather.com</strong> with reference number we'll provide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full md:w-auto group">
                  Submit Customization Request
                  <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </Card>
        </motion.section>

        {/* FAQ Section */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-serif text-[var(--color-text)] mb-4">
              Customization FAQs
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                question: "What's the minimum order for custom products?",
                answer: "Custom MOQ varies by complexity: 100-500 units for full custom designs, 50-100 for simple modifications or branding."
              },
              {
                question: "How long does the custom process take?",
                answer: "From consultation to delivery: 6-12 weeks depending on complexity. Prototypes typically ready in 2-3 weeks."
              },
              {
                question: "Can you match a specific design I have?",
                answer: "Yes! Provide photos, sketches, or samples and we'll create exact replicas or inspired variations."
              },
              {
                question: "Are prototype costs refundable?",
                answer: "Prototype fees ($500-$1,500) are fully refundable when you place your production order."
              },
              {
                question: "Can I customize colors and materials?",
                answer: "Absolutely! Choose from 50+ leather types, custom color matching (Pantone), and various hardware finishes."
              },
              {
                question: "Do you offer design services?",
                answer: "Yes, our in-house design team can create original designs based on your brand vision and market research."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <h4 className="font-semibold text-[var(--color-text)] mb-2">
                  {faq.question}
                </h4>
                <p className="text-sm text-[var(--color-body)]">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}


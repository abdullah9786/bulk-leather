"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Toast } from "@/components/ui/Toast";
import { LoginPromptModal } from "@/components/ui/LoginPromptModal";
import { SchedulerButton } from "@/components/scheduler/SchedulerButton";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  CheckCircle,
  Package,
  Sparkles
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function ContactPage() {
  const { cartItems } = useCart();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiryType: "bulk",
    productInterest: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          inquirySource: "contact-form",
          sampleCartItems: cartItems.map(item => ({
            productName: item.product.name,
            quantity: item.quantity
          }))
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormSubmitted(true);
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          inquiryType: "bulk",
          productInterest: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show login prompt for logged-out users
    if (!session) {
      setShowLoginPrompt(true);
      return;
    }

    // If logged in, submit directly
    await submitForm();
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (234) 567-890",
      description: "Mon-Fri, 9AM-6PM EST",
      action: "tel:+1234567890",
      buttonText: "Call Now",
    },
    {
      icon: Mail,
      title: "Email",
      details: "sales@bulkleather.com",
      description: "We'll respond within 24 hours",
      action: "mailto:sales@bulkleather.com",
      buttonText: "Send Email",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      details: "+1 (234) 567-890",
      description: "Fast response for urgent queries",
      action: "https://wa.me/1234567890?text=Hi, I'm interested in your wholesale leather products",
      buttonText: "Chat on WhatsApp",
    },
  ];

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
            Get in Touch
          </h1>
          <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto mb-6">
            Have questions about our products or wholesale pricing? Our team is here to help. 
            Reach out and we'll get back to you within 24 hours.
          </p>
          <SchedulerButton variant="outline" defaultMeetingType="consultation">
            Schedule a Meeting Now
          </SchedulerButton>
        </motion.div>

        {/* Contact Methods */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full flex flex-col">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent)] mb-4 mx-auto">
                    <method.icon className="w-8 h-8 text-[var(--color-text)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                    {method.title}
                  </h3>
                  <p className="text-lg font-medium text-[var(--color-body)] mb-1">
                    {method.details}
                  </p>
                  <p className="text-sm text-[var(--color-body)] mb-4 flex-1">
                    {method.description}
                  </p>
                  <a href={method.action} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full">
                      {method.buttonText}
                    </Button>
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <h2 className="text-3xl font-serif text-[var(--color-text)] mb-6">
                Send Us a Message
              </h2>

              {/* Show Sample Cart Items */}
              {cartItems.length > 0 && (
                <div className="bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)]/30 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-[var(--color-accent)]" />
                    <h3 className="font-semibold text-[var(--color-text)]">
                      Products in Your Sample Cart
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--color-body)] mb-4">
                    Your inquiry will include these products from your sample cart:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-[var(--color-card)] rounded-lg p-3 border border-[var(--color-accent)]/20"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
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
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-[var(--color-card)] rounded-lg p-3">
                    <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                    <p className="text-xs text-[var(--color-body)]">
                      These sample requests will be processed with your inquiry
                    </p>
                  </div>
                </div>
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

                <Select
                  label="Inquiry Type *"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  options={[
                    { value: "bulk", label: "Bulk Order Inquiry" },
                    { value: "sample", label: "Sample Request" },
                    { value: "general", label: "General Question" },
                    { value: "custom", label: "Custom Manufacturing" },
                  ]}
                />

                <Input
                  label="Product Interest (Optional)"
                  name="productInterest"
                  value={formData.productInterest}
                  onChange={handleInputChange}
                  placeholder="e.g., Leather Bags, Wallets, Jackets"
                />

                <Textarea
                  label="Message *"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Tell us about your requirements, expected quantities, timeline, or any questions you have..."
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full md:w-auto group"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Success Toast */}
          <Toast
            isOpen={formSubmitted}
            onClose={() => setFormSubmitted(false)}
            type="success"
            title="Message Sent Successfully!"
            message="We'll get back to you within 24 hours."
          />

          {/* Login Prompt Modal */}
          <LoginPromptModal
            isOpen={showLoginPrompt}
            onClose={() => setShowLoginPrompt(false)}
            onContinueAsGuest={submitForm}
          />

          {/* Contact Information & Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Office Information */}
            <Card>
              <h3 className="text-2xl font-serif text-[var(--color-text)] mb-6">
                Our Office
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[var(--color-accent)] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[var(--color-text)] mb-1">
                      Factory & Showroom
                    </h4>
                    <p className="text-[var(--color-body)]">
                      123 Leather District, Industrial Area<br />
                      Manufacturing Hub, IN 456789<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-[var(--color-accent)] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[var(--color-text)] mb-1">
                      Business Hours
                    </h4>
                    <p className="text-[var(--color-body)]">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday: 10:00 AM - 4:00 PM EST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-[var(--color-accent)] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[var(--color-text)] mb-1">
                      Sales Department
                    </h4>
                    <p className="text-[var(--color-body)]">
                      Phone: <a href="tel:+1234567890" className="hover:text-[var(--color-accent)] transition-colors">+1 (234) 567-890</a><br />
                      Email: <a href="mailto:sales@bulkleather.com" className="hover:text-[var(--color-accent)] transition-colors">sales@bulkleather.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Google Map */}
            <Card className="p-0 overflow-hidden">
              <div className="relative h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1635000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="bg-[var(--color-accent)]">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                Looking for Something Specific?
              </h3>
              <div className="space-y-2">
                <a
                  href="/products"
                  className="block text-[var(--color-text)] hover:underline"
                >
                  → Browse Products & Add Samples
                </a>
                <a
                  href="/customization"
                  className="block text-[var(--color-text)] hover:underline"
                >
                  → Custom Manufacturing Services
                </a>
                <a
                  href="/about"
                  className="block text-[var(--color-text)] hover:underline"
                >
                  → Learn More About Us
                </a>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                question: "What is your minimum order quantity?",
                answer: "MOQ varies by product, ranging from 30 to 150 units. Check individual product pages for specific requirements.",
              },
              {
                question: "Do you ship internationally?",
                answer: "Yes! We ship to over 40 countries worldwide with reliable shipping partners and comprehensive tracking.",
              },
              {
                question: "Can I customize products with my brand?",
                answer: "Absolutely. We offer custom branding, packaging, and minor design modifications for bulk orders.",
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept bank transfers, PayPal, and major credit cards. Payment terms negotiable for established partners.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                  {faq.question}
                </h3>
                <p className="text-[var(--color-body)]">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}


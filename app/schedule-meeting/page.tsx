"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { SchedulerButton } from "@/components/scheduler/SchedulerButton";
import { 
  Video,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  Package as PackageIcon
} from "lucide-react";

export default function ScheduleMeetingPage() {
  const meetingTypes = [
    {
      icon: Users,
      title: "General Consultation",
      description: "Discuss your wholesale needs, pricing, and partnership opportunities",
      duration: "30 minutes",
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      icon: PackageIcon,
      title: "Product Discussion",
      description: "Detailed review of specific products, materials, and bulk order requirements",
      duration: "30 minutes",
      color: "bg-purple-50 border-purple-200 text-purple-700",
    },
    {
      icon: Sparkles,
      title: "Custom Manufacturing",
      description: "Explore custom design options, branding, and private label opportunities",
      duration: "45 minutes",
      color: "bg-green-50 border-green-200 text-green-700",
    },
    {
      icon: CheckCircle,
      title: "Sample Review",
      description: "Review sample quality, discuss bulk orders after sample evaluation",
      duration: "20 minutes",
      color: "bg-orange-50 border-orange-200 text-orange-700",
    },
  ];

  const meetingModes = [
    {
      icon: Video,
      title: "Google Meet",
      description: "Face-to-face video call with automatic Meet link",
      popular: true,
    },
    {
      icon: Phone,
      title: "Phone Call",
      description: "Traditional phone conversation at your convenience",
      popular: false,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Video or voice call via WhatsApp",
      popular: false,
    },
    {
      icon: MapPin,
      title: "In-Person",
      description: "Visit our showroom and manufacturing facility",
      popular: false,
    },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Choose Meeting Type",
      description: "Select what you'd like to discuss - consultation, products, customization, or samples",
    },
    {
      number: "02",
      title: "Pick Date & Time",
      description: "Choose from available slots in the next 14 business days",
    },
    {
      number: "03",
      title: "Select Meeting Mode",
      description: "Google Meet, phone call, WhatsApp, or in-person visit",
    },
    {
      number: "04",
      title: "Confirm Details",
      description: "Provide your contact information and any specific topics",
    },
    {
      number: "05",
      title: "Get Confirmation",
      description: "Receive email with meeting details and Google Meet link (if video)",
    },
  ];

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
              <Calendar className="w-4 h-4" />
              Free Consultation
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-text)] mb-6">
              Schedule a Meeting with <span className="text-gradient">Our Experts</span>
            </h1>
            <p className="text-xl text-[var(--color-body)] max-w-3xl mx-auto mb-8">
              Book a free consultation with our wholesale team. Discuss your requirements, 
              get pricing details, and explore partnership opportunities.
            </p>
            <SchedulerButton size="lg" defaultMeetingType="consultation">
              Schedule Your Meeting Now
            </SchedulerButton>
          </motion.div>
        </section>

        {/* Meeting Types */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-4">
              What Would You Like to Discuss?
            </h2>
            <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto">
              Choose the meeting type that best fits your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetingTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-2 ${type.color.split(' ')[1]}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 ${type.color.split(' ')[0]} rounded-lg`}>
                      <type.icon className={`w-6 h-6 ${type.color.split(' ')[2]}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                        {type.title}
                      </h3>
                      <p className="text-sm text-[var(--color-body)] mb-3">
                        {type.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-[var(--color-body)]">
                        <Clock className="w-4 h-4" />
                        <span>{type.duration}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Meeting Modes */}
        <section className="mb-20 bg-[var(--color-secondary)] rounded-3xl p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-4">
              How Would You Like to Meet?
            </h2>
            <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto">
              Choose your preferred meeting mode for maximum convenience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {meetingModes.map((mode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`text-center h-full flex flex-col ${mode.popular ? 'ring-2 ring-[var(--color-accent)]' : ''}`}>
                  {mode.popular && (
                    <div className="bg-[var(--color-accent)] text-[var(--color-text)] text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-accent)]/10 mb-4 mx-auto">
                    <mode.icon className="w-7 h-7 text-[var(--color-accent)]" />
                  </div>
                  <h4 className="font-semibold text-[var(--color-text)] mb-2">
                    {mode.title}
                  </h4>
                  <p className="text-sm text-[var(--color-body)] mb-4 flex-1">
                    {mode.description}
                  </p>
                  <SchedulerButton
                    variant="outline"
                    size="sm"
                    className="w-full"
                    defaultMeetingType="consultation"
                  >
                    Schedule {mode.title.split(' ')[0]}
                  </SchedulerButton>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional CTA */}
          <div className="text-center mt-10">
            <p className="text-[var(--color-body)] mb-4">
              Not sure which mode to choose? Start with a consultation
            </p>
            <SchedulerButton size="lg" defaultMeetingType="consultation">
              <Calendar className="mr-2 w-5 h-5" />
              Schedule General Consultation
            </SchedulerButton>
          </div>
        </section>

        {/* Process Steps */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-4">
              Simple 5-Step Process
            </h2>
            <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto">
              Schedule your meeting in just a few clicks
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative mb-8 last:mb-0"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-text)] font-bold text-xl">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1 bg-[var(--color-card)] rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[var(--color-body)]">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="absolute left-8 top-20 w-0.5 h-8 bg-[var(--color-accent)]/30" />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Schedule */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-4">
              Why Schedule a Meeting?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Personalized Attention",
                description: "One-on-one discussion with our experienced wholesale team",
              },
              {
                icon: CheckCircle,
                title: "Detailed Quotes",
                description: "Get accurate pricing based on your specific requirements and volume",
              },
              {
                icon: Sparkles,
                title: "Expert Guidance",
                description: "Learn about customization options, materials, and best practices",
              },
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
                  <h4 className="text-xl font-semibold text-[var(--color-text)] mb-3">
                    {benefit.title}
                  </h4>
                  <p className="text-[var(--color-body)]">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[var(--color-accent)] rounded-3xl p-8 md:p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-[var(--color-text)]/80 mb-8 max-w-2xl mx-auto">
              Book your free consultation now. No commitments, no pressure - 
              just expert advice for your wholesale leather needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <SchedulerButton size="lg" variant="secondary" defaultMeetingType="consultation">
                Schedule Consultation
              </SchedulerButton>
              <SchedulerButton 
                size="lg" 
                variant="outline" 
                className="border-[var(--color-text)] text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-accent)]"
                defaultMeetingType="product"
              >
                Schedule Product Discussion
              </SchedulerButton>
            </div>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-serif text-[var(--color-text)] mb-4">
              Common Questions
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "How long does a consultation take?",
                answer: "Most consultations last 20-30 minutes. Custom manufacturing discussions may take up to 45 minutes.",
              },
              {
                question: "Is there any cost?",
                answer: "No! All consultations are completely free with no obligations. We're here to help.",
              },
              {
                question: "What if I need to reschedule?",
                answer: "Simply contact us via email or phone, and we'll help you find a new time that works.",
              },
              {
                question: "Can I schedule outside business hours?",
                answer: "Currently, meetings are available Monday-Friday, 9 AM - 5:30 PM EST. Contact us for special arrangements.",
              },
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



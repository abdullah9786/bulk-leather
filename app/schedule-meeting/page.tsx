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
      icon: PackageIcon,
      title: "Bulk Order Inquiry",
      description: "Discuss large quantity orders, wholesale pricing, and delivery timelines",
      duration: "30 minutes",
      color: "bg-blue-50 border-blue-200 text-blue-700",
      value: "bulk",
    },
    {
      icon: CheckCircle,
      title: "Sample Request",
      description: "Review sample quality and discuss bulk orders after evaluation",
      duration: "20 minutes",
      color: "bg-purple-50 border-purple-200 text-purple-700",
      value: "sample",
    },
    {
      icon: Users,
      title: "General Question",
      description: "Ask questions about our products, services, or wholesale opportunities",
      duration: "15 minutes",
      color: "bg-green-50 border-green-200 text-green-700",
      value: "general",
    },
    {
      icon: Sparkles,
      title: "Custom Manufacturing",
      description: "Explore custom design options, branding, and private label opportunities",
      duration: "45 minutes",
      color: "bg-orange-50 border-orange-200 text-orange-700",
      value: "custom",
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
      title: "Provide Your Details",
      description: "Enter your contact information and any specific topics you'd like to discuss",
    },
    {
      number: "04",
      title: "Get Confirmation",
      description: "Receive email with meeting details and Google Meet link instantly",
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
            <SchedulerButton size="lg" defaultMeetingType="general">
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
                <Card className={`border-2 ${type.color.split(' ')[1]} h-full flex flex-col`}>
                  <div className="flex items-start gap-4 flex-1">
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
                      <div className="flex items-center gap-2 text-sm text-[var(--color-body)] mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{type.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--color-secondary)]">
                    <SchedulerButton 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      defaultMeetingType={type.value}
                    >
                      Schedule {type.title}
                    </SchedulerButton>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Google Meet - Single Meeting Mode */}
        <section className="mb-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border-2 border-blue-200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500 mb-6">
              <Video className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-4">
              Meet Via Google Meet
            </h2>
            <p className="text-lg text-[var(--color-body)] mb-6">
              All meetings are conducted via Google Meet for the best video conferencing experience. 
              A meeting link will be automatically generated and sent to your email upon confirmation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-[var(--color-body)] bg-white/80 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">HD Video Quality</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-body)] bg-white/80 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Screen Sharing</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-body)] bg-white/80 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">No Software Required</span>
              </div>
            </div>
            <div className="mt-8">
            <SchedulerButton size="lg" defaultMeetingType="general">
              Schedule Video Meeting
            </SchedulerButton>
            </div>
          </motion.div>
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
              Simple 4-Step Process
            </h2>
            <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto">
              Schedule your Google Meet video call in just a few clicks
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
              <SchedulerButton size="lg" variant="secondary" defaultMeetingType="bulk">
                Schedule Bulk Order Inquiry
              </SchedulerButton>
              <SchedulerButton 
                size="lg" 
                variant="outline" 
                className="border-[var(--color-text)] text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-accent)]"
                defaultMeetingType="sample"
              >
                Request Sample Meeting
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



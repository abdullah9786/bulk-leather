"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { SchedulerButton } from "@/components/scheduler/SchedulerButton";
import { Award, Globe, Users, Leaf, TrendingUp, Shield } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "We source only the finest full-grain and top-grain leathers from ethical suppliers worldwide.",
    },
    {
      icon: Users,
      title: "Expert Craftsmanship",
      description: "Our artisans bring generations of leather-working expertise to every piece they create.",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Rigorous quality control ensures every product meets our exacting standards before shipping.",
    },
    {
      icon: Leaf,
      title: "Sustainable Practices",
      description: "We're committed to environmentally responsible sourcing and manufacturing processes.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving wholesale partners across 40+ countries with reliable shipping and support.",
    },
    {
      icon: TrendingUp,
      title: "Partnership Growth",
      description: "Flexible MOQs and competitive pricing designed to support your business expansion.",
    },
  ];

  const milestones = [
    { year: "2000", title: "Company Founded", description: "Started with a vision to deliver premium leather goods" },
    { year: "2005", title: "International Expansion", description: "Began exporting to 15 countries worldwide" },
    { year: "2012", title: "Production Facility Upgrade", description: "Expanded manufacturing capacity by 300%" },
    { year: "2018", title: "Sustainability Initiative", description: "Launched eco-friendly leather sourcing program" },
    { year: "2023", title: "40+ Countries", description: "Now serving wholesale partners across the globe" },
  ];

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1920"
            alt="Our Craftsmanship"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/70 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-serif text-[var(--color-text)] mb-6">
              Crafting Excellence in{" "}
              <span className="text-gradient">Leather Since 2000</span>
            </h1>
            <p className="text-xl text-[var(--color-body)] leading-relaxed">
              For over two decades, we've been the trusted choice for retailers and 
              distributors seeking premium leather goods that combine timeless craftsmanship 
              with modern design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif text-[var(--color-text)] mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-[var(--color-body)] leading-relaxed">
              <p>
                What began as a small workshop in 2000 has grown into one of the most 
                trusted names in wholesale leather goods. Our journey started with a simple 
                belief: that exceptional quality and ethical practices should never be 
                compromised for profit.
              </p>
              <p>
                Today, we work with skilled artisans who bring generations of expertise to 
                their craft. Every piece that leaves our facility represents our commitment 
                to excellence—from the careful selection of premium leathers to the final 
                quality inspection.
              </p>
              <p>
                We've built lasting partnerships with retailers and distributors across the 
                globe by consistently delivering products that exceed expectations. Our 
                flexible minimum order quantities and competitive pricing are designed to 
                support businesses of all sizes as they grow.
              </p>
              <p>
                Looking ahead, we remain committed to innovation, sustainability, and 
                maintaining the highest standards of craftsmanship that have defined us 
                from the beginning.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] rounded-2xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
              alt="Leather Workshop"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-[var(--color-secondary)] py-20 mb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-accent)] mb-4">
                    <value.icon className="w-7 h-7 text-[var(--color-text)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-[var(--color-body)] leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
            Our Journey
          </h2>
          <p className="text-lg text-[var(--color-body)] max-w-2xl mx-auto">
            Key milestones that have shaped our story
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 pb-12 border-l-2 border-[var(--color-accent)] last:pb-0"
            >
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--color-accent)]" />
              <div className="bg-[var(--color-card)] rounded-xl p-6 ml-6 shadow-lg">
                <div className="text-2xl font-bold text-[var(--color-accent)] mb-2">
                  {milestone.year}
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                  {milestone.title}
                </h3>
                <p className="text-[var(--color-body)]">{milestone.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[var(--color-accent)] py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "20+", label: "Years Experience" },
              { value: "40+", label: "Countries Served" },
              { value: "500+", label: "Wholesale Partners" },
              { value: "100K+", label: "Products Delivered" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-5xl md:text-6xl font-bold text-[var(--color-text)] mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-[var(--color-text)]/80 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-6">
              Our Quality Promise
            </h2>
            <p className="text-xl text-[var(--color-body)] leading-relaxed mb-8">
              Every product we create undergoes rigorous quality control. We stand behind 
              our craftsmanship with comprehensive warranties and responsive customer support. 
              When you partner with us, you're not just getting premium leather goods—you're 
              gaining a reliable ally committed to your success.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-text)] px-8 py-4 rounded-full text-lg font-semibold">
                <Shield className="w-6 h-6" />
                Quality Guaranteed
              </div>
              <SchedulerButton variant="outline" defaultMeetingType="partnership">
                Discuss Partnership
              </SchedulerButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Mail, 
  Package, 
  FileText, 
  Settings,
  Clock,
  CheckCircle
} from "lucide-react";

interface Inquiry {
  _id: string;
  inquiryType: string;
  inquirySource: string;
  productInterest?: string;
  productId?: string;
  customizationDetails?: any;
  message: string;
  status: string;
  createdAt: string;
  sampleCartItems?: Array<{ productName: string; quantity: number }>;
}

export default function MyEnquiriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/my-enquiries");
    } else if (status === "authenticated") {
      fetchInquiries();
    }
  }, [status, router]);

  const fetchInquiries = async () => {
    try {
      console.log("📥 Fetching user inquiries...");
      console.log("Session:", session?.user?.email);
      
      const response = await fetch("/api/inquiries/user");
      const data = await response.json();
      
      console.log("Response:", data);
      
      if (data.success) {
        console.log("✅ Found inquiries:", data.count);
        setInquiries(data.data);
      } else {
        console.log("❌ Failed to fetch:", data.error);
      }
    } catch (error) {
      console.error("❌ Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "product-page": return Package;
      case "customization-form": return Settings;
      case "contact-form": return Mail;
      default: return FileText;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "product-page": return "Product Quote";
      case "customization-form": return "Customization Request";
      case "contact-form": return "General Inquiry";
      default: return "Inquiry";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-700";
      case "contacted": return "bg-yellow-100 text-yellow-700";
      case "quoted": return "bg-purple-100 text-purple-700";
      case "converted": return "bg-green-100 text-green-700";
      case "closed": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredInquiries = React.useMemo(() => {
    console.log("🔍 Filtering inquiries...");
    console.log("Current filter:", filter);
    console.log("Total inquiries:", inquiries.length);
    
    if (filter === "all") {
      console.log("✅ Showing all inquiries:", inquiries.length);
      return inquiries;
    }
    
    const filtered = inquiries.filter(i => {
      console.log("Checking inquiry:", i.inquirySource, "against filter:", filter);
      return i.inquirySource === filter;
    });
    
    console.log("✅ Filtered result:", filtered.length);
    return filtered;
  }, [filter, inquiries]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
            My Enquiries
          </h1>
          <p className="text-lg text-[var(--color-body)]">
            Track all your inquiries and requests in one place
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { value: "all", label: "All Enquiries", count: inquiries.length },
            { value: "product-page", label: "Product Quotes", count: inquiries.filter(i => i.inquirySource === "product-page").length },
            { value: "customization-form", label: "Customization", count: inquiries.filter(i => i.inquirySource === "customization-form").length },
            { value: "contact-form", label: "General Inquiries", count: inquiries.filter(i => i.inquirySource === "contact-form").length },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.value
                  ? "bg-[var(--color-accent)] text-[var(--color-text)]"
                  : "bg-[var(--color-secondary)] text-[var(--color-body)] hover:bg-[var(--color-accent)]/20"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-[var(--color-accent)] text-[var(--color-text)] text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {filteredInquiries.length === 0 ? (
          <Card className="text-center py-12">
            <Mail className="w-20 h-20 text-[var(--color-body)]/30 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
              No Enquiries Yet
            </h3>
            <p className="text-[var(--color-body)] mb-6">
              You haven't submitted any inquiries yet
            </p>
            <Button onClick={() => router.push("/contact")}>
              Submit an Inquiry
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredInquiries.map((inquiry) => {
              const SourceIcon = getSourceIcon(inquiry.inquirySource);
              
              return (
                <motion.div
                  key={inquiry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      {/* Inquiry Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-[var(--color-accent)]/10 rounded-lg">
                            <SourceIcon className="w-5 h-5 text-[var(--color-accent)]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--color-text)]">
                              {getSourceLabel(inquiry.inquirySource)}
                            </h3>
                            <p className="text-sm text-[var(--color-body)]">
                              {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Product-Specific Details */}
                        {inquiry.productInterest && (
                          <div className="bg-[var(--color-secondary)] rounded-lg p-3 mb-3">
                            <p className="text-sm text-[var(--color-body)]">
                              <strong className="text-[var(--color-text)]">Product:</strong> {inquiry.productInterest}
                            </p>
                          </div>
                        )}

                        {/* Customization Details */}
                        {inquiry.customizationDetails && (
                          <div className="bg-[var(--color-secondary)] rounded-lg p-3 mb-3 space-y-1">
                            <p className="text-sm text-[var(--color-body)]">
                              <strong className="text-[var(--color-text)]">Type:</strong> {inquiry.customizationDetails.type}
                            </p>
                            <p className="text-sm text-[var(--color-body)]">
                              <strong className="text-[var(--color-text)]">Quantity:</strong> {inquiry.customizationDetails.quantity}
                            </p>
                            {inquiry.customizationDetails.budget && (
                              <p className="text-sm text-[var(--color-body)]">
                                <strong className="text-[var(--color-text)]">Budget:</strong> {inquiry.customizationDetails.budget}
                              </p>
                            )}
                            {inquiry.customizationDetails.timeline && (
                              <p className="text-sm text-[var(--color-body)]">
                                <strong className="text-[var(--color-text)]">Timeline:</strong> {inquiry.customizationDetails.timeline}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Sample Cart Items */}
                        {inquiry.sampleCartItems && inquiry.sampleCartItems.length > 0 && (
                          <div className="bg-[var(--color-accent)]/10 rounded-lg p-3 mb-3">
                            <p className="text-sm font-semibold text-[var(--color-text)] mb-2">
                              Sample Cart Items:
                            </p>
                            <div className="space-y-1">
                              {inquiry.sampleCartItems.map((item, idx) => (
                                <p key={idx} className="text-sm text-[var(--color-body)]">
                                  • {item.productName} (Qty: {item.quantity})
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="text-sm text-[var(--color-body)] line-clamp-3">
                          {inquiry.message}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="md:w-48 bg-[var(--color-secondary)] rounded-lg p-4">
                        <p className="text-xs text-[var(--color-body)] mb-2">Status</p>
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                        <p className="text-xs text-[var(--color-body)] mt-3">
                          Submitted: {new Date(inquiry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


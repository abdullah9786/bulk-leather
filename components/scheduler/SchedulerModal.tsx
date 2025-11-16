"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Building, 
  CheckCircle,
  Video,
  MessageCircle,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useCart } from "@/contexts/CartContext";

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMeetingType?: string;
  defaultMeetingMode?: string;
}

export function SchedulerModal({ 
  isOpen, 
  onClose, 
  defaultMeetingType = "general",
  defaultMeetingMode = "video"
}: SchedulerModalProps) {
  const { cartItems } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    meetingType: defaultMeetingType,
    meetingMode: "video", // Always Google Meet
    date: "",
    timeSlot: "",
    message: "",
    timezone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userTimezone, setUserTimezone] = useState("");
  const [timezoneAbbr, setTimezoneAbbr] = useState("");

  // Detect user's timezone and reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date();
      const abbr = now.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2];
      
      setUserTimezone(timezone);
      setTimezoneAbbr(abbr);
      
      // Reset form with default values when modal opens
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        meetingType: defaultMeetingType,
        meetingMode: "video", // Always Google Meet
        date: "",
        timeSlot: "",
        message: "",
        timezone,
      });
      
      setStep(1);
      setSubmitted(false);
      
      console.log("🌍 User timezone detected:", timezone);
      console.log("🕐 Timezone abbreviation:", abbr);
      console.log("📝 Default meeting mode:", defaultMeetingMode);
    }
  }, [isOpen, defaultMeetingType, defaultMeetingMode]);

  const meetingTypes = [
    { value: "bulk", label: "Bulk Order Inquiry" },
    { value: "sample", label: "Sample Request" },
    { value: "general", label: "General Question" },
    { value: "custom", label: "Custom Manufacturing" },
  ];

  const meetingModes = [
    { 
      value: "video", 
      label: "Google Meet", 
      icon: Video,
      description: "Auto-generated Meet link"
    },
    { 
      value: "phone", 
      label: "Phone Call", 
      icon: Phone,
      description: "We'll call you"
    },
    { 
      value: "whatsapp", 
      label: "WhatsApp", 
      icon: MessageCircle,
      description: "Video or voice call"
    },
    { 
      value: "inperson", 
      label: "In-Person", 
      icon: MapPin,
      description: "Visit our showroom"
    },
  ];

  // Generate next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      day: date.getDay()
    };
  }).filter(date => date.day !== 0 && date.day !== 6); // Remove weekends

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  // Helper to display timezone info
  const getTimezoneDisplay = () => {
    if (!userTimezone) return "";
    
    // Map timezone to common abbreviations
    const timezoneMap: { [key: string]: string } = {
      "America/New_York": "EST/EDT",
      "America/Chicago": "CST/CDT",
      "America/Denver": "MST/MDT",
      "America/Los_Angeles": "PST/PDT",
      "America/Phoenix": "MST",
      "Europe/London": "GMT/BST",
      "Europe/Paris": "CET/CEST",
      "Asia/Kolkata": "IST",
      "Asia/Dubai": "GST",
      "Australia/Sydney": "AEDT/AEST",
    };

    const displayName = timezoneMap[userTimezone] || timezoneAbbr || userTimezone;
    return displayName;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [meetingResponse, setMeetingResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      console.log("📤 Submitting meeting request...");
      
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sampleCartItems: cartItems.map(item => ({
            productName: item.product.name,
            quantity: item.quantity
          }))
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Meeting scheduled successfully");
        setMeetingResponse(data);
        setSubmitted(true);
      } else {
        console.error("❌ Meeting scheduling failed:", data.error);
        alert(`Failed to schedule meeting: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("❌ Error scheduling meeting:", error);
      alert("Failed to schedule meeting. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      meetingType: defaultMeetingType,
      meetingMode: "video",
      date: "",
      timeSlot: "",
      message: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    setStep(1);
    setSubmitted(false);
    setMeetingResponse(null);
    onClose();
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] bg-[var(--color-bg)] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-[var(--color-secondary)]">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-text)]">
                {submitted ? "Meeting Confirmed!" : "Schedule a Meeting"}
              </h2>
              {!submitted && (
                <p className="text-sm text-[var(--color-body)] mt-1">
                  Step {step} of 3 - {step === 1 ? "Meeting Details" : step === 2 ? "Date & Time" : "Your Information"}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
            >
              <X className="w-6 h-6 text-[var(--color-text)]" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-serif text-[var(--color-text)] mb-4">
                  Your Meeting is Scheduled!
                </h3>
                <p className="text-lg text-[var(--color-body)] mb-6 max-w-md mx-auto">
                  We've sent a confirmation email to <strong>{formData.email}</strong> with 
                  meeting details and calendar invite.
                </p>

                <div className="bg-[var(--color-secondary)] rounded-xl p-6 max-w-lg mx-auto mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-left">
                      <p className="text-[var(--color-body)] mb-1">Meeting Type:</p>
                      <p className="font-semibold text-[var(--color-text)]">
                        {meetingTypes.find(t => t.value === formData.meetingType)?.label}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-[var(--color-body)] mb-1">Mode:</p>
                      <p className="font-semibold text-[var(--color-text)]">
                        {meetingModes.find(m => m.value === formData.meetingMode)?.label}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-[var(--color-body)] mb-1">Date:</p>
                      <p className="font-semibold text-[var(--color-text)]">
                        {new Date(formData.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-[var(--color-body)] mb-1">Time:</p>
                      <p className="font-semibold text-[var(--color-text)]">{formData.timeSlot}</p>
                    </div>
                  </div>
                </div>

                {/* Google Meet Link */}
                {meetingResponse?.googleMeetLink && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Video className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Google Meet Link Created!</h4>
                    </div>
                    <a
                      href={meetingResponse.googleMeetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white p-4 rounded-lg mb-3 hover:bg-blue-50 transition-colors"
                    >
                      <p className="text-sm text-blue-600 font-mono break-all">
                        {meetingResponse.googleMeetLink}
                      </p>
                    </a>
                    {meetingResponse.googleCalendarUrl && (
                      <a
                        href={meetingResponse.googleCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Calendar className="w-4 h-4" />
                        Add to Google Calendar
                      </a>
                    )}
                  </div>
                )}

                <p className="text-sm text-[var(--color-body)] mb-8">
                  {meetingResponse?.googleMeetLink 
                    ? "Google Meet link has been sent to your email. Save the link above!"
                    : "Our team will contact you 15 minutes before the scheduled time."}
                </p>

                <div className="flex gap-3">
                  <Button size="lg" onClick={resetForm} className="flex-1">
                    Schedule Another Meeting
                  </Button>
                  {meetingResponse?.googleMeetLink && (
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(meetingResponse.googleMeetLink);
                        alert("Google Meet link copied to clipboard!");
                      }}
                      className="flex-1"
                    >
                      Copy Meet Link
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Step 1: Meeting Details */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                        What would you like to discuss?
                      </h3>
                      <Select
                        label="Meeting Type *"
                        name="meetingType"
                        value={formData.meetingType}
                        onChange={handleInputChange}
                        options={meetingTypes}
                      />
                    </div>

                    {/* Meeting via Google Meet - Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-500">
                          <Video className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-blue-900 mb-1">
                            Video Meeting via Google Meet
                          </div>
                          <div className="text-sm text-blue-700">
                            A Google Meet link will be automatically generated and sent to your email
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Show Cart Items if Any */}
                    {cartItems.length > 0 && (
                      <div className="bg-[var(--color-accent)]/10 rounded-lg p-4 border border-[var(--color-accent)]/30">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-4 h-4 text-[var(--color-accent)]" />
                          <span className="text-sm font-semibold text-[var(--color-text)]">
                            {cartItems.length} sample{cartItems.length > 1 ? 's' : ''} in cart will be discussed
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2 bg-[var(--color-card)] rounded-lg px-3 py-1.5 border border-[var(--color-accent)]/20"
                            >
                              <div className="relative w-8 h-8 rounded overflow-hidden">
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-xs text-[var(--color-text)]">
                                {item.product.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button 
                      type="button" 
                      size="lg" 
                      className="w-full"
                      onClick={() => setStep(2)}
                    >
                      <Calendar className="mr-2 w-5 h-5" />
                      Continue to Date & Time
                    </Button>
                  </motion.div>
                )}

                {/* Step 2: Date & Time Selection */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Timezone Display */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Your Timezone: {getTimezoneDisplay()}
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            {userTimezone} • All times shown in your local timezone
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                        Select Your Preferred Date
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableDates.map((date) => (
                          <button
                            key={date.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, date: date.value })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              formData.date === date.value
                                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                : "border-[var(--color-secondary)] hover:border-[var(--color-accent)]/50"
                            }`}
                          >
                            <div className="text-sm font-semibold text-[var(--color-text)]">
                              {date.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.date && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                          Select Time Slot (EST)
                        </h3>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setFormData({ ...formData, timeSlot: slot })}
                              className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                                formData.timeSlot === slot
                                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-text)]"
                                  : "border-[var(--color-secondary)] hover:border-[var(--color-accent)]/50 text-[var(--color-body)]"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        className="flex-1"
                        onClick={() => setStep(3)}
                        disabled={!formData.date || !formData.timeSlot}
                      >
                        Continue to Contact Info
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Contact Information */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                      Your Contact Information
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

                    <Textarea
                      label="What would you like to discuss? (Optional)"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Brief description of topics you'd like to cover..."
                    />

                    {/* Meeting Summary */}
                    <div className="bg-[var(--color-accent)]/10 rounded-xl p-6 border-2 border-[var(--color-accent)]/30">
                      <h4 className="font-semibold text-[var(--color-text)] mb-4">Meeting Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[var(--color-accent)]" />
                          <span className="text-[var(--color-body)]">
                            {new Date(formData.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[var(--color-accent)]" />
                          <span className="text-[var(--color-body)]">{formData.timeSlot} EST (30 minutes)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-[var(--color-accent)]" />
                          <span className="text-[var(--color-body)]">
                            Google Meet (Video)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep(2)}
                        disabled={submitting}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Scheduling...
                          </>
                        ) : (
                          "Confirm Meeting"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}


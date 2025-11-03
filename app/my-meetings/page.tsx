"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Calendar, 
  Video,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Package
} from "lucide-react";

interface Meeting {
  _id: string;
  meetingType: string;
  meetingMode: string;
  date: string;
  timeSlot: string;
  message?: string;
  googleMeetLink?: string;
  sampleCartItems?: Array<{ productName: string; quantity: number }>;
  status: string;
  createdAt: string;
}

export default function MyMeetingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/my-meetings");
    } else if (status === "authenticated") {
      fetchMeetings();
    }
  }, [status, router]);

  const fetchMeetings = async () => {
    try {
      console.log("📥 Fetching user meetings...");
      const response = await fetch("/api/meetings/user");
      const data = await response.json();
      
      console.log("Response:", data);
      
      if (data.success) {
        console.log("✅ Found meetings:", data.count);
        setMeetings(data.data);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "video": return Video;
      case "phone": return Phone;
      case "whatsapp": return MessageCircle;
      case "inperson": return MapPin;
      default: return Calendar;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "video": return "Google Meet";
      case "phone": return "Phone Call";
      case "whatsapp": return "WhatsApp";
      case "inperson": return "In-Person";
      default: return mode;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredMeetings = filter === "all"
    ? meetings
    : filter === "upcoming"
    ? meetings.filter(m => m.status === "scheduled" && new Date(m.date) >= new Date())
    : meetings.filter(m => m.status === filter);

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
            My Meetings
          </h1>
          <p className="text-lg text-[var(--color-body)]">
            View and manage all your scheduled meetings
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { value: "all", label: "All Meetings", count: meetings.length },
            { value: "upcoming", label: "Upcoming", count: meetings.filter(m => m.status === "scheduled" && new Date(m.date) >= new Date()).length },
            { value: "completed", label: "Completed", count: meetings.filter(m => m.status === "completed").length },
            { value: "cancelled", label: "Cancelled", count: meetings.filter(m => m.status === "cancelled").length },
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

        {filteredMeetings.length === 0 ? (
          <Card className="text-center py-12">
            <Calendar className="w-20 h-20 text-[var(--color-body)]/30 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
              No Meetings {filter !== "all" && `(${filter})`}
            </h3>
            <p className="text-[var(--color-body)] mb-6">
              You haven't scheduled any meetings yet
            </p>
            <Button onClick={() => router.push("/")}>
              Schedule a Meeting
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredMeetings.map((meeting) => {
              const ModeIcon = getModeIcon(meeting.meetingMode);
              const isPast = new Date(meeting.date) < new Date();
              const isToday = new Date(meeting.date).toDateString() === new Date().toDateString();
              
              return (
                <motion.div
                  key={meeting._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      {/* Meeting Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-[var(--color-accent)]/10 rounded-lg">
                            <ModeIcon className="w-5 h-5 text-[var(--color-accent)]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--color-text)] capitalize">
                              {meeting.meetingType} Meeting - {getModeLabel(meeting.meetingMode)}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-[var(--color-body)] mt-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(meeting.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })} at {meeting.timeSlot}
                              </span>
                              {isToday && (
                                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                                  TODAY
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Google Meet Link */}
                        {meeting.googleMeetLink && meeting.status === "scheduled" && (
                          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                            <p className="text-sm font-semibold text-blue-900 mb-2">
                              🎥 Join via Google Meet
                            </p>
                            <a
                              href={meeting.googleMeetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center font-medium transition-colors"
                            >
                              Join Meeting
                            </a>
                            <p className="text-xs text-blue-700 mt-2 font-mono break-all">
                              {meeting.googleMeetLink}
                            </p>
                          </div>
                        )}

                        {/* Sample Cart Items */}
                        {meeting.sampleCartItems && meeting.sampleCartItems.length > 0 && (
                          <div className="bg-[var(--color-accent)]/10 rounded-lg p-3 mb-3">
                            <p className="text-sm font-semibold text-[var(--color-text)] mb-2">
                              Sample Items to Discuss:
                            </p>
                            <div className="space-y-1">
                              {meeting.sampleCartItems.map((item, idx) => (
                                <p key={idx} className="text-sm text-[var(--color-body)]">
                                  • {item.productName} (Qty: {item.quantity})
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {meeting.message && (
                          <p className="text-sm text-[var(--color-body)]">
                            <strong>Notes:</strong> {meeting.message}
                          </p>
                        )}
                      </div>

                      {/* Status & Date */}
                      <div className="md:w-48 bg-[var(--color-secondary)] rounded-lg p-4">
                        <p className="text-xs text-[var(--color-body)] mb-2">Status</p>
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                        {meeting.status === "scheduled" && isPast && (
                          <p className="text-xs text-orange-600 mt-2">
                            ⚠️ Past meeting
                          </p>
                        )}
                        <p className="text-xs text-[var(--color-body)] mt-3">
                          Scheduled: {new Date(meeting.createdAt).toLocaleDateString()}
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


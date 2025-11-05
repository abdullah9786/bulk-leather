"use client";

import React, { useEffect, useState } from "react";
import { 
  Calendar, 
  Search, 
  Video,
  Phone,
  MessageCircle,
  MapPin,
  ExternalLink,
  XCircle,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Meeting {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  meetingType: string;
  meetingMode: string;
  date: string;
  timeSlot: string;
  message?: string;
  sampleCartItems?: Array<{ productName: string; quantity: number }>;
  status: string;
  googleMeetLink?: string;
  googleCalendarEventId?: string;
  createdAt: string;
}

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    filterMeetings();
  }, [searchTerm, statusFilter, meetings]);

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("/api/meetings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success) {
        setMeetings(data.data);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMeetings = () => {
    let filtered = meetings;

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((m) => m.status === statusFilter);
    }

    setFilteredMeetings(filtered);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const updateMeetingStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch(`/api/meetings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchMeetings();
        setDetailModalOpen(false);
        setSelectedMeeting(null);
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meetings</h1>
        <p className="text-gray-500">Manage scheduled meetings and consultations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", count: meetings.length, color: "bg-purple-500" },
          { label: "Scheduled", count: meetings.filter(m => m.status === "scheduled").length, color: "bg-blue-500" },
          { label: "Today", count: meetings.filter(m => new Date(m.date).toDateString() === new Date().toDateString()).length, color: "bg-green-500" },
          { label: "Completed", count: meetings.filter(m => m.status === "completed").length, color: "bg-gray-500" },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Meetings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Mode
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Samples
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filteredMeetings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No meetings found
                  </td>
                </tr>
              ) : (
                filteredMeetings.map((meeting) => {
                  const ModeIcon = getModeIcon(meeting.meetingMode);
                  return (
                    <tr key={meeting._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {meeting.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{meeting.company}</p>
                          <p className="text-xs text-gray-400 truncate">{meeting.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 capitalize">
                          {meeting.meetingType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(meeting.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">{meeting.timeSlot}</p>
                        {meeting.timezone && (
                          <p className="text-xs text-blue-600 mt-0.5">
                            🌍 {meeting.timezone.split('/')[1]?.replace('_', ' ') || meeting.timezone}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ModeIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700 capitalize">
                            {meeting.meetingMode}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {meeting.sampleCartItems && meeting.sampleCartItems.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-gray-900">
                              {meeting.sampleCartItems.length}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedMeeting(meeting);
                            setDetailModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedMeeting && detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto my-4 md:my-8 p-4 md:p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Meeting Details</h2>
              <button onClick={() => setDetailModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-medium text-gray-900">{selectedMeeting.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Company</p>
                  <p className="font-medium text-gray-900">{selectedMeeting.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${selectedMeeting.email}`} className="font-medium text-amber-600 hover:underline">
                    {selectedMeeting.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <a href={`tel:${selectedMeeting.phone}`} className="font-medium text-amber-600 hover:underline">
                    {selectedMeeting.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedMeeting.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Time</p>
                  <p className="font-medium text-gray-900">{selectedMeeting.timeSlot}</p>
                  {selectedMeeting.timezone && (
                    <p className="text-xs text-blue-600 mt-1">
                      🌍 {selectedMeeting.timezone}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Meeting Type</p>
                  <p className="font-medium text-gray-900 capitalize">{selectedMeeting.meetingType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Mode</p>
                  <p className="font-medium text-gray-900 capitalize">{selectedMeeting.meetingMode}</p>
                </div>
              </div>
              {selectedMeeting.googleMeetLink && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Google Meet Link</p>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <a
                      href={selectedMeeting.googleMeetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-mono text-sm break-all"
                    >
                      {selectedMeeting.googleMeetLink}
                    </a>
                  </div>
                </div>
              )}
              {selectedMeeting.message && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Message</p>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedMeeting.message}</p>
                </div>
              )}
              {selectedMeeting.sampleCartItems && selectedMeeting.sampleCartItems.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Sample Cart Items</p>
                  <div className="space-y-2">
                    {selectedMeeting.sampleCartItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">{item.productName}</span>
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => updateMeetingStatus(selectedMeeting._id, "completed")}
                >
                  Mark as Completed
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => updateMeetingStatus(selectedMeeting._id, "cancelled")}
                >
                  Cancel Meeting
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


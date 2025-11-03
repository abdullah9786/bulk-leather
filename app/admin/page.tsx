"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { 
  Package, 
  Mail, 
  Calendar, 
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle
} from "lucide-react";

interface DashboardStats {
  overview: {
    totalProducts: number;
    activeProducts: number;
    totalInquiries: number;
    newInquiries: number;
    totalMeetings: number;
    upcomingMeetings: number;
    conversionRate: number;
  };
  recentInquiries: any[];
  recentMeetings: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    overview: {
      totalProducts: 0,
      activeProducts: 0,
      totalInquiries: 0,
      newInquiries: 0,
      totalMeetings: 0,
      upcomingMeetings: 0,
      conversionRate: 0,
    },
    recentInquiries: [],
    recentMeetings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("/api/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.overview.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      change: `${stats.overview.activeProducts} active`,
    },
    {
      title: "Total Inquiries",
      value: stats.overview.totalInquiries,
      icon: Mail,
      color: "bg-green-500",
      change: `${stats.overview.newInquiries} new`,
    },
    {
      title: "Scheduled Meetings",
      value: stats.overview.totalMeetings,
      icon: Calendar,
      color: "bg-purple-500",
      change: `${stats.overview.upcomingMeetings} upcoming`,
    },
    {
      title: "Conversion Rate",
      value: `${stats.overview.conversionRate}%`,
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "From inquiries",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Inquiries</h2>
            <a 
              href="/admin/inquiries"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              View all →
            </a>
          </div>
          <div className="space-y-4">
            {stats.recentInquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No recent inquiries
              </div>
            ) : (
              stats.recentInquiries.map((inquiry) => (
                <div key={inquiry._id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {inquiry.company}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{inquiry.inquiryType} inquiry</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    inquiry.status === 'new' ? 'bg-green-100 text-green-700' :
                    inquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                    inquiry.status === 'converted' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {inquiry.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Meetings</h2>
            <a 
              href="/admin/meetings"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              View all →
            </a>
          </div>
          <div className="space-y-4">
            {stats.recentMeetings.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No upcoming meetings
              </div>
            ) : (
              stats.recentMeetings.map((meeting) => (
                <div key={meeting._id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {meeting.company}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{meeting.meetingType} meeting</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(meeting.date).toLocaleDateString()} at {meeting.timeSlot}
                    </p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full capitalize">
                    {meeting.meetingMode}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/products?action=new"
            className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-amber-500 hover:bg-amber-50 transition-all"
          >
            <Package className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Product</span>
          </a>
          <a
            href="/admin/categories?action=new"
            className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-amber-500 hover:bg-amber-50 transition-all"
          >
            <Package className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Category</span>
          </a>
          <a
            href="/admin/inquiries"
            className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-amber-500 hover:bg-amber-50 transition-all"
          >
            <Mail className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Inquiries</span>
          </a>
          <a
            href="/admin/meetings"
            className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-amber-500 hover:bg-amber-50 transition-all"
          >
            <Calendar className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Meetings</span>
          </a>
        </div>
      </div>
    </div>
  );
}


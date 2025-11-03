"use client";

import React, { useEffect, useState } from "react";
import { 
  Mail, 
  Search, 
  Filter,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  inquiryType: string;
  message: string;
  sampleCartItems?: Array<{ productName: string; quantity: number }>;
  status: string;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    filterInquiries();
  }, [searchTerm, statusFilter, inquiries]);

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("/api/inquiries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterInquiries = () => {
    let filtered = inquiries;

    if (searchTerm) {
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((i) => i.status === statusFilter);
    }

    setFilteredInquiries(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "contacted":
        return "bg-yellow-100 text-yellow-700";
      case "quoted":
        return "bg-purple-100 text-purple-700";
      case "converted":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bulk":
        return "bg-orange-100 text-orange-700";
      case "sample":
        return "bg-blue-100 text-blue-700";
      case "partnership":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchInquiries();
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inquiries</h1>
        <p className="text-gray-500">Manage customer inquiries and requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", count: inquiries.length, color: "bg-blue-500" },
          { label: "New", count: inquiries.filter(i => i.status === "new").length, color: "bg-green-500" },
          { label: "In Progress", count: inquiries.filter(i => i.status === "contacted" || i.status === "quoted").length, color: "bg-yellow-500" },
          { label: "Converted", count: inquiries.filter(i => i.status === "converted").length, color: "bg-purple-500" },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <Mail className="w-5 h-5 text-white" />
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
              placeholder="Search by name, company, or email..."
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Inquiries List */}
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
                  Message
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Samples
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date
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
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No inquiries found
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {inquiry.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{inquiry.company}</p>
                        <p className="text-xs text-gray-400 truncate">{inquiry.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(inquiry.inquiryType)}`}>
                        {inquiry.inquiryType}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {inquiry.message}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {inquiry.sampleCartItems && inquiry.sampleCartItems.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {inquiry.sampleCartItems.length}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Inquiry Details</h2>
              <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-medium text-gray-900">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Company</p>
                  <p className="font-medium text-gray-900">{selectedInquiry.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${selectedInquiry.email}`} className="font-medium text-amber-600 hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <a href={`tel:${selectedInquiry.phone}`} className="font-medium text-amber-600 hover:underline">
                    {selectedInquiry.phone}
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Message</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedInquiry.message}</p>
              </div>
              {selectedInquiry.sampleCartItems && selectedInquiry.sampleCartItems.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Sample Cart Items</p>
                  <div className="space-y-2">
                    {selectedInquiry.sampleCartItems.map((item, index) => (
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
                  onClick={() => updateInquiryStatus(selectedInquiry._id, "contacted")}
                >
                  Mark as Contacted
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => updateInquiryStatus(selectedInquiry._id, "quoted")}
                >
                  Mark as Quoted
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => updateInquiryStatus(selectedInquiry._id, "converted")}
                >
                  Mark as Converted
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


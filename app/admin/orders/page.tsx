"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Package, 
  Search, 
  Filter,
  ExternalLink,
  XCircle,
  Truck,
  DollarSign
} from "lucide-react";

interface Order {
  _id: string;
  userName: string;
  userEmail: string;
  totalItems: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    productImage: string;
  }>;
  createdAt: string;
  specialOffer?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const updateOrderStatus = async (orderId: string, field: string, value: string) => {
    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        fetchOrders();
        setSelectedOrder(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to update order"}`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "processing": return "bg-purple-100 text-purple-700";
      case "shipped": return "bg-indigo-100 text-indigo-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sample Orders</h1>
        <p className="text-gray-500">Manage customer sample orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Orders", count: orders.length, color: "bg-blue-500" },
          { label: "Pending", count: orders.filter(o => o.orderStatus === "pending").length, color: "bg-yellow-500" },
          { label: "Delivered", count: orders.filter(o => o.orderStatus === "delivered").length, color: "bg-green-500" },
          { label: "COD Orders", count: orders.filter(o => o.paymentMethod === "cod").length, color: "bg-orange-500" },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Order Status
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
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{order.userName}</p>
                        <p className="text-xs text-gray-500">{order.userEmail}</p>
                        <p className="text-xs text-gray-400">
                          {order.shippingAddress.city}, {order.shippingAddress.country}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {order.totalItems} samples
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentMethod === "cod"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {order.paymentMethod === "cod" ? "COD" : "Advance"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getPaymentColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto my-4 md:my-8 p-4 md:p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Current Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Order Status</p>
                    <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedOrder.orderStatus)}`}>
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Payment Status</p>
                    <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getPaymentColor(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{selectedOrder.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${selectedOrder.userEmail}`} className="font-medium text-amber-600 hover:underline text-sm">
                      {selectedOrder.userEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-700 mt-1">{selectedOrder.shippingAddress.address}</p>
                  <p className="text-sm text-gray-700">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.country}</p>
                  <p className="text-sm text-gray-600 mt-2">Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Sample Items ({selectedOrder.totalItems})</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Payment Method</p>
                    <p className="text-sm text-blue-700 capitalize mt-1">
                      {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Advance Payment"}
                    </p>
                  </div>
                  {selectedOrder.paymentMethod === "advance" && (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                      10% OFF Applied
                    </span>
                  )}
                </div>
              </div>

              {selectedOrder.specialOffer && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-800 mb-1">Special Offer Applied!</p>
                  <p className="text-sm text-green-700">{selectedOrder.specialOffer}</p>
                </div>
              )}

              {/* Update Order Status */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Update Order Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder._id, "orderStatus", "confirmed")}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium"
                    disabled={selectedOrder.orderStatus === "confirmed"}
                  >
                    ✓ Confirm Order
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder._id, "orderStatus", "processing")}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors text-sm font-medium"
                    disabled={selectedOrder.orderStatus === "processing"}
                  >
                    🔄 Processing
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder._id, "orderStatus", "shipped")}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors text-sm font-medium"
                    disabled={selectedOrder.orderStatus === "shipped"}
                  >
                    📦 Shipped
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder._id, "orderStatus", "delivered")}
                    className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-sm font-medium"
                    disabled={selectedOrder.orderStatus === "delivered"}
                  >
                    ✅ Delivered
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder._id, "orderStatus", "cancelled")}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-sm font-medium"
                    disabled={selectedOrder.orderStatus === "cancelled"}
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>

              {/* Update Payment Status */}
              {selectedOrder.paymentMethod === "advance" && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Update Payment Status</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => updateOrderStatus(selectedOrder._id, "paymentStatus", "pending")}
                      className="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors text-sm font-medium"
                      disabled={selectedOrder.paymentStatus === "pending"}
                    >
                      ⏳ Pending
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder._id, "paymentStatus", "paid")}
                      className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-sm font-medium"
                      disabled={selectedOrder.paymentStatus === "paid"}
                    >
                      ✓ Paid
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder._id, "paymentStatus", "failed")}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-sm font-medium"
                      disabled={selectedOrder.paymentStatus === "failed"}
                    >
                      ✕ Failed
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


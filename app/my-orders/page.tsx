"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Package, MapPin, DollarSign, Clock } from "lucide-react";

interface Order {
  _id: string;
  items: Array<{
    productName: string;
    quantity: number;
    productImage: string;
  }>;
  shippingAddress: any;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalItems: number;
  specialOffer?: string;
  createdAt: string;
}

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/my-orders");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
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
            My Orders
          </h1>
          <p className="text-lg text-[var(--color-body)]">
            Track your sample orders and delivery status
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <Package className="w-20 h-20 text-[var(--color-body)]/30 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
              No Orders Yet
            </h3>
            <p className="text-[var(--color-body)] mb-6">
              You haven't placed any sample orders yet
            </p>
            <Button onClick={() => router.push("/products")}>
              Browse Products
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        <span className="text-sm text-[var(--color-body)]">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-[var(--color-text)] text-sm">
                                {item.productName}
                              </p>
                              <p className="text-xs text-[var(--color-body)]">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.specialOffer && (
                        <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-lg p-3 mb-4">
                          <p className="text-xs font-semibold text-[var(--color-accent)]">
                            ✨ {order.specialOffer}
                          </p>
                        </div>
                      )}

                      {/* Shipping Info */}
                      <div className="flex items-start gap-2 text-sm text-[var(--color-body)]">
                        <MapPin className="w-4 h-4 text-[var(--color-accent)] mt-0.5" />
                        <span>
                          {order.shippingAddress.city}, {order.shippingAddress.country}
                        </span>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="md:w-64 bg-[var(--color-secondary)] rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--color-body)]">Total Samples:</span>
                          <span className="font-bold text-[var(--color-text)]">
                            {order.totalItems}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--color-body)]">Payment:</span>
                          <span className="font-semibold text-[var(--color-text)] capitalize">
                            {order.paymentMethod === "cod" ? "COD" : "Advance"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--color-body)]">Payment Status:</span>
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                            order.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                            order.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


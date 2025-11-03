"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useCart } from "@/contexts/CartContext";
import { 
  Package, 
  MapPin, 
  CreditCard, 
  CheckCircle,
  DollarSign,
  Truck,
  Sparkles
} from "lucide-react";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    paymentMethod: "cod",
    notes: "",
  });

  useEffect(() => {
    console.log("🔐 Checkout page - Auth status:", status);
    console.log("Session:", session?.user);
    
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      console.log("⚠️ Not authenticated, redirecting to sign in...");
      router.push("/auth/signin?callbackUrl=/checkout");
    }

    // Pre-fill name if session available
    if (session?.user?.name) {
      console.log("✅ Pre-filling name from session:", session.user.name);
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || session.user.name || "",
      }));
    }
  }, [status, session, router]);

  useEffect(() => {
    // Redirect if cart is empty
    if (!loading && cartItems.length === 0 && !orderPlaced) {
      router.push("/products");
    }
  }, [cartItems, loading, orderPlaced, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📦 Submitting order...");
    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: (item.product as any)._id || item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          productImage: item.product.images[0],
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      console.log("Order payload:", orderPayload);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      console.log("Order response status:", response.status);
      const data = await response.json();
      console.log("Order response data:", data);

      if (data.success) {
        console.log("✅ Order placed successfully!");
        setOrderData(data.data);
        setOrderPlaced(true);
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        console.error("❌ Order failed:", data.error);
        alert(`Error: ${data.error || "Failed to place order"}`);
      }
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orderPlaced && orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] mb-4">
                  Order Placed Successfully!
                </h1>
                <p className="text-lg text-[var(--color-body)] mb-6">
                  {orderData.paymentMethod === "advance"
                    ? "Payment link has been sent to your email with a special 10% discount offer!"
                    : "Your order has been received. We'll contact you shortly to confirm."}
                </p>

                {orderData.specialOffer && (
                  <div className="bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)]/30 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Sparkles className="w-6 h-6 text-[var(--color-accent)]" />
                      <h3 className="font-semibold text-[var(--color-text)]">Special Offer!</h3>
                    </div>
                    <p className="text-[var(--color-body)]">{orderData.specialOffer}</p>
                  </div>
                )}

                <div className="bg-[var(--color-secondary)] rounded-lg p-6 mb-6 text-left">
                  <h3 className="font-semibold text-[var(--color-text)] mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-body)]">Total Samples:</span>
                      <span className="font-semibold text-[var(--color-text)]">
                        {orderData.totalItems} items
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-body)]">Payment Method:</span>
                      <span className="font-semibold text-[var(--color-text)] capitalize">
                        {orderData.paymentMethod === "cod" ? "Cash on Delivery" : "Advance Payment"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-body)]">Status:</span>
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                        {orderData.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[var(--color-body)] mb-8">
                  Order confirmation has been sent to <strong>{session?.user?.email}</strong>
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => router.push("/products")}>
                    Continue Shopping
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Back to Home
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
              Checkout
            </h1>
            <p className="text-lg text-[var(--color-body)]">
              Complete your sample order
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Address */}
                <Card>
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-[var(--color-accent)]" />
                    <h2 className="text-2xl font-serif text-[var(--color-text)]">
                      Shipping Address
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Full Name *"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                    />

                    <Input
                      label="Phone Number *"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+1 (234) 567-890"
                    />

                    <Input
                      label="Street Address *"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="123 Main Street, Apt 4B"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="City *"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="New York"
                      />
                      <Input
                        label="State/Province *"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="NY"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Country *"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        placeholder="United States"
                      />
                      <Input
                        label="Postal Code *"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </Card>

                {/* Payment Method */}
                <Card>
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-[var(--color-accent)]" />
                    <h2 className="text-2xl font-serif text-[var(--color-text)]">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* COD Option */}
                    <div
                      onClick={() => setFormData({ ...formData, paymentMethod: "cod" })}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === "cod"
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                          : "border-[var(--color-secondary)] hover:border-[var(--color-accent)]/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.paymentMethod === "cod"
                                ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.paymentMethod === "cod" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-[var(--color-accent)]" />
                            <h3 className="font-semibold text-[var(--color-text)]">
                              Cash on Delivery (COD)
                            </h3>
                          </div>
                          <p className="text-sm text-[var(--color-body)]">
                            Pay when you receive the samples
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Advance Payment Option */}
                    <div
                      onClick={() => setFormData({ ...formData, paymentMethod: "advance" })}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === "advance"
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                          : "border-[var(--color-secondary)] hover:border-[var(--color-accent)]/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.paymentMethod === "advance"
                                ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.paymentMethod === "advance" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                            <h3 className="font-semibold text-[var(--color-text)]">
                              Advance Payment
                            </h3>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                              10% OFF
                            </span>
                          </div>
                          <p className="text-sm text-[var(--color-body)] mb-2">
                            Pay now and get 10% discount on your order
                          </p>
                          <p className="text-xs text-[var(--color-body)]">
                            Payment link will be sent to your email
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Additional Notes */}
                <Card>
                  <Textarea
                    label="Additional Notes (Optional)"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Any special instructions or requirements..."
                  />
                </Card>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 w-5 h-5" />
                      Place Order
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <h2 className="text-xl font-serif text-[var(--color-text)] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 pb-4 border-b border-[var(--color-secondary)]"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--color-text)] text-sm truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-[var(--color-body)]">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-xs text-[var(--color-body)] mt-1">
                          Sample Request
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[var(--color-secondary)] pt-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[var(--color-body)]">Total Samples:</span>
                    <span className="font-bold text-[var(--color-text)]">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-body)]">Payment:</span>
                    <span className="font-bold text-[var(--color-text)] capitalize">
                      {formData.paymentMethod === "cod" ? "COD" : "Advance (10% OFF)"}
                    </span>
                  </div>
                </div>

                <div className="bg-[var(--color-secondary)] rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Package className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)] mb-1">
                        Sample Delivery
                      </p>
                      <p className="text-xs text-[var(--color-body)]">
                        Estimated delivery: 7-10 business days
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


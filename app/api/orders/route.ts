import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().min(1),
    productImage: z.string(),
  })).min(1),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string(),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    country: z.string().min(2),
    postalCode: z.string(),
  }),
  paymentMethod: z.enum(["cod", "advance"]),
  notes: z.string().optional(),
});

// POST create order (authenticated users only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const validatedData = orderSchema.parse(body);

    const totalItems = validatedData.items.reduce((sum, item) => sum + item.quantity, 0);

    const orderData: any = {
      userId: (session.user as any).id,
      userEmail: session.user.email,
      userName: session.user.name,
      items: validatedData.items,
      shippingAddress: validatedData.shippingAddress,
      paymentMethod: validatedData.paymentMethod,
      totalItems,
      notes: validatedData.notes,
      paymentStatus: validatedData.paymentMethod === "cod" ? "pending" : "pending",
      orderStatus: "pending",
    };

    // If advance payment, add special offer
    if (validatedData.paymentMethod === "advance") {
      orderData.specialOffer = "Get 10% discount on advance payment! Payment link will be sent to your email.";
      // TODO: Generate payment link
      orderData.advancePaymentLink = `https://payment.bulkleather.com/pay/${Date.now()}`;
      // TODO: Send email with payment link
    }

    const order = await Order.create(orderData);

    return NextResponse.json({
      success: true,
      data: order,
      message: validatedData.paymentMethod === "advance" 
        ? "Order placed! Payment link has been sent to your email with 10% discount offer."
        : "Order placed successfully! We'll contact you shortly to confirm your order.",
    }, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET user's orders (authenticated users only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    const userId = (session.user as any).id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}


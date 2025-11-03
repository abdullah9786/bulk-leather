import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { withAdminAuth } from "@/lib/middleware";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  phone: z.string(),
  inquiryType: z.enum(["bulk", "sample", "general", "partnership", "support"]),
  inquirySource: z.enum(["contact-form", "product-page", "customization-form"]),
  productInterest: z.string().optional(),
  productId: z.string().optional(),
  customizationDetails: z.object({
    type: z.string(),
    quantity: z.string(),
    budget: z.string().optional(),
    timeline: z.string().optional(),
  }).optional(),
  message: z.string().min(10),
  sampleCartItems: z.array(z.object({
    productName: z.string(),
    quantity: z.number(),
  })).optional(),
});

// GET all inquiries (admin only)
export const GET = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    let query: any = {};
    if (status) query.status = status;
    if (type) query.inquiryType = type;

    const skip = (page - 1) * limit;
    
    const [inquiries, total] = await Promise.all([
      Inquiry.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      Inquiry.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
});

// POST create inquiry (public)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = inquirySchema.parse(body);

    // Check if user is logged in
    const session = await getServerSession(authOptions);
    
    // Use userId if logged in, otherwise use email as identifier
    const userId = session?.user ? (session.user as any).id : validatedData.email;

    const inquiry = await Inquiry.create({
      ...validatedData,
      userId, // Link to user ID if logged in, or use email if guest
    });

    console.log("✅ Inquiry created:", inquiry._id);
    console.log("📋 Inquiry source:", validatedData.inquirySource);
    console.log("📧 Customer email:", validatedData.email);
    if (session?.user) {
      console.log("✅ Linked to user ID:", userId);
      console.log("👤 User email:", session.user.email);
    } else {
      console.log("ℹ️ Guest inquiry - using email as userId:", userId);
    }

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to customer

    return NextResponse.json({
      success: true,
      data: inquiry,
      message: "Inquiry submitted successfully. We'll contact you within 24 hours.",
    }, { status: 201 });
  } catch (error) {
    console.error("Create inquiry error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}


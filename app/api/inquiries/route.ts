import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  phone: z.string(),
  inquiryType: z.enum(["bulk", "sample", "general", "partnership", "support"]),
  productInterest: z.string().optional(),
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

    const inquiry = await Inquiry.create(validatedData);

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


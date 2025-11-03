import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";

const meetingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  phone: z.string(),
  meetingType: z.enum(["consultation", "product", "custom", "samples", "partnership"]),
  meetingMode: z.enum(["video", "phone", "whatsapp", "inperson"]),
  date: z.string(),
  timeSlot: z.string(),
  message: z.string().optional(),
  sampleCartItems: z.array(z.object({
    productName: z.string(),
    quantity: z.number(),
  })).optional(),
});

// GET all meetings (admin only)
export const GET = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    let query: any = {};
    if (status) query.status = status;
    if (from) query.date = { $gte: new Date(from) };
    if (to) query.date = { ...query.date, $lte: new Date(to) };

    const skip = (page - 1) * limit;
    
    const [meetings, total] = await Promise.all([
      Meeting.find(query)
        .sort({ date: 1 })
        .limit(limit)
        .skip(skip),
      Meeting.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: meetings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get meetings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
});

// POST create meeting (public)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = meetingSchema.parse(body);

    const meeting = await Meeting.create({
      ...validatedData,
      date: new Date(validatedData.date),
    });

    // TODO: Send calendar invite
    // TODO: Send confirmation email

    return NextResponse.json({
      success: true,
      data: meeting,
      message: "Meeting scheduled successfully. You'll receive a confirmation email shortly.",
    }, { status: 201 });
  } catch (error) {
    console.error("Create meeting error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to schedule meeting" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";

const inquiryUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "quoted", "converted", "closed"]).optional(),
  notes: z.string().optional(),
});

// GET single inquiry (admin only)
export const GET = withAdminAuth(async (
  req: NextRequest,
  userId: string
) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error("Get inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiry" },
      { status: 500 }
    );
  }
});

// PUT update inquiry (admin only)
export const PUT = withAdminAuth(async (req: NextRequest, userId: string) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const body = await req.json();
    const validatedData = inquiryUpdateSchema.parse(body);

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error("Update inquiry error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
});

// DELETE inquiry (admin only)
export const DELETE = withAdminAuth(async (req: NextRequest, userId: string) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
});


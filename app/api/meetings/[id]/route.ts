import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";

const meetingUpdateSchema = z.object({
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
  notes: z.string().optional(),
  date: z.string().optional(),
  timeSlot: z.string().optional(),
});

// GET single meeting (admin only)
export const GET = withAdminAuth(async (req: NextRequest, userId: string) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    console.error("Get meeting error:", error);
    return NextResponse.json(
      { error: "Failed to fetch meeting" },
      { status: 500 }
    );
  }
});

// PUT update meeting (admin only)
export const PUT = withAdminAuth(async (req: NextRequest, userId: string) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const body = await req.json();
    const validatedData = meetingUpdateSchema.parse(body);

    const updateData: any = { ...validatedData };
    if (validatedData.date) {
      updateData.date = new Date(validatedData.date);
    }

    const meeting = await Meeting.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    console.error("Update meeting error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update meeting" },
      { status: 500 }
    );
  }
});

// DELETE meeting (admin only)
export const DELETE = withAdminAuth(async (req: NextRequest, userId: string) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const meeting = await Meeting.findByIdAndDelete(id);

    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    console.error("Delete meeting error:", error);
    return NextResponse.json(
      { error: "Failed to delete meeting" },
      { status: 500 }
    );
  }
});


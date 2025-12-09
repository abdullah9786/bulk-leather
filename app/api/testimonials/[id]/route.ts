import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(2).optional(),
  company: z.string().min(2).optional(),
  role: z.string().min(2).optional(),
  content: z.string().min(10).optional(),
  avatar: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
  rating: z.number().min(1).max(5).optional(),
});

// PUT update testimonial (admin only)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    console.log("🔄 PUT /api/testimonials/[id] - Starting update");
    console.log("📝 Testimonial ID:", params.id);
    
    // Check admin auth
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      console.log("❌ No token provided");
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    const { verifyToken } = await import("@/lib/auth");
    const payload = verifyToken(token);
    if (!payload) {
      console.log("❌ Invalid token");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    
    if (payload.role !== "admin") {
      console.log("❌ Not admin role:", payload.role);
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.log("✅ Auth verified - Admin:", payload.userId);

    await connectDB();

    const body = await req.json();
    console.log("📦 Update data:", body);
    
    const validatedData = testimonialSchema.parse(body);

    const testimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      console.log("❌ Testimonial not found:", params.id);
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    console.log("✅ Testimonial updated successfully");
    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error: any) {
    console.error("❌ Update testimonial error:", error);
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update testimonial", message: error.message },
      { status: 500 }
    );
  }
}

// DELETE testimonial (admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    console.log("🗑️ DELETE /api/testimonials/[id] - Starting delete");
    console.log("📝 Testimonial ID:", params.id);
    
    // Check admin auth
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      console.log("❌ No token provided");
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    const { verifyToken } = await import("@/lib/auth");
    const payload = verifyToken(token);
    if (!payload) {
      console.log("❌ Invalid token");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    
    if (payload.role !== "admin") {
      console.log("❌ Not admin role:", payload.role);
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.log("✅ Auth verified - Admin:", payload.userId);

    await connectDB();

    const testimonial = await Testimonial.findByIdAndDelete(params.id);

    if (!testimonial) {
      console.log("❌ Testimonial not found:", params.id);
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    console.log("✅ Testimonial deleted successfully");
    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ Delete testimonial error:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial", message: error.message },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

const galleryUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  mediaType: z.enum(["image", "video"]).optional(),
  mediaUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  category: z.enum(["factory-tour", "manufacturing", "workers", "products", "other"]).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

// PUT update gallery item (admin only)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    
    // Admin authentication
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    await connectDB();

    const body = await req.json();
    const validatedData = galleryUpdateSchema.parse(body);

    const item = await Gallery.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    console.log("✅ Gallery item updated:", item._id);

    return NextResponse.json({
      success: true,
      data: item,
      message: "Gallery item updated successfully",
    });
  } catch (error) {
    console.error("Update gallery item error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update gallery item" },
      { status: 500 }
    );
  }
}

// DELETE gallery item (admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    
    // Admin authentication
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    await connectDB();

    const item = await Gallery.findByIdAndDelete(params.id);

    if (!item) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    console.log("✅ Gallery item deleted:", params.id);

    return NextResponse.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery item error:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";

const gallerySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  mediaType: z.enum(["image", "video"]),
  mediaUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  category: z.enum(["factory-tour", "manufacturing", "workers", "products", "other"]),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

// GET all gallery items (public - only active items, admin - all items)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const mediaType = searchParams.get("mediaType");
    const isAdmin = searchParams.get("admin") === "true";

    let query: any = {};
    
    // Only show active items for public
    if (!isAdmin) {
      query.isActive = true;
    }
    
    if (category) query.category = category;
    if (mediaType) query.mediaType = mediaType;

    const items = await Gallery.find(query)
      .sort({ displayOrder: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get gallery error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

// POST create gallery item (admin only)
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = gallerySchema.parse(body);

    const item = await Gallery.create(validatedData);

    console.log("✅ Gallery item created:", item._id);

    return NextResponse.json({
      success: true,
      data: item,
      message: "Gallery item created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Create gallery item error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create gallery item" },
      { status: 500 }
    );
  }
});


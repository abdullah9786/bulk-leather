import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  image: z.string().url(),
  isActive: z.boolean().optional(),
});

// GET all categories (public)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get("isActive");

    let query: any = {};
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const categories = await Category.find(query).sort({ name: 1 });

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST create category (admin only)
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = categorySchema.parse(body);

    const category = await Category.create(validatedData);

    return NextResponse.json({
      success: true,
      data: category,
    }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
});


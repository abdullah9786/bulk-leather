import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Redirect from "@/models/Redirect";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";

const categoryUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().optional(),
  metaTitle: z.string().max(60).optional().nullable().transform(val => val || undefined),
  metaDescription: z.string().max(160).optional().nullable().transform(val => val || undefined),
});

// GET single category (public)
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    await connectDB();

    const category = await Category.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT update category (admin only)
export const PUT = withAdminAuth(async (req: NextRequest, userId: string) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const body = await req.json();
    const { createRedirect, oldSlug, ...categoryData } = body;
    console.log("📥 Update category request body:", body);
    console.log("🔍 Meta fields in request:", { metaTitle: body.metaTitle, metaDescription: body.metaDescription });
    const validatedData = categoryUpdateSchema.parse(categoryData);
    console.log("✅ Validated category data:", validatedData);
    console.log("🔍 Meta fields after validation:", { metaTitle: validatedData.metaTitle, metaDescription: validatedData.metaDescription });

    // Create redirect if requested and slug changed
    if (createRedirect && oldSlug && validatedData.slug && oldSlug !== validatedData.slug) {
      try {
        // Check if redirect already exists
        const existingRedirect = await Redirect.findOne({ 
          fromSlug: oldSlug, 
          type: "category" 
        });

        if (existingRedirect) {
          // Update existing redirect
          await Redirect.findByIdAndUpdate(existingRedirect._id, {
            toSlug: validatedData.slug,
            isActive: true,
          });
          console.log(`✅ Updated redirect: ${oldSlug} → ${validatedData.slug}`);
        } else {
          // Create new redirect
          await Redirect.create({
            fromSlug: oldSlug,
            toSlug: validatedData.slug,
            type: "category",
            isActive: true,
          });
          console.log(`✅ Created redirect: ${oldSlug} → ${validatedData.slug}`);
        }
      } catch (redirectError) {
        console.error("Error creating redirect:", redirectError);
        // Don't fail the category update if redirect fails
      }
    }

    const category = await Category.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
});

// DELETE category (admin only)
export const DELETE = withAdminAuth(async (req: NextRequest, userId: string) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
});


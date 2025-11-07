import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Redirect from "@/models/Redirect";

// GET category by slug (public)
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    // First, try to find the category
    let category = await Category.findOne({ 
      slug: params.slug,
      isActive: true 
    });

    // If not found, check if there's a redirect
    if (!category) {
      const redirect = await Redirect.findOne({
        fromSlug: params.slug,
        type: "category",
        isActive: true,
      });

      if (redirect) {
        // Return redirect information
        return NextResponse.json({
          success: true,
          redirect: true,
          newSlug: redirect.toSlug,
        });
      }

      // Category not found and no redirect
      return NextResponse.json(
        { 
          success: false,
          error: "Category not found" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get category by slug error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch category" 
      },
      { status: 500 }
    );
  }
}


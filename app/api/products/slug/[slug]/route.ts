import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Redirect from "@/models/Redirect";

// GET product by slug (public)
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    await connectDB();

    // First, try to find the product
    let product = await Product.findOne({ 
      slug: params.slug,
      isActive: true 
    });

    // If not found, check if there's a redirect
    if (!product) {
      const redirect = await Redirect.findOne({
        fromSlug: params.slug,
        type: "product",
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

      // Product not found and no redirect
      return NextResponse.json(
        { 
          success: false,
          error: "Product not found" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product by slug error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch product" 
      },
      { status: 500 }
    );
  }
}


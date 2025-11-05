import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";

const productUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.string().optional(),
  description: z.string().min(10).optional(),
  material: z.string().optional(),
  images: z.array(z.string()).min(1).optional(),
  moq: z.number().min(1).optional(),
  priceRange: z.string().optional(),
  samplePrice: z.number().min(0).optional(),
  features: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// GET single product (public)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT update product (admin only)
export const PUT = withAdminAuth(async (
  req: NextRequest,
  userId: string
) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const body = await req.json();
    console.log("📥 Update request body:", body);
    console.log("💰 SamplePrice in request:", body.samplePrice);
    
    const validatedData = productUpdateSchema.parse(body);
    console.log("✅ Validated data:", validatedData);
    console.log("💰 SamplePrice after validation:", validatedData.samplePrice);

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("📦 Updated product from DB:", product);
    console.log("💰 SamplePrice in response:", product.samplePrice);
    console.log("📋 Full product object:", JSON.stringify(product, null, 2));
    
    // Double-check what's actually in the database
    const verifyProduct = await Product.findById(id);
    console.log("🔍 Verification query - samplePrice:", verifyProduct?.samplePrice);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
});

// DELETE product (admin only)
export const DELETE = withAdminAuth(async (
  req: NextRequest,
  userId: string
) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
});


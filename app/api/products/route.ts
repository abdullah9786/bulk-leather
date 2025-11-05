import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  category: z.string(),
  description: z.string().min(10),
  material: z.string(),
  images: z.array(z.string()).min(1),
  moq: z.number().min(1),
  priceRange: z.string(),
  samplePrice: z.number().min(0).optional(),
  features: z.array(z.string()),
  colors: z.array(z.string()),
  sizes: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// GET all products (public)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");

    let query: any = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create product (admin only)
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = productSchema.parse(body);

    const product = await Product.create(validatedData);

    return NextResponse.json({
      success: true,
      data: product,
    }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
});


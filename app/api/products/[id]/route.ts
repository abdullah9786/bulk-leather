import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Redirect from "@/models/Redirect";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const productUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
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
  metaTitle: z.string().max(60).optional().nullable().transform(val => val || undefined),
  metaDescription: z.string().max(160).optional().nullable().transform(val => val || undefined),
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
    const { createRedirect, oldSlug, ...productData } = body;
    
    console.log("📥 Update request body:", body);
    console.log("💰 SamplePrice in request:", body.samplePrice);
    console.log("🔖 Slug in request:", body.slug);
    console.log("🔍 Meta fields in request:", { metaTitle: body.metaTitle, metaDescription: body.metaDescription });
    
    const validatedData = productUpdateSchema.parse(productData);
    console.log("✅ Validated data:", validatedData);
    console.log("💰 SamplePrice after validation:", validatedData.samplePrice);
    console.log("🔖 Slug after validation:", validatedData.slug);
    console.log("🔍 Meta fields after validation:", { metaTitle: validatedData.metaTitle, metaDescription: validatedData.metaDescription });

    // Auto-generate slug if updating name but no slug provided
    if (validatedData.name && !validatedData.slug) {
      validatedData.slug = generateSlug(validatedData.name);
      console.log("🔖 Auto-generated slug:", validatedData.slug);
    }

    // Check for duplicate slug (excluding current product)
    if (validatedData.slug) {
      const existingProduct = await Product.findOne({ 
        slug: validatedData.slug,
        _id: { $ne: id }
      });
      if (existingProduct) {
        return NextResponse.json(
          { error: `A product with slug "${validatedData.slug}" already exists. Please use a different slug.` },
          { status: 400 }
        );
      }
    }

    // Handle redirect creation if slug changed
    if (createRedirect && oldSlug && validatedData.slug && oldSlug !== validatedData.slug) {
      try {
        const existingRedirect = await Redirect.findOne({ 
          fromSlug: oldSlug, 
          type: "product" 
        });
        
        if (existingRedirect) {
          await Redirect.findByIdAndUpdate(existingRedirect._id, { 
            toSlug: validatedData.slug, 
            isActive: true 
          });
          console.log(`✅ Updated redirect: ${oldSlug} → ${validatedData.slug}`);
        } else {
          await Redirect.create({ 
            fromSlug: oldSlug, 
            toSlug: validatedData.slug, 
            type: "product", 
            isActive: true 
          });
          console.log(`✅ Created redirect: ${oldSlug} → ${validatedData.slug}`);
        }
      } catch (redirectError) {
        console.error("Error creating redirect:", redirectError);
      }
    }

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


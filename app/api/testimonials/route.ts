import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  role: z.string().min(2),
  content: z.string().min(10),
  avatar: z.string().url().optional(),
  isActive: z.boolean().optional(),
  rating: z.number().min(1).max(5).optional(),
});

// GET all testimonials (public)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get("isActive");

    let query: any = {};
    if (isActive === "true") {
      query.isActive = true;
    }

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    console.error("Get testimonials error:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST create testimonial (admin only)
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = testimonialSchema.parse(body);

    const testimonial = await Testimonial.create(validatedData);

    return NextResponse.json({
      success: true,
      data: testimonial,
    }, { status: 201 });
  } catch (error) {
    console.error("Create testimonial error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
});


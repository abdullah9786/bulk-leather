import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Testimonial from "@/models/Testimonial";
import { hashPassword } from "@/lib/auth";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import testimonialsData from "@/data/testimonials.json";

/**
 * Setup endpoint - Creates admin user and imports data
 * Only works if no users exist in database
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Check if setup already done
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return NextResponse.json(
        { error: "Setup already completed. Admin user exists." },
        { status: 400 }
      );
    }

    // Create admin user
    const hashedPassword = await hashPassword("admin123");
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@bulkleather.com",
      password: hashedPassword,
      role: "admin",
    });

    // Import categories
    await Category.insertMany(
      categoriesData.map((cat: any) => ({
        ...cat,
        isActive: true,
      }))
    );

    // Import products
    await Product.insertMany(
      productsData.map((product: any) => ({
        ...product,
        isActive: true,
      }))
    );

    // Import testimonials
    await Testimonial.insertMany(
      testimonialsData.map((testimonial: any) => ({
        ...testimonial,
        isActive: true,
        rating: 5,
      }))
    );

    return NextResponse.json({
      success: true,
      message: "Setup completed successfully!",
      credentials: {
        email: "admin@bulkleather.com",
        password: "admin123",
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Setup failed. Check server logs." },
      { status: 500 }
    );
  }
}

/**
 * Check if setup is needed
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    const testimonialCount = await Testimonial.countDocuments();

    return NextResponse.json({
      success: true,
      setupNeeded: userCount === 0,
      stats: {
        users: userCount,
        products: productCount,
        categories: categoryCount,
        testimonials: testimonialCount,
      },
    });
  } catch (error) {
    console.error("Setup check error:", error);
    return NextResponse.json(
      { error: "Failed to check setup status" },
      { status: 500 }
    );
  }
}


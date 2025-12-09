import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { withAdminAuth } from "@/lib/middleware";
import { z } from "zod";
import bcrypt from "bcryptjs";

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["admin", "user"]).optional(),
});

// PUT update user (admin only)
export const PUT = withAdminAuth(async (req: NextRequest, context?: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    // Get params - in Next.js 14+, params is a Promise
    const params = context?.params ? await context.params : null;
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = updateUserSchema.parse(body);

    // If email is being updated, check if it's already taken
    if (validatedData.email) {
      const existingUser = await User.findOne({ 
        email: validatedData.email,
        _id: { $ne: id }
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use by another user" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {
      ...validatedData,
    };

    // Hash password if being updated
    if (validatedData.password) {
      updateData.password = await bcrypt.hash(validatedData.password, 10);
    } else {
      delete updateData.password; // Don't update password if not provided
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
});

// DELETE user (admin only)
export const DELETE = withAdminAuth(async (req: NextRequest, context?: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    // Get params - in Next.js 14+, params is a Promise
    const params = context?.params ? await context.params : null;
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
});


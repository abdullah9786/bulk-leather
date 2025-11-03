import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET user's own inquiries (authenticated users only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    const loggedInUserId = (session.user as any).id;
    const userEmail = session.user.email as string;
    
    console.log("🔍 Fetching inquiries for user:", loggedInUserId);
    console.log("📧 User email:", userEmail);
    
    // Find inquiries where userId matches either:
    // 1. The actual user ID (if they were logged in when submitting)
    // 2. Their email address (if they submitted as guest)
    const inquiries = await Inquiry.find({
      $or: [
        { userId: loggedInUserId },
        { userId: userEmail },
        { email: userEmail }
      ]
    }).sort({ createdAt: -1 });
    
    console.log("✅ Found inquiries:", inquiries.length);
    
    // Update old inquiries to use proper userId
    const updateResult = await Inquiry.updateMany(
      { 
        email: userEmail,
        $or: [
          { userId: userEmail },
          { userId: { $exists: false } }
        ]
      },
      { $set: { userId: loggedInUserId } }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log(`✅ Updated ${updateResult.modifiedCount} old inquiries to link to user ID`);
      
      // Re-fetch after update
      const updatedInquiries = await Inquiry.find({
        $or: [
          { userId: loggedInUserId },
          { email: userEmail }
        ]
      }).sort({ createdAt: -1 });
      
      return NextResponse.json({
        success: true,
        data: updatedInquiries,
        count: updatedInquiries.length,
      });
    }

    return NextResponse.json({
      success: true,
      data: inquiries,
      count: inquiries.length,
    });
  } catch (error) {
    console.error("Get user inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}


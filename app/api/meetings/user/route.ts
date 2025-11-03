import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET user's own meetings (authenticated users only)
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
    
    console.log("🔍 Fetching meetings for user:", loggedInUserId);
    console.log("📧 User email:", userEmail);
    
    // Find meetings where userId matches either:
    // 1. The actual user ID (if they were logged in when scheduling)
    // 2. Their email address (if they scheduled as guest)
    const meetings = await Meeting.find({
      $or: [
        { userId: loggedInUserId },
        { userId: userEmail },
        { email: userEmail }
      ]
    }).sort({ date: 1 }); // Sort by date ascending (soonest first)
    
    console.log("✅ Found meetings:", meetings.length);
    
    // Update old meetings to use proper userId
    const updateResult = await Meeting.updateMany(
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
      console.log(`✅ Updated ${updateResult.modifiedCount} old meetings to link to user ID`);
      
      // Re-fetch after update
      const updatedMeetings = await Meeting.find({
        $or: [
          { userId: loggedInUserId },
          { email: userEmail }
        ]
      }).sort({ date: 1 });
      
      return NextResponse.json({
        success: true,
        data: updatedMeetings,
        count: updatedMeetings.length,
      });
    }

    return NextResponse.json({
      success: true,
      data: meetings,
      count: meetings.length,
    });
  } catch (error) {
    console.error("Get user meetings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}


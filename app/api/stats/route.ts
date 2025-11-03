import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Inquiry from "@/models/Inquiry";
import Meeting from "@/models/Meeting";
import { withAdminAuth } from "@/lib/middleware";

// GET dashboard statistics (admin only)
export const GET = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const [
      totalProducts,
      activeProducts,
      totalInquiries,
      newInquiries,
      totalMeetings,
      upcomingMeetings,
      convertedInquiries,
      recentInquiries,
      recentMeetings,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "new" }),
      Meeting.countDocuments(),
      Meeting.countDocuments({ 
        status: "scheduled",
        date: { $gte: today }
      }),
      Inquiry.countDocuments({ status: "converted" }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).select("name company inquiryType status createdAt"),
      Meeting.find({ 
        status: "scheduled",
        date: { $gte: today }
      }).sort({ date: 1 }).limit(5).select("name company meetingType meetingMode date timeSlot status"),
    ]);

    // Calculate conversion rate
    const conversionRate = totalInquiries > 0 
      ? Math.round((convertedInquiries / totalInquiries) * 100) 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          activeProducts,
          totalInquiries,
          newInquiries,
          totalMeetings,
          upcomingMeetings,
          conversionRate,
        },
        recentInquiries,
        recentMeetings,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
});


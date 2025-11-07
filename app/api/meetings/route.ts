import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import { withAdminAuth } from "@/lib/middleware";
import { createCalendarEventWithMeet } from "@/lib/google-calendar-api";
import { authOptions } from "@/lib/next-auth-config";
import { z } from "zod";

const meetingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  phone: z.string(),
  meetingType: z.enum(["consultation", "product", "custom", "samples", "partnership"]),
  meetingMode: z.enum(["video", "phone", "whatsapp", "inperson"]),
  date: z.string(),
  timeSlot: z.string(),
  timezone: z.string().optional(), // User's IANA timezone
  message: z.string().optional(),
  sampleCartItems: z.array(z.object({
    productName: z.string(),
    quantity: z.number(),
  })).optional(),
});

// GET all meetings (admin only)
export const GET = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    let query: any = {};
    if (status) query.status = status;
    if (from) query.date = { $gte: new Date(from) };
    if (to) query.date = { ...query.date, $lte: new Date(to) };

    const skip = (page - 1) * limit;
    
    const [meetings, total] = await Promise.all([
      Meeting.find(query)
        .sort({ date: 1 })
        .limit(limit)
        .skip(skip),
      Meeting.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: meetings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get meetings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
});

// POST create meeting (public)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = meetingSchema.parse(body);

    let googleMeetLink: string | undefined;
    let googleCalendarEventId: string | undefined;

    // Create Google Calendar event with Meet link for video meetings
    if (validatedData.meetingMode === "video") {
      try {
        const calendarEvent = await createCalendarEventWithMeet({
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company,
          date: validatedData.date,
          timeSlot: validatedData.timeSlot,
          meetingType: validatedData.meetingType,
          message: validatedData.message,
          timezone: validatedData.timezone, // Pass user's timezone
        });

        if (calendarEvent.success) {
          googleMeetLink = calendarEvent.googleMeetLink;
          googleCalendarEventId = calendarEvent.eventId;
          
          console.log("✅ Google Calendar event created on admin calendar");
          console.log("✅ Google Meet link:", googleMeetLink);
          console.log("✅ Event ID:", googleCalendarEventId);
          
          // Send emails to customer and admin
          try {
            const { sendMeetingConfirmationEmail, sendAdminMeetingNotification } = await import("@/lib/email-service");
            
            // Send to customer
            const customerEmail = await sendMeetingConfirmationEmail({
              to: validatedData.email,
              customerName: validatedData.name,
              meetingType: validatedData.meetingType,
              company: validatedData.company,
              date: validatedData.date,
              timeSlot: validatedData.timeSlot,
              googleMeetLink,
              message: validatedData.message,
            });

            if (customerEmail.success) {
              console.log("✅ Confirmation email sent to customer");
            } else {
              console.log("ℹ️ Email not sent (configure RESEND_API_KEY to enable)");
            }

            // Send to admin
            const adminEmail = await sendAdminMeetingNotification({
              to: validatedData.email,
              customerName: validatedData.name,
              meetingType: validatedData.meetingType,
              company: validatedData.company,
              date: validatedData.date,
              timeSlot: validatedData.timeSlot,
              googleMeetLink,
              message: validatedData.message,
            });

            if (adminEmail.success) {
              console.log("✅ Admin notification sent");
            }
          } catch (emailError) {
            console.log("ℹ️ Email sending skipped (not configured)");
          }
        }
      } catch (error) {
        console.error("Failed to create Google Calendar event:", error);
        console.log("ℹ️ Continuing with fallback Meet link generation...");
        // Continue without Meet link if generation fails
      }
    }

    // Check if user is logged in
    const session = await getServerSession(authOptions);
    
    // Use userId if logged in, otherwise use email as identifier
    const userId = session?.user ? (session.user as any).id : validatedData.email;

    const meeting = await Meeting.create({
      ...validatedData,
      date: new Date(validatedData.date),
      userId, // Link to user ID if logged in, or use email if guest
      googleMeetLink,
      googleCalendarEventId,
    });

    console.log("✅ Meeting created:", meeting._id);
    console.log("🌍 Timezone:", validatedData.timezone || "Asia/Kolkata (default)");
    if (session?.user) {
      console.log("✅ Linked to user ID:", userId);
    } else {
      console.log("ℹ️ Guest meeting - using email as userId:", userId);
    }

    // Send confirmation emails for ALL meeting types (not just video)
    try {
      const { sendMeetingConfirmationEmail, sendAdminMeetingNotification } = await import("@/lib/email-service");
      
      // Send to customer
      const customerEmail = await sendMeetingConfirmationEmail({
        to: validatedData.email,
        customerName: validatedData.name,
        meetingType: validatedData.meetingType,
        company: validatedData.company,
        date: validatedData.date,
        timeSlot: validatedData.timeSlot,
        googleMeetLink, // Will be undefined for non-video meetings
        message: validatedData.message,
      });

      if (customerEmail.success) {
        console.log("✅ Confirmation email sent to customer");
      } else {
        console.log("ℹ️ Email not sent (SMTP not configured)");
      }

      // Send to admin
      const adminEmail = await sendAdminMeetingNotification({
        to: validatedData.email,
        customerName: validatedData.name,
        meetingType: validatedData.meetingType,
        company: validatedData.company,
        date: validatedData.date,
        timeSlot: validatedData.timeSlot,
        googleMeetLink,
        message: validatedData.message,
      });

      if (adminEmail.success) {
        console.log("✅ Admin notification sent");
      }
    } catch (emailError) {
      console.log("ℹ️ Email sending skipped (not configured)");
    }

    return NextResponse.json({
      success: true,
      data: meeting,
      googleMeetLink,
      message: validatedData.meetingMode === "video"
        ? googleMeetLink
          ? "Meeting scheduled! Google Calendar invitation sent to your email with Meet link."
          : "Meeting scheduled! Confirmation will be sent shortly."
        : "Meeting scheduled successfully. You'll receive a confirmation email shortly.",
    }, { status: 201 });
  } catch (error) {
    console.error("Create meeting error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to schedule meeting" },
      { status: 500 }
    );
  }
}


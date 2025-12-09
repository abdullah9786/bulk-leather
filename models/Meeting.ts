import mongoose, { Schema, Model } from "mongoose";

export interface IMeeting {
  _id: string;
  userId?: string; // Link to user if logged in, or email if guest
  name: string;
  email: string;
  company: string;
  phone: string;
  meetingType: "bulk" | "sample" | "general" | "custom" | "consultation" | "product" | "samples" | "partnership";
  meetingMode: "video" | "phone" | "whatsapp" | "inperson";
  date: Date;
  timeSlot: string;
  timezone?: string; // User's IANA timezone (e.g., America/New_York)
  message?: string;
  sampleCartItems?: Array<{
    productName: string;
    quantity: number;
  }>;
  status: "scheduled" | "completed" | "cancelled";
  googleMeetLink?: string;
  googleCalendarEventId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeeting>(
  {
    userId: {
      type: String,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    meetingType: {
      type: String,
      enum: ["bulk", "sample", "general", "custom", "consultation", "product", "samples", "partnership"],
      required: true,
    },
    meetingMode: {
      type: String,
      enum: ["video", "phone", "whatsapp", "inperson"],
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata", // Default to IST if not provided
    },
    message: {
      type: String,
    },
    sampleCartItems: [{
      productName: String,
      quantity: Number,
    }],
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    googleMeetLink: {
      type: String,
    },
    googleCalendarEventId: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Meeting: Model<IMeeting> = 
  mongoose.models.Meeting || mongoose.model<IMeeting>("Meeting", MeetingSchema);

export default Meeting;


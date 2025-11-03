import mongoose, { Schema, Model } from "mongoose";

export interface IInquiry {
  _id: string;
  userId?: string; // Link to user if logged in
  name: string;
  email: string;
  company: string;
  phone: string;
  inquiryType: "bulk" | "sample" | "general" | "partnership" | "support";
  inquirySource: "contact-form" | "product-page" | "customization-form";
  productInterest?: string;
  productId?: string; // Specific product if from product page
  customizationDetails?: {
    type: string;
    quantity: string;
    budget?: string;
    timeline?: string;
  };
  message: string;
  sampleCartItems?: Array<{
    productName: string;
    quantity: number;
  }>;
  status: "new" | "contacted" | "quoted" | "converted" | "closed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
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
      index: true,
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
    inquiryType: {
      type: String,
      enum: ["bulk", "sample", "general", "partnership", "support"],
      required: true,
    },
    inquirySource: {
      type: String,
      enum: ["contact-form", "product-page", "customization-form"],
      required: true,
      default: "contact-form",
    },
    productInterest: {
      type: String,
    },
    productId: {
      type: String,
    },
    customizationDetails: {
      type: {
        type: String,
      },
      quantity: String,
      budget: String,
      timeline: String,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    sampleCartItems: [{
      productName: String,
      quantity: Number,
    }],
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "converted", "closed"],
      default: "new",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry: Model<IInquiry> = 
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;


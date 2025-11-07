import mongoose, { Schema, Model } from "mongoose";

export interface IRedirect {
  _id: string;
  fromSlug: string;
  toSlug: string;
  type: "category" | "product" | "other";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RedirectSchema = new Schema<IRedirect>(
  {
    fromSlug: {
      type: String,
      required: [true, "Source slug is required"],
      lowercase: true,
      trim: true,
    },
    toSlug: {
      type: String,
      required: [true, "Destination slug is required"],
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["category", "product", "other"],
      required: true,
      default: "category",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for faster lookups
RedirectSchema.index({ fromSlug: 1, type: 1 });

const Redirect: Model<IRedirect> = 
  mongoose.models.Redirect || mongoose.model<IRedirect>("Redirect", RedirectSchema);

export default Redirect;


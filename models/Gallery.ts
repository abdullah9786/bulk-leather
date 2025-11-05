import mongoose, { Schema, Model } from "mongoose";

export interface IGallery {
  _id: string;
  title: string;
  description?: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  thumbnailUrl?: string; // For videos, optional thumbnail
  category: "factory-tour" | "manufacturing" | "workers" | "products" | "other";
  tags?: string[];
  isActive: boolean;
  displayOrder?: number; // For manual ordering
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: [true, "Media type is required"],
    },
    mediaUrl: {
      type: String,
      required: [true, "Media URL is required"],
    },
    thumbnailUrl: {
      type: String,
      // Optional - used for video thumbnails
    },
    category: {
      type: String,
      enum: ["factory-tour", "manufacturing", "workers", "products", "other"],
      required: [true, "Category is required"],
      default: "other",
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
GallerySchema.index({ category: 1, isActive: 1, displayOrder: 1 });

const Gallery: Model<IGallery> = 
  mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;


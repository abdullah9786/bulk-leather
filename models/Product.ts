import mongoose, { Schema, Model } from "mongoose";

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  material: string;
  images: string[];
  moq: number;
  priceRange: string;
  samplePrice?: number; // Price for sample requests
  features: string[];
  colors: string[];
  sizes?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: false, // Made optional for backward compatibility
      unique: true,
      sparse: true, // Allows multiple null values but enforces uniqueness for non-null
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    material: {
      type: String,
      required: [true, "Material is required"],
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0;
        },
        message: "At least one image is required",
      },
    },
    moq: {
      type: Number,
      required: [true, "MOQ is required"],
      min: 1,
    },
    priceRange: {
      type: String,
      required: [true, "Price range is required"],
    },
    samplePrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    features: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
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

// Create index for slug for optimized queries
ProductSchema.index({ slug: 1 });
// Compound index for category + active status (used in category pages)
ProductSchema.index({ category: 1, isActive: 1 });

const Product: Model<IProduct> = 
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;


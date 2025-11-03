/**
 * Database Seeding Script
 * Run with: npx ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/seed-database.ts
 */

import mongoose from "mongoose";
import { hashPassword } from "../lib/auth";

// Import models (you'll need to adjust paths based on your setup)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/bulkleather";

// Models (inline for script simplicity)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  material: String,
  images: [String],
  moq: Number,
  priceRange: String,
  features: [String],
  colors: [String],
  sizes: [String],
  isActive: Boolean,
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
  isActive: Boolean,
}, { timestamps: true });

const TestimonialSchema = new mongoose.Schema({
  name: String,
  company: String,
  role: String,
  content: String,
  avatar: String,
  isActive: Boolean,
  rating: Number,
}, { timestamps: true });

async function seedDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const User = mongoose.models.User || mongoose.model("User", UserSchema);
    const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
    const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
    const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Testimonial.deleteMany({});

    // Create admin user
    console.log("👤 Creating admin user...");
    const hashedPassword = await hashPassword("admin123");
    await User.create({
      name: "Admin User",
      email: "admin@bulkleather.com",
      password: hashedPassword,
      role: "admin",
    });

    // Seed categories
    console.log("📁 Seeding categories...");
    const categoriesData = require("../data/categories.json");
    await Category.insertMany(
      categoriesData.map((cat: any) => ({
        ...cat,
        isActive: true,
      }))
    );

    // Seed products
    console.log("📦 Seeding products...");
    const productsData = require("../data/products.json");
    await Product.insertMany(
      productsData.map((product: any) => ({
        ...product,
        isActive: true,
      }))
    );

    // Seed testimonials
    console.log("💬 Seeding testimonials...");
    const testimonialsData = require("../data/testimonials.json");
    await Testimonial.insertMany(
      testimonialsData.map((testimonial: any) => ({
        ...testimonial,
        isActive: true,
        rating: 5,
      }))
    );

    console.log("✅ Database seeded successfully!");
    console.log("\n📝 Admin Credentials:");
    console.log("   Email: admin@bulkleather.com");
    console.log("   Password: admin123");
    console.log("\n🚀 You can now login to /admin/login");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
  }
}

seedDatabase();


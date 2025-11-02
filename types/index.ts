export type ThemeType = "luxurySand" | "darkElegance" | "warmEarth";

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  material: string;
  images: string[];
  moq: number; // Minimum Order Quantity
  priceRange: string;
  features: string[];
  colors: string[];
  sizes?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  avatar?: string;
}

export interface InquiryForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  productInterest?: string;
  message: string;
  inquiryType: "bulk" | "sample" | "general";
}

export interface SampleRequest {
  name: string;
  email: string;
  company: string;
  phone: string;
  products: string[];
  shippingAddress: string;
  message?: string;
}


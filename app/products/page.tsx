import { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Wholesale Leather Products Catalog | BulkLeather",
  description: "Browse our extensive catalog of wholesale leather products including bags, jackets, wallets, belts, and accessories. Competitive pricing, flexible MOQ, and custom branding available for B2B buyers.",
  keywords: "wholesale leather products, bulk leather catalog, wholesale leather bags, wholesale leather jackets, wholesale leather wallets, wholesale leather belts, B2B leather products, leather wholesale catalog",
  openGraph: {
    title: "Wholesale Leather Products Catalog | BulkLeather",
    description: "Browse our extensive catalog of wholesale leather products. Competitive pricing, flexible MOQ, and custom branding available.",
    type: "website",
    url: "https://bulkleather.com/products",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wholesale Leather Products | BulkLeather",
    description: "Browse our extensive catalog of wholesale leather products with competitive pricing and flexible MOQ.",
  },
  alternates: {
    canonical: "https://bulkleather.com/products",
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}


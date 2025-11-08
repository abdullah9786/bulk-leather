import { Metadata } from "next";
import ProductsClient from "./ProductsClient";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  title: "Wholesale Leather Products Catalog | BulkLeather",
  description: "Browse our extensive catalog of wholesale leather products including bags, jackets, wallets, belts, and accessories. Competitive pricing, flexible MOQ, and custom branding available for B2B buyers.",
  keywords: "wholesale leather products, bulk leather catalog, wholesale leather bags, wholesale leather jackets, wholesale leather wallets, wholesale leather belts, B2B leather products, leather wholesale catalog",
  openGraph: {
    title: "Wholesale Leather Products Catalog | BulkLeather",
    description: "Browse our extensive catalog of wholesale leather products. Competitive pricing, flexible MOQ, and custom branding available.",
    type: "website",
    url: `${getBaseUrl()}/products`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Wholesale Leather Products | BulkLeather",
    description: "Browse our extensive catalog of wholesale leather products with competitive pricing and flexible MOQ.",
  },
  alternates: {
    canonical: `${getBaseUrl()}/products`,
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}


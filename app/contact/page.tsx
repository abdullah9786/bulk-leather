import { Metadata } from "next";
import ContactClient from "./ContactClient";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  title: "Contact Us - Get Wholesale Leather Pricing & Quotes | BulkLeather",
  description: "Contact BulkLeather for wholesale pricing, custom orders, and bulk leather product inquiries. Get fast quotes on bags, jackets, wallets, and accessories. Available for retailers and distributors worldwide.",
  keywords: "contact leather wholesaler, wholesale leather inquiry, bulk order leather, leather wholesale quote, leather supplier contact, B2B leather contact, wholesale leather pricing",
  openGraph: {
    title: "Contact Us - Wholesale Leather Supplier | BulkLeather",
    description: "Contact us for wholesale pricing, custom orders, and bulk leather product inquiries. Fast quotes available.",
    type: "website",
    url: `${getBaseUrl()}/contact`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - Wholesale Leather | BulkLeather",
    description: "Contact us for wholesale pricing and custom orders. Fast quotes available.",
  },
  alternates: {
    canonical: `${getBaseUrl()}/contact`,
  },
};

export default function ContactPage() {
  return <ContactClient />;
}

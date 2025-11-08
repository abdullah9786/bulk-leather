import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "BulkLeather - Premium Wholesale Leather Goods Manufacturer & Supplier",
  description: "Leading wholesale leather goods manufacturer offering premium bags, jackets, wallets, belts & accessories. Flexible MOQ, custom branding, global shipping. Perfect for retailers & distributors.",
  keywords: "wholesale leather, bulk leather goods, leather manufacturer, leather supplier, wholesale leather bags, wholesale leather jackets, custom leather products, private label leather, leather distributor, B2B leather",
  openGraph: {
    title: "BulkLeather - Premium Wholesale Leather Goods Manufacturer",
    description: "Leading wholesale leather goods manufacturer offering premium bags, jackets, wallets, belts & accessories. Flexible MOQ, custom branding, global shipping.",
    type: "website",
    url: "https://bulkleather.com",
    siteName: "BulkLeather",
  },
  twitter: {
    card: "summary_large_image",
    title: "BulkLeather - Premium Wholesale Leather Goods",
    description: "Leading wholesale leather goods manufacturer offering premium products with flexible MOQ and custom branding.",
  },
  alternates: {
    canonical: "https://bulkleather.com",
  },
};

export default function HomePage() {
  return <HomeClient />;
}


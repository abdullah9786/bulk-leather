import { Metadata } from "next";
import GalleryClient from "./GalleryClient";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  title: "Our Gallery - Factory Tours & Manufacturing Process | BulkLeather",
  description: "Explore our leather manufacturing facility, production processes, and skilled craftsmen at work. See behind-the-scenes of our wholesale leather goods manufacturing including bags, jackets, and accessories.",
  keywords: "leather factory tour, leather manufacturing process, leather production, wholesale leather factory, leather craftsmanship, leather goods manufacturing, factory gallery, production facility",
  openGraph: {
    title: "Our Gallery - Factory Tours & Manufacturing Process | BulkLeather",
    description: "Explore our leather manufacturing facility and production processes. See our skilled craftsmen creating premium leather goods.",
    type: "website",
    url: `${getBaseUrl()}/gallery`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Gallery - Leather Manufacturing | BulkLeather",
    description: "Explore our leather manufacturing facility and production processes.",
  },
  alternates: {
    canonical: `${getBaseUrl()}/gallery`,
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}

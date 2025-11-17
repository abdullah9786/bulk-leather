import Head from "next/head";
import GalleryClient from "@/app/gallery/GalleryClient";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export default function GalleryPage() {
  const baseUrl = getBaseUrl();

  return (
    <>
      <Head>
        <title>Our Gallery - Factory Tours & Manufacturing Process | BulkLeather</title>
        <meta
          name="description"
          content="Explore our leather manufacturing facility, production processes, and skilled craftsmen at work. See behind-the-scenes of our wholesale leather goods manufacturing including bags, jackets, and accessories."
        />
        <meta
          name="keywords"
          content="leather factory tour, leather manufacturing process, leather production, wholesale leather factory, leather craftsmanship, leather goods manufacturing, factory gallery, production facility"
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="Our Gallery - Factory Tours & Manufacturing Process | BulkLeather" />
        <meta property="og:description" content="Explore our leather manufacturing facility and production processes. See our skilled craftsmen creating premium leather goods." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/gallery`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Gallery - Leather Manufacturing | BulkLeather" />
        <meta name="twitter:description" content="Explore our leather manufacturing facility and production processes." />
        
        {/* Canonical */}
        <link rel="canonical" href={`${baseUrl}/gallery`} />
      </Head>
      <GalleryClient />
    </>
  );
}


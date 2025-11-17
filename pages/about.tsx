import Head from "next/head";
import AboutPageContent from "@/components/pages/AboutPage";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export default function AboutPage() {
  const baseUrl = getBaseUrl();

  return (
    <>
      <Head>
        <title>About Us - Wholesale Leather Goods Manufacturer Since 2000 | BulkLeather</title>
        <meta
          name="description"
          content="Learn about BulkLeather's 20+ year legacy of crafting premium wholesale leather products. Our story, values, and commitment to quality for retailers and distributors worldwide."
        />
        <meta
          name="keywords"
          content="about leather manufacturer, leather company history, wholesale leather supplier story, leather goods manufacturer, B2B leather company, leather factory about"
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="About Us - Wholesale Leather Manufacturer | BulkLeather" />
        <meta property="og:description" content="Learn about our 20+ year legacy of crafting premium wholesale leather products. Our story, values, and commitment to quality." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/about`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us - Leather Manufacturer | BulkLeather" />
        <meta name="twitter:description" content="Learn about our 20+ year legacy of crafting premium wholesale leather products." />
        
        {/* Canonical */}
        <link rel="canonical" href={`${baseUrl}/about`} />
      </Head>
      <AboutPageContent />
    </>
  );
}


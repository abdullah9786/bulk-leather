import Head from "next/head";
import ProductsClient from "@/app/products/ProductsClient";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export default function ProductsPage() {
  const baseUrl = getBaseUrl();

  return (
    <>
      <Head>
        <title>Wholesale Leather Products Catalog | BulkLeather</title>
        <meta
          name="description"
          content="Browse our extensive catalog of wholesale leather products including bags, jackets, wallets, belts, and accessories. Competitive pricing, flexible MOQ, and custom branding available for B2B buyers."
        />
        <meta
          name="keywords"
          content="wholesale leather products, bulk leather catalog, wholesale leather bags, wholesale leather jackets, wholesale leather wallets, wholesale leather belts, B2B leather products, leather wholesale catalog"
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="Wholesale Leather Products Catalog | BulkLeather" />
        <meta property="og:description" content="Browse our extensive catalog of wholesale leather products. Competitive pricing, flexible MOQ, and custom branding available." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/products`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wholesale Leather Products | BulkLeather" />
        <meta name="twitter:description" content="Browse our extensive catalog of wholesale leather products with competitive pricing and flexible MOQ." />
        
        {/* Canonical */}
        <link rel="canonical" href={`${baseUrl}/products`} />
      </Head>
      <ProductsClient />
    </>
  );
}


import Head from "next/head";
import ContactClient from "@/app/contact/ContactClient";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export default function ContactPage() {
  const baseUrl = getBaseUrl();

  return (
    <>
      <Head>
        <title>Contact Us - Get Wholesale Leather Pricing & Quotes | BulkLeather</title>
        <meta
          name="description"
          content="Contact BulkLeather for wholesale pricing, custom orders, and bulk leather product inquiries. Get fast quotes on bags, jackets, wallets, and accessories. Available for retailers and distributors worldwide."
        />
        <meta
          name="keywords"
          content="contact leather wholesaler, wholesale leather inquiry, bulk order leather, leather wholesale quote, leather supplier contact, B2B leather contact, wholesale leather pricing"
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="Contact Us - Wholesale Leather Supplier | BulkLeather" />
        <meta property="og:description" content="Contact us for wholesale pricing, custom orders, and bulk leather product inquiries. Fast quotes available." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/contact`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us - Wholesale Leather | BulkLeather" />
        <meta name="twitter:description" content="Contact us for wholesale pricing and custom orders. Fast quotes available." />
        
        {/* Canonical */}
        <link rel="canonical" href={`${baseUrl}/contact`} />
      </Head>
      <ContactClient />
    </>
  );
}


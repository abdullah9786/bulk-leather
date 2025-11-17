import { GetServerSideProps } from "next";
import Head from "next/head";
import CategoryDetailClient from "@/app/categories/[slug]/CategoryDetailClient";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

interface CategoryPageProps {
  category: any;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

export default function CategoryPage({ category, metaTitle, metaDescription, canonicalUrl }: CategoryPageProps) {
  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        {category.image && <meta property="og:image" content={category.image} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {category.image && <meta name="twitter:image" content={category.image} />}
        
        {/* Canonical */}
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <CategoryDetailClient slug={category.slug} />
    </>
  );
}

// getServerSideProps - Server-side rendering with database access
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  const baseUrl = getBaseUrl();

  try {
    await connectDB();
    
    // Find category by slug
    const category = await Category.findOne({ slug }).lean();
    
    if (!category) {
      return {
        notFound: true,
      };
    }
    
    // Serialize category data
    const serializedCategory = JSON.parse(JSON.stringify(category));
    
    // Generate meta tags
    const metaTitle = serializedCategory.metaTitle || 
      `${serializedCategory.name} | BulkLeather - Premium Wholesale Leather Products`;
    
    const metaDescription = serializedCategory.metaDescription || 
      (serializedCategory.description?.length > 160 
        ? serializedCategory.description.substring(0, 157) + "..." 
        : serializedCategory.description);
    
    const canonicalUrl = `${baseUrl}/categories/${serializedCategory.slug}`;
    
    return {
      props: {
        category: serializedCategory,
        metaTitle,
        metaDescription,
        canonicalUrl,
      },
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return {
      notFound: true,
    };
  }
};


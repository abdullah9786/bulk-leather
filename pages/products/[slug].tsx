import { GetServerSideProps } from "next";
import Head from "next/head";
import ProductDetailClient from "@/app/products/[slug]/ProductDetailClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

interface ProductPageProps {
  product: any;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

export default function ProductDetailPage({ product, metaTitle, metaDescription, canonicalUrl }: ProductPageProps) {
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
        {product.images?.[0] && <meta property="og:image" content={product.images[0]} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {product.images?.[0] && <meta name="twitter:image" content={product.images[0]} />}
        
        {/* Canonical */}
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <ProductDetailClient slug={product.slug} />
    </>
  );
}

// getServerSideProps - Server-side rendering with database access
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  const baseUrl = getBaseUrl();

  try {
    await connectDB();

    // Check if it's a MongoDB ID (24 character hex) or a slug
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(slug);
    
    let product;
    
    if (isMongoId) {
      // Legacy ID-based URL - find by ID and redirect to slug
      product = await Product.findById(slug).lean();
      
      if (product && product.slug) {
        return {
          redirect: {
            destination: `/products/${product.slug}`,
            permanent: true,
          },
        };
      }
    } else {
      // Find by slug
      product = await Product.findOne({ slug }).lean();
    }
    
    if (!product) {
      return {
        notFound: true,
      };
    }
    
    // Serialize product data
    const serializedProduct = JSON.parse(JSON.stringify(product));
    
    // Generate meta tags
    const metaTitle = serializedProduct.metaTitle || 
      `${serializedProduct.name} | BulkLeather - Premium Wholesale Leather Products`;
    
    const metaDescription = serializedProduct.metaDescription || 
      (serializedProduct.description?.length > 160 
        ? serializedProduct.description.substring(0, 157) + "..." 
        : serializedProduct.description);
    
    const canonicalUrl = `${baseUrl}/products/${serializedProduct.slug}`;
    
    return {
      props: {
        product: serializedProduct,
        metaTitle,
        metaDescription,
        canonicalUrl,
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      notFound: true,
    };
  }
};


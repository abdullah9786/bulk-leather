import React from "react";
import { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: { slug: string };
}

// Generate metadata for SEO (Server-side)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Fetch product data
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(params.slug);
    
    const apiUrl = isMongoId 
      ? `${baseUrl}/api/products/${params.slug}`
      : `${baseUrl}/api/products/slug/${params.slug}`;
    
    const response = await fetch(apiUrl, { cache: 'no-store' });
    const data = await response.json();
    
    if (!data.success || !data.data) {
      return {
        title: 'Product Not Found | BulkLeather',
        description: 'The requested product could not be found.',
      };
    }
    
    const product = data.data;
    
    // Use custom meta or fallback to product data
    const metaTitle = product.metaTitle || `${product.name} | BulkLeather - Premium Wholesale Leather Products`;
    const metaDescription = product.metaDescription || 
      (product.description?.length > 160 
        ? product.description.substring(0, 157) + "..." 
        : product.description);
    
    const canonicalUrl = `${baseUrl}/products/${product.slug}`;
    
    return {
      title: metaTitle,
      description: metaDescription,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: canonicalUrl,
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: product.images?.[0] ? [product.images[0]] : [],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | BulkLeather',
      description: 'Premium wholesale leather products',
    };
  }
}

export default function ProductDetailPage({ params }: Props) {
  return <ProductDetailClient slug={params.slug} />;
}

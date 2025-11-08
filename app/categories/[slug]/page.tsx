import React from "react";
import { Metadata } from "next";
import CategoryDetailClient from "./CategoryDetailClient";

interface Props {
  params: { slug: string };
}

// Generate metadata for SEO (Server-side)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Fetch category data
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/categories/slug/${params.slug}`, { cache: 'no-store' });
    const data = await response.json();
    
    if (!data.success || !data.data) {
      return {
        title: 'Category Not Found | BulkLeather',
        description: 'The requested category could not be found.',
      };
    }
    
    const category = data.data;
    
    // Use custom meta or fallback to category data
    const metaTitle = category.metaTitle || `${category.name} | BulkLeather - Premium Wholesale Leather Products`;
    const metaDescription = category.metaDescription || 
      (category.description?.length > 160 
        ? category.description.substring(0, 157) + "..." 
        : category.description);
    
    const canonicalUrl = `${baseUrl}/categories/${category.slug}`;
    
    return {
      title: metaTitle,
      description: metaDescription,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: canonicalUrl,
        images: category.image ? [{ url: category.image }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: category.image ? [category.image] : [],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    console.error('Error generating category metadata:', error);
    return {
      title: 'Category | BulkLeather',
      description: 'Premium wholesale leather products',
    };
  }
}

export default function CategoryPage({ params }: Props) {
  return <CategoryDetailClient slug={params.slug} />;
}

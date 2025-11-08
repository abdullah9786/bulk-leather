import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

export const metadata: Metadata = {
  metadataBase: new URL('https://bulkleather.com'),
  title: {
    default: "BulkLeather - Premium Wholesale Leather Goods Manufacturer",
    template: "%s | BulkLeather"
  },
  description: "Leading wholesale leather manufacturer offering premium bags, jackets, wallets, belts & accessories. Flexible MOQ, custom branding, global shipping for B2B buyers.",
  keywords: "wholesale leather, bulk leather goods, leather manufacturer, leather supplier, wholesale leather bags, wholesale leather jackets, B2B leather, private label leather",
  authors: [{ name: "BulkLeather" }],
  creator: "BulkLeather",
  publisher: "BulkLeather",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bulkleather.com',
    siteName: 'BulkLeather',
    title: 'BulkLeather - Premium Wholesale Leather Goods Manufacturer',
    description: 'Leading wholesale leather manufacturer offering premium products with flexible MOQ and custom branding.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BulkLeather - Wholesale Leather Manufacturer',
    description: 'Premium wholesale leather goods with flexible MOQ and custom branding.',
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data for organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BulkLeather',
    url: 'https://bulkleather.com',
    logo: 'https://bulkleather.com/logo.png',
    description: 'Leading wholesale leather goods manufacturer',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales',
      email: 'sales@bulkleather.com',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <SessionProvider>
          <ThemeProvider>
            <CartProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </CartProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

// Get the base URL for metadata
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
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
    url: getBaseUrl(),
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
  const baseUrl = getBaseUrl();
  
  // Structured data for organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BulkLeather',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Leading wholesale leather goods manufacturer',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales',
      email: 'inquiry@houseoflamode.com.com',
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KXJMT75Z');`,
          }}
        />
        {/* End Google Tag Manager */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KXJMT75Z"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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


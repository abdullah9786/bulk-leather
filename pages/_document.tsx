import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Organization Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BulkLeather",
              "description": "Premium wholesale leather goods manufacturer and supplier",
              "url": process.env.NEXT_PUBLIC_BASE_URL || "https://bulkleather.com",
              "@id": `${process.env.NEXT_PUBLIC_BASE_URL || "https://bulkleather.com"}/#organization`,
              "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://bulkleather.com"}/logo.png`,
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}


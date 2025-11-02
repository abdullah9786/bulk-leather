import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FloatingScheduler } from "@/components/scheduler/FloatingScheduler";

export const metadata: Metadata = {
  title: "BulkLeather - Premium Wholesale Leather Goods",
  description: "Premium wholesale leather products for retailers, distributors, and resellers. High-quality bags, jackets, wallets, belts, and accessories with flexible MOQ.",
  keywords: "wholesale leather, bulk leather goods, leather bags, leather jackets, wholesale accessories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <FloatingScheduler />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


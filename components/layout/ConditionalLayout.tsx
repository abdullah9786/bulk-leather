"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FloatingScheduler } from "@/components/scheduler/FloatingScheduler";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if we're on an admin page
  const isAdminPage = pathname.startsWith("/admin");

  // For admin pages, only show the content (no header/footer)
  if (isAdminPage) {
    return <>{children}</>;
  }

  // For regular pages, show header and footer
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <FloatingScheduler />
    </>
  );
}


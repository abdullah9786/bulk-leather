import "@/app/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useRouter } from "next/router";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  const isAuthRoute = router.pathname.startsWith("/auth");

  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <CartProvider>
          {!isAdminRoute && !isAuthRoute && <Header />}
          <Component {...pageProps} />
          {!isAdminRoute && !isAuthRoute && <Footer />}
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}


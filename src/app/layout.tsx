import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "SoleSearch — Find the Best Sneaker Prices Instantly",
  description:
    "Compare sneaker prices across StockX, GOAT, Nike, Adidas, and 50+ retailers. SoleSearch aggregates prices in real-time so you never overpay for sneakers.",
  keywords: ["sneaker prices", "sneaker comparison", "StockX", "GOAT", "sneaker deals", "price tracker"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="dark" suppressHydrationWarning>
        <body>
          <ThemeProvider>
            <Toaster position="bottom-right" toastOptions={{ className: '!bg-[#1A1A1A] !text-white !border !border-gray-800' }} />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

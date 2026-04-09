import type { Metadata, Viewport } from "next";
import "./globals.css";
import CartProvider from "@/components/CartProvider";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Picnic",
  description: "Picnic grocery AI assistant",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="font-sans text-gray-900 antialiased selection:bg-red-100 selection:text-red-900 max-w-md mx-auto relative bg-white shadow-2xl min-h-screen">
          <CartProvider>
            {children}
            <Navigation />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}

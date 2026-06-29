import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vidasana | Tienda natural",
  description:
    "Frutos secos, semillas, granolas y productos naturales. Armá tu pedido y envialo por WhatsApp.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FAF7F2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable} antialiased`}>
      <body className="min-h-dvh bg-cream font-sans text-earth grain">
        <div className="relative z-10 flex min-h-dvh flex-col">
          <CartProvider>{children}</CartProvider>
        </div>
      </body>
    </html>
  );
}

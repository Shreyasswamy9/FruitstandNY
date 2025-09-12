
// removed duplicate React import

import type { Metadata } from "next"
import { AuthProvider } from "./providers/AuthProvider"
import "./globals.css"
import ClientRootLayout from "../components/ClientRootLayout"
import { CartProvider } from "../components/CartContext"

declare global {
  interface Window {
    __SHOW_LOGO__?: boolean;
  }
}


export const metadata: Metadata = {
  title: "fruitstand - New Collection 2025",
  description:
    "Discover the latest collection from fruitstand. Premium clothing and accessories for the modern lifestyle.",
  keywords: "fruitstand, clothing, fashion, new collection, 2025",
  authors: [{ name: "fruitstand" }],
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <ClientRootLayout>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ClientRootLayout>
        </CartProvider>
      </body>
    </html>
  )
}

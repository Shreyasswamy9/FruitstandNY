
import type { Metadata } from "next"
// Clerk removed. Use Supabase client or custom auth provider if needed.
import { Geist, Geist_Mono } from 'next/font/google'
import "./globals.css"
import ClientRootLayout from "../components/ClientRootLayout"
import { CartProvider } from "../components/CartContext"

declare global {
  interface Window {
    __SHOW_LOGO__?: boolean;
  }
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

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
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <CartProvider>
          <ClientRootLayout>
            {children}
          </ClientRootLayout>
        </CartProvider>
      </body>
    </html>
  )
}

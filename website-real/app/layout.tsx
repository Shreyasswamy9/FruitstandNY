
import type { Metadata } from "next"
// Clerk removed. Use Supabase client or custom auth provider if needed.
import { Geist, Geist_Mono } from 'next/font/google'
import "./globals.css"
import ClientRootLayout from "../components/ClientRootLayout"
import { CartProvider } from "../components/CartContext"
import Script from 'next/script'

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
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-N8M6F5WK');`}
        </Script>
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N8M6F5WK"
        height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        <CartProvider>
          <ClientRootLayout>
            {children}
          </ClientRootLayout>
        </CartProvider>
      </body>
    </html>
  )
}

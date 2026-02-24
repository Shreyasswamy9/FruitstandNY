import type { Metadata } from "next"
// Clerk removed. Use Supabase client or custom auth provider if needed.
import { Geist, Geist_Mono } from 'next/font/google'
import "./globals.css"
import ClientRootLayout from "../components/ClientRootLayout"
import { CartProvider } from "../components/CartContext"
import Script from 'next/script'
import { Suspense } from "react";
import MetaPixelBase from "@/components/MetaPixelBase";
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
  title: "FRUITSTAND®",
  description:
    "Discover the latest collection from FRUITSTAND®. Premium clothing and accessories for the modern lifestyle.",
  keywords: "FRUITSTAND, clothing, fashion",
  authors: [{ name: "FRUITSTAND®" }],
  icons: {
    icon: "/images/newlogo.png",
    shortcut: "/images/newlogo.png",
    apple: "/images/newlogo.png",
  },
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
        <MetaPixelBase />
          <Script
            id="mcjs"
            strategy="beforeInteractive"
          >
            {`!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/fcf0bbb9c363876e4b7950198/701c39750148b2925ed7905a1.js");`}
          </Script>
        <Script id="google-tag-manager" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-N8M6F5WK');`}
        </Script>
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fbf6f0]`}
        suppressHydrationWarning
      >
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N8M6F5WK"
        height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        <CartProvider>
          <Suspense fallback={null}>
            <ClientRootLayout>
              {children}
            </ClientRootLayout>
          </Suspense>
        </CartProvider>
      </body>
    </html>
  )
}

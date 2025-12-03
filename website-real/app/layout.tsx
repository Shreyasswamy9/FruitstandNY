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
  title: "FRUITSTAND® - New Collection 2025",
  description:
    "Discover the latest collection from FRUITSTAND®. Premium clothing and accessories for the modern lifestyle.",
  keywords: "FRUITSTAND, clothing, fashion, new collection, 2025",
  authors: [{ name: "FRUITSTAND®" }],
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

        {/* Ensure thumbnail borders/shadows render on top of images */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Overlay border + shadow on top of thumbnail images.
             Targets common thumbnail/container class names used across product pages.
             Adjust selectors if your product thumbnails use different class names. */
          .product-thumb,
          .thumbnail,
          .product-thumbnail,
          .thumb,
          .product-image-thumb {
            position: relative; /* establish positioning context for overlay */
            overflow: hidden;   /* clip image corners so they don't overlap borders */
            border-radius: inherit; /* respect container rounding */
            isolation: isolate; /* create a local stacking context to keep overlay on top */
            -webkit-backface-visibility: hidden; /* help with rendering artifacts */
            backface-visibility: hidden;
          }
          .product-thumb img,
          .thumbnail img,
          .product-thumbnail img,
          .thumb img,
          .product-image-thumb img {
            position: relative;
            z-index: 0 !important; /* keep image beneath the overlay */
            display: block;
            max-width: 100%;
            height: auto;
            width: 100%;
            object-fit: cover; /* ensure images fill their container without overflow */
            border-radius: inherit; /* match container rounding so corners are clipped */
            /* remove any transform that could create a higher stacking context */
            transform: none !important;
            -webkit-transform: none !important;
            will-change: auto !important;
          }
          .product-thumb::after,
          .thumbnail::after,
          .product-thumbnail::after,
          .thumb::after,
          .product-image-thumb::after {
            content: '';
            pointer-events: none;
            position: absolute;
            inset: 0;
            border-radius: inherit;
            border: 2px solid rgba(0,0,0,0.9); /* visible border on top (adjust weight/color as needed) */
            box-shadow: 0 6px 18px rgba(0,0,0,0.06); /* overlay shadow */
            z-index: 9999; /* ensure overlay sits above the image and any transforms */
            mix-blend-mode: normal;
          }
        `}} />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fbf6f0]`}
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

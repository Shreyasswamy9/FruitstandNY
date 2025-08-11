import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "fruitstand - New Collection 2025",
  description: "Discover the latest collection from fruitstand. Premium clothing and accessories for the modern lifestyle.",
  keywords: "fruitstand, clothing, fashion, new collection, 2025",
  authors: [{ name: "fruitstand" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

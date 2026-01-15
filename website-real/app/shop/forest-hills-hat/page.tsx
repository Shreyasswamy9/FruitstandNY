"use client";
import React, { useMemo, useState } from "react";
import { useCart } from "../../../components/CartContext";
import FrequentlyBoughtTogether, { FBTProduct, getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import Price from '@/components/Price';
import CustomerReviews from "@/components/CustomerReviews";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";

const greenHatImages = [
  "/images/products/Forest Hills Hat/Green Hat.png",
  "/images/products/Forest Hills Hat/G1.png",
  "/images/products/Forest Hills Hat/G2.png",
  "/images/products/Forest Hills Hat/G3.png",
  "/images/products/Forest Hills Hat/G4.png",
];

const PRODUCT = {
  name: "Forest Hills Hat",
  price: 46,
  description: "Crafted from premium cotton. Designed in NYC, worn everywhere.",
  details: [
    "Lime green color 6-panel camp hat.",
    "Adjustable size, one size fits most.",
    "Detailed embroidery on front and back.",
    "Flexible brim.",
    "Made in Fujian, China",
  ],
};

export default function ForestHillsHatPage() {
  const [selectedImage, setSelectedImage] = useState(greenHatImages[0]);
  const galleryOption = useMemo(() => ({ name: PRODUCT.name, slug: "default", images: greenHatImages }), []);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const handleAddToCart = () => {
    addToCart({
      productId: "forest-hills-hat",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  // Height of the taskbar (matches py-3 + px-2, but add extra for safety)
  const taskbarHeight = items.length > 0 && !showPopup ? 64 : 0;

  // FBT data (centralized)
  const boughtTogetherItems: FBTProduct[] = getFBTForPage('forest-hills-hat');
  // (reviews are loaded dynamically via CustomerReviews)
  return (
    <div>
      <ProductPageBrandHeader />
      {/* Section 1: Product Details */}
      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4" style={{ paddingBottom: taskbarHeight, paddingTop: 120 }}>
        {/* Images */}
        <ProductImageGallery
          productName={PRODUCT.name}
          options={[galleryOption]}
          selectedOption={galleryOption}
          selectedImage={selectedImage}
          onImageChange={setSelectedImage}
          className="md:w-1/2"
          frameBackground="#ffffff"
        />
        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          <p className="text-lg text-gray-700 mb-4">{PRODUCT.description}</p>
          {PRODUCT.details && PRODUCT.details.length > 0 && (
            <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
              {PRODUCT.details.map((d, idx) => (
                <li key={idx} className="mb-1">{d}</li>
              ))}
            </ul>
          )}
          <div className="text-2xl font-semibold mb-6"><Price price={PRODUCT.price} /></div>
          <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      {/* Section 2: Frequently Bought Together */}
      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={(product) => {
          addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          });
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 1500);
        }}
        onAddAllToCart={(products) => {
          products.forEach(product => {
            addToCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
            });
          });
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 1500);
        }}
        />
        {/* Section 3: Customer Reviews */}
        <CustomerReviews productId="forest-hills-hat" />
      {/* Minimalistic cart taskbar at bottom if cart has items */}
      {items.length > 0 && !showPopup && (
        <div className="fixed left-0 right-0 bottom-0 z-50 bg-black text-white px-2 py-3 md:px-4 md:py-4 flex items-center justify-between" style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)', borderBottom: 'none' }}>
          <span className="font-medium text-sm md:text-base">Cart</span>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="inline-block bg-white text-black rounded px-2 py-1 md:px-3 font-bold text-sm md:text-base">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
            <a href="/cart" className="ml-1 md:ml-2 px-3 py-2 md:px-4 md:py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 text-xs md:text-base" style={{ textDecoration: 'none' }}>Head to Cart</a>
          </div>
        </div>
      )}
    </div>
  );
}

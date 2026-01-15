"use client";
import React, { useMemo, useState } from "react";
import SizeGuide from "@/components/SizeGuide";
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";
import ProductImageGallery from "@/components/ProductImageGallery";

const mandarinImages = [
  "/images/products/Mandarin Tee/Mandarin Tee.png",
  "/images/products/Mandarin Tee/Mandarin 2.png",
  "/images/products/Mandarin Tee/Mandarin 3.png",
  "/images/products/Mandarin Tee/Mandarin 4.png",
];

const PRODUCT = {
  name: "Mandarin 橘子 [JUZI] Tee",
  price: 68.00,
  description: "Cut from heavyweight 300 GSM cotton, the Mandarin Tee brings structure to a relaxed, cropped silhouette. Featuring minimal seams for an uninterrupted, full-tee print front and back.",
  details: [
    "100% premium heavyweight cotton (300 GSM)",
    "Two-panel design for a clean, seamless look",
    "Cropped, boxy fit",
    "32\" screen-printed graphic on front and back",
    "Made in Dongguan, Guangdong, China",
    "Ships with a custom FRUITSTAND sticker printed in NYC",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

// Out of stock sizes for Mandarin Tee
const OUT_OF_STOCK_SIZES = ["XS", "S" , "XXXL"];

export default function MandarinTeePage() {
  const [selectedImage, setSelectedImage] = useState(mandarinImages[0]);
  const galleryOption = useMemo(() => ({ name: PRODUCT.name, slug: "default", images: mandarinImages }), []);
  // Default to first available size (skip out of stock sizes)
  const [selectedSize, setSelectedSize] = useState(
    PRODUCT.sizes.find(size => !OUT_OF_STOCK_SIZES.includes(size)) || PRODUCT.sizes[0]
  );
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const handleAddToCart = () => {
    addToCart({
      productId: "mandarin-tee",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const boughtTogetherItems = getFBTForPage('mandarin-tee');

  const handleAddBoughtTogetherItem = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: PRODUCT.sizes[2] });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const handleAddAllToCart = () => {
    boughtTogetherItems.forEach((item) => addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: PRODUCT.sizes[2] }));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const taskbarHeight = items.length > 0 && !showPopup ? 64 : 0;



  return (
    <div>
      <span
        onClick={() => router.back()}
        style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', fontSize: 16, color: '#232323', cursor: 'pointer', fontWeight: 500, zIndex: 10005, background: 'rgba(255,255,255,0.9)', border: '1px solid #e0e0e0', borderRadius: '20px', padding: '8px 16px', textDecoration: 'none', backdropFilter: 'blur(10px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.2s ease', pointerEvents: 'auto' }}
      >
        ← Go Back
      </span>
      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4" style={{ paddingTop: 120, paddingBottom: taskbarHeight }}>
        <ProductImageGallery
          productName={PRODUCT.name}
          options={[galleryOption]}
          selectedOption={galleryOption}
          selectedImage={selectedImage}
          onImageChange={setSelectedImage}
          className="md:w-1/2"
          frameBackground="#ffffff"
        />
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          <div className="text-2xl font-semibold mb-6">${PRODUCT.price.toFixed(2)}</div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Size:</p>
            <div className="size-single-line">
              {PRODUCT.sizes.map((size) => {
                const isOutOfStock = OUT_OF_STOCK_SIZES.includes(size);
                return (
                  <button
                    key={size}
                    className={`size-button px-3 rounded-lg font-semibold border-2 transition-all ${isOutOfStock
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                        : selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                    type="button"
                    disabled={isOutOfStock}
                    title={isOutOfStock ? 'Out of Stock' : ''}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {/* Low stock disclaimer for available sizes */}
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-orange-600 font-medium">Few units remaining</span>
            </div>
            <div className="mt-2"><SizeGuide productSlug="mandarin-tee" imagePath="/images/size-guides/Size Guide/Mandarin Tee Table.png" /></div>
          </div>

          <div className="mb-4">
            <p className="text-lg text-gray-700 leading-relaxed">{PRODUCT.description}</p>
            {PRODUCT.details && (
              <div className="mt-3">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Details</span>
                <ul className="mt-2 list-disc list-inside text-gray-700 text-sm sm:text-base space-y-1">
                  {PRODUCT.details.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={handleAddBoughtTogetherItem}
        onAddAllToCart={handleAddAllToCart}
      />

      {/* Reviews */}
      <div style={{ display: 'flex', alignItems: 'center', background: '#fbf6f0' }} className="py-12 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <CustomerReviews productId="mandarin-tee" />
        </div>
      </div>

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

"use client";
import Image from "next/image";
import React, { useState } from "react";
import SizeGuide from "@/components/SizeGuide";
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";
import ColorPicker, { type ColorOption } from '@/components/ColorPicker';

const feImages = [
  "/images/products/First Edition Tee/FE1.png",
  "/images/products/First Edition Tee/FE2.png",
  "/images/products/First Edition Tee/FE3.png",
  "/images/products/First Edition Tee/FE4.png",
  "/images/products/First Edition Tee/FE5.png",
  "/images/products/First Edition Tee/FE6.png",
];

type FirstEditionColorOption = ColorOption & {
  images: string[];
};

const PRODUCT = {
  name: "FIRST EDITION T",
  price: 45,
  description: "100% Heavyweight cotton. Custom cut and sewn fit. Designed in NYC and crafted in Portugal. We spent over a year and a half researching, traveling and touring to source the best materials and people to work with. We had the mission to make the perfect T-shirt worthy to carry the FRUITSTAND brand; we succeeded.",
  details: [
    "100% Heavyweight Cotton, custom cut and sewn fit",
    "Designed in NYC — crafted in Portugal",
    "Trademark BLOCK LOGO at the chest with ‘ORGANIC NEW YORK CULTURE’ near the waist",
    "Comes with custom NYC-made hang tags and a sustainable burlap bag",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

export default function FirstEditionTeePage() {
  const colorOptions = React.useMemo<FirstEditionColorOption[]>(() => [
    { name: 'White', slug: 'white', images: feImages, color: '#ffffff', border: '#e5e7eb' },
    { name: 'Black', slug: 'black', images: feImages, color: '#000000' },
  ], []);
  const [selectedColor, setSelectedColor] = useState<FirstEditionColorOption>(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState<string>(colorOptions[0].images[0]);
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[2]);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const handleAddToCart = () => {
    addToCart({
      productId: "first-edition-tee",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const boughtTogetherItems = getFBTForPage('first-edition-tee');

  const taskbarHeight = items.length > 0 && !showPopup ? 64 : 0;

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <span onClick={() => router.back()} style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', fontSize: 16, color: '#232323', cursor: 'pointer', fontWeight: 500, zIndex: 10005, background: 'rgba(255,255,255,0.9)', border: '1px solid #e0e0e0', borderRadius: '20px', padding: '8px 16px', textDecoration: 'none', backdropFilter: 'blur(10px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.2s ease', pointerEvents: 'auto' }}>← Go Back</span>
      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4" style={{ paddingTop: 120, paddingBottom: taskbarHeight }}>
        <div className="flex w-full md:w-1/2 flex-col items-center gap-4">
          <div className="relative w-full max-w-sm md:max-w-full aspect-square rounded-xl overflow-hidden bg-white shadow-sm">
            <Image src={selectedImage} alt={PRODUCT.name} fill sizes="(max-width: 768px) 90vw, 420px" style={{ objectFit: "contain", background: "#fff" }} priority />
          </div>
          <div className="flex gap-2 justify-center">
            {selectedColor.images.map((img) => (
              <button key={img} onClick={() => setSelectedImage(img)} className={`relative w-16 h-16 rounded border ${selectedImage === img ? "ring-2 ring-black" : ""}`}>
                <Image src={img} alt={PRODUCT.name} fill style={{ objectFit: "contain", background: "#fff" }} />
              </button>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          <div className="text-2xl font-semibold mb-6">${PRODUCT.price}</div>
          {/* Color Picker */}
          <ColorPicker
            options={colorOptions}
            selectedName={selectedColor.name}
            onSelect={(opt) => {
              const match = colorOptions.find(c => c.name === opt.name) ?? colorOptions[0];
              setSelectedColor(match);
              setSelectedImage(match.images[0]);
            }}
          />
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Size:</p>
            <div className="size-single-line">
              {PRODUCT.sizes.map((size) => (
                <button key={size} className={`size-button px-3 rounded-lg font-semibold border-2 transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50'}`} onClick={() => setSelectedSize(size)} type="button">{size}</button>
              ))}
            </div>
            <div className="mt-2"><SizeGuide productSlug="first-edition-tee" imagePath="/images/size-guides/Size Guide/First Edition Tee Table.png" /></div>
          </div>

          <div className="mb-4 space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">{PRODUCT.description}</p>
            {PRODUCT.details && (
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Details</span>
                <ul className="mt-2 list-disc list-inside text-gray-700 text-sm sm:text-base space-y-1">
                  {PRODUCT.details.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>

      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={(item) => { addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: PRODUCT.sizes[2] }); setShowPopup(true); setTimeout(() => setShowPopup(false), 1500); }}
        onAddAllToCart={() => { boughtTogetherItems.forEach((item) => addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: PRODUCT.sizes[2] })); setShowPopup(true); setTimeout(() => setShowPopup(false), 1500); }}
      />

      {/* Reviews */}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#fbf6f0' }} className="py-12 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <CustomerReviews productId="first-edition-tee" />
        </div>
      </div>

    </div>
  );
}
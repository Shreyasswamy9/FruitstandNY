"use client";
import Image from "next/image";
import React, { useState } from "react";
import SizeGuide from "@/components/SizeGuide";
import CustomerReviews from "@/components/CustomerReviews";
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";

const wasabiImages = [
  "/images/products/Wasabi Tee/Wabasabi 1.png",
  "/images/products/Wasabi Tee/Wabasabi 2.png",
  "/images/products/Wasabi Tee/Wabsabi 3.png",
  "/images/products/Wasabi Tee/Wabsabi 4.png",
];

const PRODUCT = {
  name: "WABISABI™ SCHEFFEL HALL PEARS T",
  price: 45,
  description: "100% Heavyweight Cotton. Custom cut and sewn fit. Designed in NYC and crafted in Portugal.\n\nWe spent over a year and a half researching, traveling and touring to source the best materials and people to work with. With this and future WABISABI designs, we look to feature motifs that study the effects of the passage of time in our City, culture and history.\n\nBuilt in 1895, Scheffel Hall remains an important part of the cultural and architectural history of the City. More can be read about here: http://s-media.nyc.gov/agencies/lpc/lp/1959.pdf\n\nThe WABISABI SCHEFFEL HALL PEARS T features an image we took of Scheffel Hall in December 2021, inside of our golden pear design.\n\nComes with uniquely made and universally loved hang tags. All of the hang tags were 100% made in NYC.\n\nYour purchase will arrive in a one of a kind, locally sourced sustainable burlap bag that features a custom Americana design.",
  details: [
    "100% Heavyweight Cotton. Custom cut and sewn fit",
    "Designed in NYC — crafted in Portugal",
    "Image of Scheffel Hall (photo taken Dec 2021) inside our golden pear motif",
    "Includes NYC-made hang tags and a sustainable burlap bag",
    "More on Scheffel Hall: http://s-media.nyc.gov/agencies/lpc/lp/1959.pdf",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

export default function WasabiTeePage() {
  const [selectedImage, setSelectedImage] = useState(wasabiImages[0]);
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[2]);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const handleAddToCart = () => {
    addToCart({
      productId: "wasabi-tee",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const boughtTogetherItems = [
    { id: 'porcelain-hat', name: 'Porcelain Hat', price: 40, image: '/images/products/Porcelain Hat/FS2.png' },
    { id: 'tracksuit', name: 'Retro Track Suit', price: 120, image: '/images/products/tracksuits/ELMHURST TARO CUSTARD/TP.png' },
  ];

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
            {wasabiImages.map((img) => (
              <button key={img} onClick={() => setSelectedImage(img)} className={`relative w-16 h-16 rounded border ${selectedImage === img ? "ring-2 ring-black" : ""}`}>
                <Image src={img} alt={PRODUCT.name} fill style={{ objectFit: "contain", background: "#fff" }} />
              </button>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          <div className="text-2xl font-semibold mb-6">${PRODUCT.price}</div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Size:</p>
            <div className="size-single-line">
              {PRODUCT.sizes.map((size) => (
                <button key={size} className={`size-button px-3 rounded-lg font-semibold border-2 transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50'}`} onClick={() => setSelectedSize(size)} type="button">{size}</button>
              ))}
            </div>
            <div className="mt-2"><SizeGuide productSlug="wasabi-tee" /></div>
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

      {/* Frequently Bought Together */}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#fbf6f0' }} className="py-12 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Bought Together</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {boughtTogetherItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 300px" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-lg font-bold text-gray-800 mb-4">${item.price}</p>
                <button className="w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#fbf6f0' }} className="py-12 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <CustomerReviews productId="wasabi-tee" />
        </div>
      </div>

    </div>
  );
}

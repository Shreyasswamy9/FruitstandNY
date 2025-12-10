"use client";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";
import SizeGuide from "@/components/SizeGuide";
import BundleSheet from '@/components/BundleSheet'
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ColorPicker, { type ColorOption } from '@/components/ColorPicker';

// Fuji Long Sleeve color image map (multiple images per color for gallery)
// Slugs: arboretum, hudson-blue, redbird, broadway-noir
type FujiColorSlug = 'arboretum' | 'hudson-blue' | 'redbird' | 'broadway-noir';

const FUJI_COLOR_IMAGE_MAP: Record<FujiColorSlug, string[]> = {
  'arboretum': [
    '/images/products/fuji-tshirt/Arboretum/F2.png',
    '/images/products/fuji-tshirt/Arboretum/F11.png',
    '/images/products/fuji-tshirt/Arboretum/F12.png'
  ],
  'hudson-blue': [
    '/images/products/fuji-tshirt/Hudson blue/F1.png',
    '/images/products/fuji-tshirt/Hudson blue/F9.png',
    '/images/products/fuji-tshirt/Hudson blue/F10.png'
  ],
  'redbird': [
    '/images/products/fuji-tshirt/Redbird/F4.png',
    '/images/products/fuji-tshirt/Redbird/F5.png',
    '/images/products/fuji-tshirt/Redbird/F6.png'
  ],
  'broadway-noir': [
    '/images/products/fuji-tshirt/Broadwaynoir/F3.png',
    '/images/products/fuji-tshirt/Broadwaynoir/F7.png',
    '/images/products/fuji-tshirt/Broadwaynoir/F8.png'
  ]
};

const isFujiColorSlug = (value: string): value is FujiColorSlug =>
  Object.prototype.hasOwnProperty.call(FUJI_COLOR_IMAGE_MAP, value);

type FujiColorOption = ColorOption & {
  images: string[];
  slug: FujiColorSlug;
};

const PRODUCT = {
  name: "Fuji Long Sleeve",
  price: 80,
  description:
    "Crafted from 100% organic cotton in Portugal, made in a relaxed fit. At 250 GSM, it’s heavy weight, soft, and breathable — designed for effortless everyday wear.",
  details: [
    "100% organic cotton (250 GSM)",
    "Oversized, loose silhouette",
    "Breathable and soft for everyday wear",
    "Made in Portugal",
    "Ships with a custom FRUITSTAND sticker printed in NYC",
  ],
};

export default function FujiTshirtPage() {
  const colorOptions = useMemo<FujiColorOption[]>(() => [
    { name: 'Arboretum', slug: 'arboretum', color: '#0f5132', images: FUJI_COLOR_IMAGE_MAP['arboretum'], bg: '#e6f3ec', border: '#b6d9c6' },
    { name: 'Hudson Blue', slug: 'hudson-blue', color: '#243b5a', images: FUJI_COLOR_IMAGE_MAP['hudson-blue'], bg: '#e5edf6', border: '#c2d2e6' },
    { name: 'Redbird', slug: 'redbird', color: '#c21010', images: FUJI_COLOR_IMAGE_MAP['redbird'], bg: '#fceaea', border: '#f4bcbc' },
    { name: 'Broadway Noir', slug: 'broadway-noir', color: '#000000', images: FUJI_COLOR_IMAGE_MAP['broadway-noir'], bg: '#ededed', border: '#d4d4d4' },
  ], []);
  const [selectedColor, setSelectedColor] = useState<FujiColorOption>(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState<string>(colorOptions[0].images[0]);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [bundleOpen, setBundleOpen] = useState(false);
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  // useSearchParams can cause build-time suspense issues; read from window.location in an effect instead

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "fuji-full-sleeve",
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

  // Preselect variant via query param (?color=slug)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const colorSlugParam = params.get('color');
    if (!colorSlugParam || !isFujiColorSlug(colorSlugParam)) return;
    const colorSlug = colorSlugParam;
    const found = colorOptions.find(c => c.slug === colorSlug);
    if (found) {
      setSelectedColor(found);
      setSelectedImage(found.images[0]);
    }
  }, [colorOptions]);

  const boughtTogetherItems = getFBTForPage('fuji-tshirt');

  const handleAddBoughtTogetherItem = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: "M" });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const handleAddAllToCart = () => {
    boughtTogetherItems.forEach(item => addToCart({ productId: item.id, name: item.name, price: item.price * 0.85, image: item.image, quantity: 1, size: "M" }));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const taskbarHeight = items.length > 0 && !showPopup ? 64 : 0;

  

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <span
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); try { router.back(); } catch { window.history.back(); } }}
        style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', fontSize: 16, color: '#232323', cursor: 'pointer', fontWeight: 500, zIndex: 10005, userSelect: 'none', background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e0e0e0', borderRadius: '20px', padding: '8px 16px', textDecoration: 'none', backdropFilter: 'blur(10px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.2s ease', pointerEvents: 'auto' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 1)'; e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'; e.currentTarget.style.transform = 'translateX(-50%) translateY(0px)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; }}
      >
        ← Go Back
      </span>

  <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4" style={{ paddingBottom: taskbarHeight, minHeight: '100vh', paddingTop: 120 }}>
        {/* Images */}
        <div className="flex w-full md:w-1/2 flex-col items-center gap-4">
          <div className="relative w-full max-w-sm md:max-w-full aspect-square rounded-xl overflow-hidden bg-white shadow-sm">
            <Image src={selectedImage} alt={PRODUCT.name} style={{ objectFit: "contain", background: "#fff" }} fill sizes="(max-width: 768px) 90vw, 420px" priority />
          </div>
          <div className="flex gap-2 justify-center">
            {selectedColor.images.map((img) => (
              <button key={img} onClick={() => setSelectedImage(img)} className={`relative w-16 h-16 rounded border ${selectedImage === img ? 'ring-2 ring-black' : ''}`}>
                <Image src={img} alt={`${PRODUCT.name} - ${selectedColor.name}`} fill style={{ objectFit: 'contain', background: '#fff' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          {/* Color Picker */}
          <div>
            <ColorPicker
              options={colorOptions}
              selectedName={selectedColor.name}
              onSelect={(opt) => {
                const match = colorOptions.find(c => c.name === opt.name) ?? colorOptions[0];
                setSelectedColor(match);
                setSelectedImage(match.images[0]);
                if (typeof window !== 'undefined' && match.slug) {
                  window.history.replaceState(null, '', `/shop/fuji-tshirt?color=${match.slug}`);
                }
              }}
            />
          </div>

          {/* Size Selection */}
          <div style={{ marginBottom: 18 }}>
            <p className="text-sm font-medium text-gray-700 mb-3">Size:</p>
            <div className="size-single-line">
              {["XS","S","M","L","XL","XXL","XXXL"].map((size) => (
                <button key={size} className={`size-button px-3 rounded-lg font-semibold border-2 transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50'}`} onClick={() => setSelectedSize(size)} type="button">{size}</button>
              ))}
            </div>
            <div className="mt-2"><SizeGuide productSlug="fuji-tshirt" imagePath="/images/size-guides/Size Guide/Fuji Table.png" /></div>
          </div>

          <div className="mb-4 space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">{PRODUCT.description}</p>
            {/* Bundle CTA: open bundle sheet on custom tab */}
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm text-gray-500">Want to bundle this tee?</span>
              <button
                onClick={() => setBundleOpen(true)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Build a Custom Bundle
              </button>
            </div>
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
          <div className="text-2xl font-semibold mb-6">${PRODUCT.price}.00</div>
          <button className={`bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2 ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleAddToCart} disabled={!selectedSize}>
            {!selectedSize ? 'Pick a size to add to cart' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={handleAddBoughtTogetherItem}
        onAddAllToCart={handleAddAllToCart}
      />

      {/* Reviews */}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#fbf6f0' }} className="py-12 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <CustomerReviews productId="fuji-full-sleeve" />
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
      {/* Bundle sheet modal: opens when CTA is clicked */}
      <BundleSheet open={bundleOpen} onClose={() => setBundleOpen(false)} initialTab="custom" />
    </div>
  );
}

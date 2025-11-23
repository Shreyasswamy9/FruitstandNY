"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";
import SizeGuide from "@/components/SizeGuide";
import BundleSheet from '@/components/BundleSheet'
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ColorPicker from '@/components/ColorPicker';

// Color-specific image sets (kept explicit for clarity and to avoid client fs access)
const COLOR_IMAGE_MAP: Record<string, string[]> = {
  'broadway-noir': [
    '/images/products/gala-tshirt/broadwaynoir/GN4.png',
    '/images/products/gala-tshirt/broadwaynoir/GN5.png'
  ],
  'sutton-place-snow': [
    '/images/products/gala-tshirt/suttonplacesnow/GN6.png',
    '/images/products/gala-tshirt/suttonplacesnow/GN11.png'
  ],
  'grasshopper': [
    '/images/products/gala-tshirt/Grasshopper/GN3.png',
    '/images/products/gala-tshirt/Grasshopper/GN8.png'
  ],
  'frosted-lemonade': [
    '/images/products/gala-tshirt/frostedlemonade/GN9.png',
    '/images/products/gala-tshirt/frostedlemonade/GN10.png'
  ],
  'ruby-red': [
    '/images/products/gala-tshirt/ruby red/GN.png',
    '/images/products/gala-tshirt/ruby red/GN7.png'
  ],
  'italian-ice': [
    '/images/products/gala-tshirt/italianice/GN1.png',
    '/images/products/gala-tshirt/italianice/GN2.png'
  ]
};

const PRODUCT = {
  name: "Gala Tee",
  price: 40,
  description: "Crafted from 100% organic cotton in Portugal, made in a relaxed fit. At 120 GSM, it’s super lightweight, soft, and breathable — designed for effortless everyday wear.",
  details: [
    "100% organic cotton (120 GSM)",
    "Oversized, loose silhouette",
    "Breathable and soft for everyday wear",
    "Made in Portugal",
    "Ships with a custom FRUITSTAND sticker printed in NYC",
  ],
};

type GalaColorOption = {
  name: string;
  slug: string;
  color: string;
  images: string[];
  bg: string;
  border?: string;
};

const GALA_COLOR_OPTIONS: GalaColorOption[] = [
  { name: 'Broadway Noir', slug: 'broadway-noir', color: '#000000', images: ['/images/products/gala-tshirt/broadwaynoir/GN4.png','/images/products/gala-tshirt/broadwaynoir/GN5.png'], bg: '#111111' },
  { name: 'Sutton Place Snow', slug: 'sutton-place-snow', color: '#ffffff', images: ['/images/products/gala-tshirt/suttonplacesnow/GN6.png','/images/products/gala-tshirt/suttonplacesnow/GN11.png'], bg: '#f5f5f5', border: '#d4d4d4' },
  { name: 'Grasshopper', slug: 'grasshopper', color: '#85c96e', images: ['/images/products/gala-tshirt/Grasshopper/GN3.png','/images/products/gala-tshirt/Grasshopper/GN8.png'], bg: '#eef9ec', border: '#cde8c9' },
  { name: 'Frosted Lemonade', slug: 'frosted-lemonade', color: '#fff7a8', images: ['/images/products/gala-tshirt/frostedlemonade/GN9.png','/images/products/gala-tshirt/frostedlemonade/GN10.png'], bg: '#fffce0', border: '#f9eebe' },
  { name: 'Ruby Red', slug: 'ruby-red', color: '#fd8987', images: ['/images/products/gala-tshirt/ruby red/GN.png','/images/products/gala-tshirt/ruby red/GN7.png'], bg: '#fdecef', border: '#f8cbd2' },
  { name: 'Italian Ice', slug: 'italian-ice', color: '#c7eaff', images: ['/images/products/gala-tshirt/italianice/GN1.png','/images/products/gala-tshirt/italianice/GN2.png'], bg: '#eaf7ff', border: '#cfe9f9' },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;
 
export default function GalaTshirtPage() {
  const [selectedColor, setSelectedColor] = useState<GalaColorOption>(GALA_COLOR_OPTIONS[0]);
  const [selectedImage, setSelectedImage] = useState(GALA_COLOR_OPTIONS[0].images[0]);
  // read query params at runtime inside effect to avoid prerender/suspense issues
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [bundleOpen, setBundleOpen] = useState(false);
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "gala-tshirt",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  // Preselect variant via query param (?color=slug) — done at runtime only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const colorSlug = params.get('color');
    if (colorSlug) {
      const found = GALA_COLOR_OPTIONS.find(c => c.slug === colorSlug);
      if (found) {
        setSelectedColor(found);
        setSelectedImage(found.images[0]);
      }
    }
  }, []);

  const boughtTogetherItems = getFBTForPage('gala-tshirt');

  const handleAddBoughtTogetherItem = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart({ productId: item.id, name: item.name, price: item.price, salePrice: (item as any).salePrice, image: item.image, quantity: 1, size: "M" });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const handleAddAllToCart = () => {
    boughtTogetherItems.forEach(item => addToCart({ productId: item.id, name: item.name, price: item.price * 0.85, salePrice: (item as any).salePrice ? (item as any).salePrice * 0.85 : undefined, image: item.image, quantity: 1, size: "M" }));
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

  <div className="flex flex-col md:flex-row items-start gap-8 max-w-4xl mx-auto py-12 px-4" style={{ paddingBottom: taskbarHeight, minHeight: '100vh', paddingTop: 120 }}>
        {/* Images */}
        <div className="flex w-full md:w-1/2 flex-col items-center gap-4 shrink-0">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#fbf6f0] shadow-sm shrink-0">
            <Image
              src={selectedImage}
              alt={PRODUCT.name}
              fill
              className="object-contain bg-[#fbf6f0]"
            />
          </div>
          <div className="flex gap-2 justify-center">
            {COLOR_IMAGE_MAP[selectedColor.slug].map((img) => (
              <button
                key={img}
                onClick={() => setSelectedImage(img)}
                className={`relative w-16 h-16 rounded overflow-hidden border border-gray-200 bg-[#fbf6f0] ${selectedImage === img ? 'ring-2 ring-black' : ''}`}
              >
                <Image src={img} alt="" fill className="object-contain bg-[#fbf6f0]" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          {/* Color Picker */}
          <ColorPicker
            options={GALA_COLOR_OPTIONS as any}
            selectedName={selectedColor.name}
            onSelect={(opt) => {
              setSelectedColor(opt as any);
              setSelectedImage((opt.images && opt.images[0]) || selectedImage);
              if (typeof window !== 'undefined' && opt.slug) window.history.replaceState(null, '', `/shop/gala-tshirt?color=${opt.slug}`);
            }}
          />

          {/* Size Selection */}
          <div style={{ marginBottom: 18 }}>
            <p className="text-sm font-medium text-gray-700 mb-3">Size:</p>
            <div className="size-single-line">
              {SIZE_OPTIONS.map((size) => (
                <button key={size} className={`size-button px-3 rounded-lg font-semibold border-2 transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50'}`} onClick={() => setSelectedSize(size)} type="button">{size}</button>
              ))}
            </div>
            <div className="mt-2"><SizeGuide productSlug="gala-tshirt" imagePath="/images/size-guides/Size Guide/Gala Table.png" /></div>
          </div>

          <div className="mb-4">
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
          <div className="text-2xl font-semibold mb-6">${PRODUCT.price.toFixed(2)}</div>
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
          <CustomerReviews productId="gala-tshirt" />
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

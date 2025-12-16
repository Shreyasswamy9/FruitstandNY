"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import SizeGuide from "@/components/SizeGuide";
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import Price from '@/components/Price';
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";
import ColorPicker from '@/components/ColorPicker';

const TRACKSUIT_IMAGE_MAP: Record<string, string[]> = {
  'elmhurst-taro-custard': [
    '/images/products/tracksuits/ELMHURST TARO CUSTARD/TP.png',
    '/images/products/tracksuits/ELMHURST TARO CUSTARD/TS7.png',
  ],
  'greenpoint-patina-crew': [
    '/images/products/tracksuits/Greenpoint Patina Crew/GB.png',
    '/images/products/tracksuits/Greenpoint Patina Crew/TS2.png',
  ],
  'noho-napoletanos': [
    '/images/products/tracksuits/NOHO NAPOLETANOS/TB.png',
    '/images/products/tracksuits/NOHO NAPOLETANOS/TS3.png',
  ],
  'the-factory-floor': [
    '/images/products/tracksuits/THE FACTORY FLOOR/BG.png',
    '/images/products/tracksuits/THE FACTORY FLOOR/TS4.png',
  ],
  'vice-city-runners': [
    '/images/products/tracksuits/VICE CITY RUNNERS/PB.png',
    '/images/products/tracksuits/VICE CITY RUNNERS/TS5.png',
  ],
  'victory-liberty-club': [
    '/images/products/tracksuits/Victory Liberty Club/RB.png',
    '/images/products/tracksuits/Victory Liberty Club/TS6.png',
  ],
  'yorkville-black-and-white-cookies': [
    '/images/products/tracksuits/YORKVILLE BLACK AND WHITE COOKIES/BW.png',
    '/images/products/tracksuits/YORKVILLE BLACK AND WHITE COOKIES/TS1.png',
  ],
};

const TRACKSUIT_VARIANTS = [
  { name: 'Elmhurst Taro Custard', slug: 'elmhurst-taro-custard', color: '#8271c2', images: TRACKSUIT_IMAGE_MAP['elmhurst-taro-custard'], bg: '#eee9ff', border: '2px solid #d1c8f3' },
  { name: 'Greenpoint Patina Crew', slug: 'greenpoint-patina-crew', color: '#58543a', images: TRACKSUIT_IMAGE_MAP['greenpoint-patina-crew'], bg: '#f1f0e6', border: '2px solid #d2cfba' },
  { name: 'Noho Napoletanos', slug: 'noho-napoletanos', color: '#ab8c65', images: TRACKSUIT_IMAGE_MAP['noho-napoletanos'], bg: '#f4ecdf', border: '2px solid #e1d2b8' },
  { name: 'The Factory Floor', slug: 'the-factory-floor', color: '#1e2744', images: TRACKSUIT_IMAGE_MAP['the-factory-floor'], bg: '#e6e9f4', border: '2px solid #c2c8da' },
  { name: 'Vice City Runners', slug: 'vice-city-runners', color: '#fddde9', images: TRACKSUIT_IMAGE_MAP['vice-city-runners'], bg: '#fff0f6', border: '2px solid #f7c2d8' },
  { name: 'Victory Liberty Club', slug: 'victory-liberty-club', color: '#7a273b', images: TRACKSUIT_IMAGE_MAP['victory-liberty-club'], bg: '#f4dde4', border: '2px solid #e6b8c7' },
  { name: 'Yorkville Black and White Cookies', slug: 'yorkville-black-and-white-cookies', color: '#000000', images: TRACKSUIT_IMAGE_MAP['yorkville-black-and-white-cookies'], bg: '#f5f5f5', border: '2px solid #d4d4d4' },
] as const;

type TracksuitVariant = typeof TRACKSUIT_VARIANTS[number];

const PRODUCT = {
  name: "Retro Track Suit",
  price: 165,
  description: "Inspired by classic New York athletic warm-ups, this track suit features bold color blocking and a relaxed, vintage silhouette designed for movement and comfort. Each colorway pays homage to various motifs, with contrasting panels and embroidered FRUITSTAND® logos.",
  details: [
    "100% Nylon shell",
    "Inner mesh lining",
    "Made in Sialkot, Pakistan",
  ],
};

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function TracksuitPage() {
  const colorOptions = TRACKSUIT_VARIANTS;
  const [selectedColor, setSelectedColor] = useState<TracksuitVariant>(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState(colorOptions[0].images[0]);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const colorSlug = params.get('color');
    if (!colorSlug) return;
    const found = colorOptions.find(option => option.slug === colorSlug);
    if (found) {
      setSelectedColor(found);
      setSelectedImage(found.images[0]);
    }
  }, [colorOptions]);

  // Show popup and keep it visible
  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "tracksuit",
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

  // Height of the taskbar (matches py-3 + px-2, but add extra for safety)
  const taskbarHeight = items.length > 0 && !showPopup ? 64 : 0;

  // Sample data for "bought together" items
  const boughtTogetherItems = getFBTForPage('tracksuit');

  // Customer reviews are loaded via the centralized CustomerReviews component (Supabase-backed)

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      {/* Go Back button - top center to avoid overlap with logo (left) and menu (right) */}
      <span
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Go back button clicked');
          try {
            router.back();
          } catch (err) {
            console.log('Router.back failed, using window.history.back', err);
            window.history.back();
          }
        }}
        style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 16,
          color: '#232323',
          cursor: 'pointer',
          fontWeight: 500,
          zIndex: 10005,
          userSelect: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #e0e0e0',
          borderRadius: '20px',
          padding: '8px 16px',
          textDecoration: 'none',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          pointerEvents: 'auto',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
          e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.transform = 'translateX(-50%) translateY(0px)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
      >
        ← Go Back
      </span>
      
      {/* Section 1: Product Details */}
      <div
        className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4"
        style={{
          paddingBottom: taskbarHeight,
          minHeight: '100vh',
          paddingTop: 120,
        }}
      >
        {/* Images */}
        <div className="flex w-full md:w-1/2 flex-col items-center gap-4">
          <div className="relative w-full max-w-sm md:max-w-full aspect-square rounded-xl overflow-hidden shadow-sm" style={{ background: selectedColor.bg }}>
            <Image
              src={selectedImage}
              alt={PRODUCT.name}
              style={{ objectFit: "contain", background: selectedColor.bg }}
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              priority
            />
          </div>
          <div className="flex gap-2 justify-center">
            {selectedColor.images.map((img) => (
              <button
                key={img}
                onClick={() => setSelectedImage(img)}
                className={`relative w-16 h-16 rounded border ${selectedImage === img ? "ring-2 ring-black" : ""}`}
                style={{ background: selectedColor.bg }}
              >
                <Image src={img} alt={`${PRODUCT.name} - ${selectedColor.name}`} fill style={{ objectFit: "contain", background: selectedColor.bg }} />
              </button>
            ))}
          </div>
        </div>
  {/* Product Info */}
  <div className="md:w-1/2 flex flex-col justify-start">
  <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
        <ColorPicker
          options={colorOptions as any}
          selectedName={selectedColor.name}
          onSelect={(opt) => {
            setSelectedColor(opt as any);
            setSelectedImage((opt.images && opt.images[0]) || selectedImage);
            if (typeof window !== 'undefined' && opt.slug) window.history.replaceState(null, '', `/shop/tracksuit?color=${opt.slug}`);
          }}
        />
        {/* Size Selection */}
        <div style={{ marginBottom: 18 }}>
          <p className="text-sm font-medium text-gray-700 mb-3">Size:</p>
          <div className="size-single-line">
            {sizeOptions.map((size) => (
              <button
                key={size}
                className={`size-button px-3 rounded-lg font-semibold border-2 transition-all ${
                  selectedSize === size
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedSize(size)}
                type="button"
              >
                {size}
              </button>
            ))}
          </div>
          <div className="mt-2"><SizeGuide productSlug="tracksuit" imagePath="/images/size-guides/Size Guide/Track Jacket.png" /></div>
        </div>
        <div className="mb-4 space-y-4">
          <p className="text-lg text-gray-700 leading-relaxed">{PRODUCT.description}</p>
          {/* Suggested separate pieces (jacket / pants) - small, subtle CTA links */}
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
            <span className="text-sm text-gray-500 mr-2">Prefer pieces?</span>
            <div className="flex gap-2">
              <a
                href="/shop/track-top"
                className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label="Buy the track jacket"
                title="Buy the track jacket"
              >
                Jacket
              </a>

              <a
                href="/shop/track-pants"
                className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label="Buy the track pants"
                title="Buy the track pants"
              >
                Pants
              </a>
            </div>
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
          <div className="text-2xl font-semibold mb-6"><Price price={PRODUCT.price} /></div>
        <button
          className={`bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2 ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          {!selectedSize ? 'Pick a size to add to cart' : 'Add to Cart'}
        </button>
        {/* Buy Now button removed as requested */}
        </div>
      </div>

      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={(item) => { addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: 'M' }); setShowPopup(true); setTimeout(() => setShowPopup(false), 1500); }}
        onAddAllToCart={() => { boughtTogetherItems.forEach(item => addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: 'M' })); setShowPopup(true); setTimeout(() => setShowPopup(false), 1500); }}
      />

      {/* Section 3: Customer Reviews */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: '#fbf6f0'
        }}
        className="py-12 px-4"
      >
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Customer Reviews</h2>
          <div>
            <CustomerReviews productId="tracksuit" />
          </div>
        </div>
      </div>

      {/* No add to cart popup or animation */}

      {/* Minimalistic cart taskbar at bottom if cart has items */}
      {items.length > 0 && !showPopup && (
        <div
          className="fixed left-0 right-0 bottom-0 z-50 bg-black text-white px-2 py-3 md:px-4 md:py-4 flex items-center justify-between"
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)', borderBottom: 'none' }}
        >
          <span className="font-medium text-sm md:text-base">Cart</span>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="inline-block bg-white text-black rounded px-2 py-1 md:px-3 font-bold text-sm md:text-base">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
            <a
              href="/cart"
              className="ml-1 md:ml-2 px-3 py-2 md:px-4 md:py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 text-xs md:text-base"
              style={{ textDecoration: 'none' }}
            >
              Head to Cart
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

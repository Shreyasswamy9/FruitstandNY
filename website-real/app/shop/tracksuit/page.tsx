"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import SizeGuide from "@/components/SizeGuide";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import Price from '@/components/Price';
import Link from "next/link";
import { useCart } from "../../../components/CartContext";
import ColorPicker from '@/components/ColorPicker';
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { PurchaseColorOption, PurchaseSizeOption } from "@/components/ProductPurchaseBar";

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

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function TracksuitPage() {
  const colorOptions = TRACKSUIT_VARIANTS;
  const [selectedColor, setSelectedColor] = useState<TracksuitVariant>(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState(colorOptions[0].images[0]);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSelectColor = useCallback((option: TracksuitVariant, ctx?: { image?: string }) => {
    setSelectedColor(option);
    setSelectedImage(prev => ctx?.image ?? option.images?.[0] ?? prev);
    if (typeof window !== 'undefined') {
      const basePath = window.location.pathname.split('?')[0];
      const query = option.slug ? `?color=${option.slug}` : '';
      window.history.replaceState(null, '', `${basePath}${query}`);
    }
  }, []);

  const handleImageChange = useCallback((image: string) => {
    setSelectedImage(image);
  }, []);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const colorSlug = params.get('color');
    if (!colorSlug) return;
    const found = colorOptions.find(option => option.slug === colorSlug);
    if (found && found.slug !== selectedColor.slug) {
      handleSelectColor(found);
    }
  }, [colorOptions, handleSelectColor, selectedColor.slug]);

  // Show popup and keep it visible
  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "0f5810c1-abec-4e70-a077-33c839b4de2b",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  // Sample data for "bought together" items
  const boughtTogetherItems = getFBTForPage('tracksuit');

  const sizeOptionsForBar: PurchaseSizeOption[] = useMemo(
    () => SIZE_OPTIONS.map((size) => ({ value: size, label: size })),
    []
  );

  const purchaseColorOptions: PurchaseColorOption[] = useMemo(
    () => TRACKSUIT_VARIANTS.map((option) => ({
      value: option.slug,
      label: option.name,
      swatch: option.color,
    })),
    []
  );
  return (
    <div>
      <ProductPageBrandHeader />
      
      {/* Section 1: Product Details */}
      <div
        className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4"
        style={{
          paddingTop: 96,
          paddingBottom: 64,
        }}
      >
        {/* Images */}
        <ProductImageGallery
          productName={PRODUCT.name}
          options={colorOptions}
          selectedOption={selectedColor}
          selectedImage={selectedImage}
          onOptionChange={(option, ctx) => handleSelectColor(option as TracksuitVariant, ctx)}
          onImageChange={handleImageChange}
          className="md:w-1/2"
          frameBackground={selectedColor.bg}
          frameBorderStyle={selectedColor.border}
        />
  {/* Product Info */}
  <div className="md:w-1/2 flex flex-col justify-start">
  <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
        <ColorPicker
          options={colorOptions as any}
          selectedName={selectedColor.name}
          onSelect={(opt) => {
            handleSelectColor(opt as TracksuitVariant);
          }}
        />
        <div style={{ marginBottom: 18 }}>
          <p className="text-sm font-medium text-gray-600 mb-1">Choose your size from the floating bar below.</p>
          <div className="mt-2"><SizeGuide productSlug="tracksuit" imagePath="/images/size-guides/Size Guide/Track Jacket.png" /></div>
        </div>
        <div className="mb-4 space-y-4">
          <p className="text-lg text-gray-700 leading-relaxed">{PRODUCT.description}</p>
          {/* Suggested separate pieces (jacket / pants) - small, subtle CTA links */}
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
            <span className="text-sm text-gray-500 mr-2">Prefer pieces?</span>
            <div className="flex gap-2">
              <Link
                href="/shop/track-top"
                className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label="Buy the track jacket"
                title="Buy the track jacket"
              >
                Jacket
              </Link>

              <Link
                href="/shop/track-pants"
                className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label="Buy the track pants"
                title="Buy the track pants"
              >
                Pants
              </Link>
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
        {/* Buy Now button removed as requested */}
        </div>
      </div>

      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={(item) => {
          const fallbackSize = selectedSize ?? 'M';
          addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: fallbackSize });
        }}
        onAddAllToCart={() => {
          const fallbackSize = selectedSize ?? 'M';
          boughtTogetherItems.forEach(item => addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: fallbackSize }));
        }}
      />

      <ProductPurchaseBar
        price={PRODUCT.price}
        summaryLabel={selectedColor.name}
        sizeOptions={sizeOptionsForBar}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        colorOptions={purchaseColorOptions}
        selectedColor={selectedColor.slug}
        onSelectColor={(value) => {
          const next = TRACKSUIT_VARIANTS.find((option) => option.slug === value);
          if (next) {
            handleSelectColor(next);
          }
        }}
        onAddToCart={handleAddToCart}
        sizeGuideTrigger={<SizeGuide productSlug="tracksuit" imagePath="/images/size-guides/Size Guide/Track Jacket.png" />}
      />
    </div>
  );
}

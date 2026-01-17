"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useCart } from "../../../components/CartContext";
import SizeGuide from "@/components/SizeGuide";
import BundleSheet from '@/components/BundleSheet'
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ColorPicker from '@/components/ColorPicker';
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { PurchaseSizeOption, PurchaseColorOption } from "@/components/ProductPurchaseBar";

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
  const { addToCart } = useCart();
  const [bundleOpen, setBundleOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const updateUrlForColor = useCallback((slug?: string) => {
    if (typeof window === 'undefined') return;
    const basePath = window.location.pathname.split('?')[0];
    const query = slug ? `?color=${slug}` : '';
    window.history.replaceState(null, '', `${basePath}${query}`);
  }, []);

  const handleSelectColor = useCallback((option: GalaColorOption, ctx?: { image?: string }) => {
    setSelectedColor(option);
    setSelectedImage(prev => ctx?.image ?? option.images?.[0] ?? prev);
    updateUrlForColor(option.slug);
  }, [updateUrlForColor]);

  const handleImageChange = useCallback((image: string) => {
    setSelectedImage(image);
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "16eab132-c3a5-4b1c-88b5-1a82cbcd90de",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  // Preselect variant via query param (?color=slug) — done at runtime only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const colorSlug = params.get('color');
    if (!colorSlug) return;
    const found = GALA_COLOR_OPTIONS.find(c => c.slug === colorSlug);
    if (found && found.slug !== selectedColor.slug) {
      handleSelectColor(found);
    }
  }, [handleSelectColor, selectedColor.slug]);

  const boughtTogetherItems = getFBTForPage('gala-tshirt');

  const handleAddBoughtTogetherItem = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: "M" });
  };

  const handleAddAllToCart = () => {
    boughtTogetherItems.forEach(item => addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: "M" }));
  };

  const sizeOptions: PurchaseSizeOption[] = useMemo(
    () => SIZE_OPTIONS.map((size) => ({ value: size, label: size })),
    []
  );

  const colorOptions: PurchaseColorOption[] = useMemo(
    () => GALA_COLOR_OPTIONS.map((option) => ({
      value: option.slug,
      label: option.name,
      swatch: option.color,
      border: option.border,
    })),
    []
  );

  return (
    <div>
      <ProductPageBrandHeader />

  <div
    className="flex flex-col md:flex-row items-start gap-8 max-w-4xl mx-auto py-12 px-4"
    style={{ paddingTop: 96, paddingBottom: "calc(var(--purchase-bar-height, 280px) + 24px)" }}
  >
        {/* Images */}
        <ProductImageGallery
          productName={PRODUCT.name}
          options={GALA_COLOR_OPTIONS}
          selectedOption={selectedColor}
          selectedImage={selectedImage}
          onOptionChange={(option, ctx) => handleSelectColor(option as GalaColorOption, ctx)}
          onImageChange={handleImageChange}
          className="md:w-1/2 shrink-0"
        />

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          {/* Color Picker */}
          <ColorPicker
            options={GALA_COLOR_OPTIONS as any}
            selectedName={selectedColor.name}
            onSelect={(opt) => {
              handleSelectColor(opt as GalaColorOption);
            }}
          />

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
          <CustomerReviews productId="16eab132-c3a5-4b1c-88b5-1a82cbcd90de" />
        </div>
      </div>

      {/* Bundle sheet modal: opens when CTA is clicked */}
      <BundleSheet open={bundleOpen} onClose={() => setBundleOpen(false)} initialTab="custom" />

      <ProductPurchaseBar
        price={PRODUCT.price}
        summaryLabel={selectedColor.name}
        sizeOptions={sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        colorOptions={colorOptions}
        selectedColor={selectedColor.slug}
        onSelectColor={(value) => {
          const next = GALA_COLOR_OPTIONS.find((option) => option.slug === value);
          if (next) {
            handleSelectColor(next);
          }
        }}
        onAddToCart={handleAddToCart}
        sizeGuideTrigger={<SizeGuide productSlug="gala-tshirt" imagePath="/images/size-guides/Size Guide/Gala Table.png" />}
      />
    </div>
  );
}

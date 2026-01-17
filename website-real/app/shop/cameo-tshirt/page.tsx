"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useCart } from "../../../components/CartContext";
import SizeGuide from "@/components/SizeGuide";
import BundleSheet from '@/components/BundleSheet'
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ColorPicker, { type ColorOption } from '@/components/ColorPicker';
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { PurchaseColorOption, PurchaseSizeOption } from "@/components/ProductPurchaseBar";

// Per-color image map for gallery display
const CAMEO_COLOR_IMAGE_MAP: Record<string, string[]> = {
  'broadway-noir': [
    '/images/products/cameo-tshirt/broadwaynoir/MN.png',
    '/images/products/cameo-tshirt/broadwaynoir/MN3.png',
    '/images/products/cameo-tshirt/broadwaynoir/MN4.png'
  ],
  'sutton-place-snow': [
    '/images/products/cameo-tshirt/suttonplacesnow/MN1.png',
    '/images/products/cameo-tshirt/suttonplacesnow/MN2.png',
    '/images/products/cameo-tshirt/suttonplacesnow/MN5.png'
  ]
};

type CameoColorOption = ColorOption & {
  images: string[];
  slug: keyof typeof CAMEO_COLOR_IMAGE_MAP;
};

const PRODUCT = {
  name: "Cameo Tee",
  price: 40,
  description: "Crafted from 100% organic cotton in Portugal, made in a relaxed fit. At 200 GSM, it’s heavy weight, soft, and breathable — designed for effortless everyday wear. The CAMEO Tee takes inspiration from our previous best sellers — Golden Delicious and Red Delicious — updated this time with a wider collar opening for more room at the neck and a relaxed, oversized silhouette.",
  details: [
    "100% organic cotton (200 GSM)",
    "Oversized, loose silhouette",
    "Breathable and soft for everyday wear",
    "Made in Portugal",
    "Ships with a custom FRUITSTAND sticker printed in NYC",
  ],
};

export default function CameoTshirtPage() {
  const colorOptions = useMemo<CameoColorOption[]>(() => [
    { name: 'Broadway Noir', slug: 'broadway-noir', color: '#000000', images: CAMEO_COLOR_IMAGE_MAP['broadway-noir'], bg: '#0a0a0a' },
    { name: 'Sutton Place Snow', slug: 'sutton-place-snow', color: '#ffffff', images: CAMEO_COLOR_IMAGE_MAP['sutton-place-snow'], bg: '#ffffff', border: '#e5e7eb' },
  ], []);
  const [selectedColor, setSelectedColor] = useState<CameoColorOption>(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState<string>(colorOptions[0].images[0]);
  const { addToCart } = useCart();
  const [bundleOpen, setBundleOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const updateUrlForColor = useCallback((slug?: string) => {
    if (typeof window === 'undefined') return;
    const basePath = window.location.pathname.split('?')[0];
    const query = slug ? `?color=${slug}` : '';
    window.history.replaceState(null, '', `${basePath}${query}`);
  }, []);

  const handleSelectColor = useCallback((option: CameoColorOption, ctx?: { image?: string }) => {
    setSelectedColor(option);
    setSelectedImage(prev => ctx?.image ?? option.images?.[0] ?? prev);
    updateUrlForColor(option.slug);
  }, [updateUrlForColor]);

  const handleImageChange = useCallback((image: string) => {
    setSelectedImage(image);
  }, []);
  
  // read from window.location in effect to avoid useSearchParams prerender/suspense issues

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "cameo-tshirt",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  // Preselect color from query param
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const colorSlug = params.get('color');
    if (!colorSlug) return;
    const found = colorOptions.find(c => c.slug === colorSlug as CameoColorOption['slug']);
    if (found && found.slug !== selectedColor.slug) {
      handleSelectColor(found);
    }
  }, [colorOptions, handleSelectColor, selectedColor.slug]);

  const boughtTogetherItems = getFBTForPage('cameo-tshirt');

  const handleAddBoughtTogetherItem = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: selectedSize ?? "M" });
  };

  const handleAddAllToCart = () => {
    const fallbackSize = selectedSize ?? "M";
    boughtTogetherItems.forEach(item => addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: fallbackSize }));
  };

  const sizeOptions: PurchaseSizeOption[] = useMemo(
    () => ["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => ({ value: size, label: size })),
    []
  );

  const purchaseColorOptions: PurchaseColorOption[] = useMemo(
    () => colorOptions.map((option) => ({ value: option.slug, label: option.name, swatch: option.color })),
    [colorOptions]
  );

  

  return (
    <div>
      <ProductPageBrandHeader />

  <div
    className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4"
    style={{ paddingTop: 96, paddingBottom: "calc(var(--purchase-bar-height, 280px) + 24px)" }}
  >
        {/* Images */}
        <ProductImageGallery
          productName={PRODUCT.name}
          options={colorOptions}
          selectedOption={selectedColor}
          selectedImage={selectedImage}
          onOptionChange={(option, ctx) => handleSelectColor(option as CameoColorOption, ctx)}
          onImageChange={handleImageChange}
          className="md:w-1/2"
        />

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          {/* Color Picker */}
          <ColorPicker
            options={colorOptions}
            selectedName={selectedColor.name}
            onSelect={(opt) => {
              const match = colorOptions.find(c => c.name === opt.name) ?? colorOptions[0];
              handleSelectColor(match);
            }}
          />

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
          <div className="text-2xl font-semibold mb-6">${PRODUCT.price}</div>
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
          <CustomerReviews productId="cameo-tshirt" />
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
        colorOptions={purchaseColorOptions}
        selectedColor={selectedColor.slug}
        onSelectColor={(value) => {
          const next = colorOptions.find((option) => option.slug === value as CameoColorOption['slug']);
          if (next) {
            handleSelectColor(next);
          }
        }}
        onAddToCart={handleAddToCart}
        sizeGuideTrigger={<SizeGuide productSlug="cameo-tshirt" imagePath="/images/size-guides/Size Guide/Cameo Table.png" />}
      />
    </div>
  );
}

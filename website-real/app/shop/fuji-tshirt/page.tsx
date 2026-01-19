"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useCart } from "../../../components/CartContext";
import SizeGuide from "@/components/SizeGuide";
import BundleSheet from '@/components/BundleSheet'
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ColorPicker, { type ColorOption } from '@/components/ColorPicker';
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { PurchaseColorOption, PurchaseSizeOption } from "@/components/ProductPurchaseBar";

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
  const { addToCart } = useCart();
  const [bundleOpen, setBundleOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const updateUrlForColor = useCallback((slug?: string) => {
    if (typeof window === 'undefined') return;
    const basePath = window.location.pathname.split('?')[0];
    const query = slug ? `?color=${slug}` : '';
    window.history.replaceState(null, '', `${basePath}${query}`);
  }, []);

  const handleSelectColor = useCallback((option: FujiColorOption, ctx?: { image?: string }) => {
    setSelectedColor(option);
    setSelectedImage(prev => ctx?.image ?? option.images?.[0] ?? prev);
    updateUrlForColor(option.slug);
  }, [updateUrlForColor]);

  const handleImageChange = useCallback((image: string) => {
    setSelectedImage(image);
  }, []);
  
  // useSearchParams can cause build-time suspense issues; read from window.location in an effect instead

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "1dcbfbda-626c-49fb-858e-c50050b4b726",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  // Preselect variant via query param (?color=slug)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const colorSlugParam = params.get('color');
    if (!colorSlugParam || !isFujiColorSlug(colorSlugParam)) return;
    const colorSlug = colorSlugParam;
    const found = colorOptions.find(c => c.slug === colorSlug);
    if (found && found.slug !== selectedColor.slug) {
      handleSelectColor(found);
    }
  }, [colorOptions, handleSelectColor, selectedColor.slug]);

  const boughtTogetherItems = getFBTForPage('fuji-tshirt');

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
        style={{ paddingTop: 96, paddingBottom: 64 }}
      >
        {/* Images */}
        <ProductImageGallery
          productName={PRODUCT.name}
          options={colorOptions}
          selectedOption={selectedColor}
          selectedImage={selectedImage}
          onOptionChange={(option, ctx) => handleSelectColor(option as FujiColorOption, ctx)}
          onImageChange={handleImageChange}
          className="md:w-1/2"
        />

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
                handleSelectColor(match);
              }}
            />
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
        </div>
      </div>

      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={handleAddBoughtTogetherItem}
        onAddAllToCart={handleAddAllToCart}
      />

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
          const next = colorOptions.find((option) => option.slug === value as FujiColorSlug);
          if (next) {
            handleSelectColor(next);
          }
        }}
        onAddToCart={handleAddToCart}
        sizeGuideTrigger={<SizeGuide productSlug="fuji-tshirt" imagePath="/images/size-guides/Size Guide/Fuji Table.png" />}
      />
    </div>
  );
}

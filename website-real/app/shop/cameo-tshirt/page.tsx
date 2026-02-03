"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useCart } from "../../../components/CartContext";
import SizeGuide from "@/components/SizeGuide";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { type ColorOption } from '@/components/ColorPicker';
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
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSelectColor = useCallback((option: CameoColorOption, ctx?: { image?: string }) => {
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
  
  // read from window.location in effect to avoid useSearchParams prerender/suspense issues

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "1ad5fc4b-898d-4e86-ada6-c4787ba20add",
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

  const sizeOptions: PurchaseSizeOption[] = useMemo(
    () => ["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => ({ value: size, label: size })),
    []
  );

  const purchaseColorOptions: PurchaseColorOption[] = useMemo(
    () => colorOptions.map((option) => ({ value: option.slug, label: option.name, swatch: option.color, border: option.border })),
    [colorOptions]
  );

  return (
    <div>
      <ProductPageBrandHeader />

      <main className="bg-[#fbf5ed] pb-[210px] pt-12">
        {/* HERO SECTION - Top 75% */}
        <div className="mx-auto w-full max-w-[400px] px-6 text-center" style={{ minHeight: '75vh' }}>
          {/* IMAGE */}
          <div className="relative mx-auto aspect-[4/5] w-full">
            <Image
              src={selectedImage}
              alt={`${selectedColor.name} ${PRODUCT.name}`}
              fill
              sizes="(max-width: 768px) 92vw, 400px"
              className="object-contain"
              priority
            />
          </div>

          {/* TITLE / PRICE - Single Line */}
          <div className="mt-8 flex flex-col items-center">
            <h1 className="text-[22px] font-black uppercase tracking-[0.08em] leading-tight text-[#1d1c19]">
              Cameo Tee - {selectedColor.name}
            </h1>

            <p className="mt-2 text-[26px] font-black text-[#1d1c19]">${PRODUCT.price}</p>
          </div>

          {/* SWATCHES */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {colorOptions.map((option) => {
              const isActive = option.slug === selectedColor.slug;

              return (
                <button
                  key={option.slug}
                  type="button"
                  onClick={() => handleSelectColor(option)}
                  aria-label={option.name}
                  className={[
                    "appearance-none bg-transparent [-webkit-tap-highlight-color:transparent]",
                    "h-7 w-7 rounded-full overflow-hidden p-[2px]",
                    "transition-transform duration-150 hover:-translate-y-[1px]",
                    "focus:outline-none focus:ring-2 focus:ring-[#1d1c19]/35",
                    isActive ? "ring-2 ring-[#1d1c19]" : "ring-1 ring-[#cfc2b3]",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className="block h-full w-full rounded-full"
                    style={{
                      backgroundColor: option.color,
                      border: option.border ? `1px solid ${option.border}` : undefined,
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* SIZE GUIDE */}
          <div className="mt-4 text-[12px] font-semibold uppercase tracking-[0.34em] text-[#1d1c19]">
            <SizeGuide
              productSlug="cameo-tshirt"
              imagePath="/images/size-guides/Size Guide/Cameo Table.png"
              buttonLabel="SIZE GUIDE"
              className="text-[12px] font-semibold uppercase tracking-[0.34em]"
            />
          </div>
        </div>

        {/* DESCRIPTION SECTION */}
        <div className="mx-auto w-full max-w-[400px] px-6 text-center">
          <p className="px-1 text-[14px] leading-relaxed text-[#3d372f]">
            {PRODUCT.description}
          </p>
        </div>

        {/* DETAILS SECTION */}
        <div className="mx-auto w-full max-w-[400px] px-6 text-left">
          <div className="mt-8">
            <p className="text-base font-semibold text-[#1d1c19]">Details</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#1d1c19]">
              {PRODUCT.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* YOU MAY ALSO LIKE SECTION */}
        <div className="mx-auto w-full max-w-[400px] px-6 text-center">
          <div className="mt-12">
            <p className="text-[22px] font-black uppercase tracking-[0.32em] text-[#1d1c19]">
              You May Also Like
            </p>
            <div className="mt-6 grid w-full grid-cols-2 gap-x-5 gap-y-10 text-left">
              {boughtTogetherItems.map((product) => (
                <div key={`${product.name}-${product.image}`} className="flex flex-col">
                  <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#1d1c19] bg-white">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="200px" />
                  </div>
                  <p className="mt-4 text-[11px] font-black uppercase tracking-[0.34em] text-[#1d1c19]">
                    {product.name}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#1d1c19]">
                    ${product.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <ProductPurchaseBar
        price={PRODUCT.price}
        summaryLabel={selectedColor.name.toUpperCase()}
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
      />
    </div>
  );
}

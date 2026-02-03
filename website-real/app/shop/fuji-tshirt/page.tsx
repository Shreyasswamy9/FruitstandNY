"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useCart } from "../../../components/CartContext";
import SizeGuide from "@/components/SizeGuide";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
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

type FujiColorOption = {
  name: string;
  slug: FujiColorSlug;
  color: string;
  images: string[];
  bg?: string;
  border?: string;
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

      <main className="bg-[#fbf5ed] pb-[210px] pt-16 md:pt-20 lg:pt-24">
        {/* HERO SECTION - Top 75% */}
        <div className="mx-auto w-full max-w-[1200px] px-6 text-center lg:px-12 lg:text-left lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-12" style={{ minHeight: '75vh' }}>
          {/* IMAGE */}
          <div className="relative mx-auto aspect-[4/5] w-full lg:mx-0 lg:max-w-[520px] lg:row-span-3">
            <img
              src={selectedImage}
              alt={`${selectedColor.name} ${PRODUCT.name}`}
              className="h-full w-full object-contain"
            />
          </div>

          {/* TITLE / PRICE - Single Line */}
          <div className="mt-8 flex flex-col items-center lg:col-start-2 lg:items-start lg:mt-6">
            <h1 className="text-[22px] font-black uppercase tracking-[0.08em] leading-tight text-[#1d1c19]">
              Fuji Long Sleeve - {selectedColor.name}
            </h1>

            <p className="mt-2 text-[26px] font-black text-[#1d1c19]">${PRODUCT.price}</p>
          </div>

          {/* SWATCHES */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:col-start-2 lg:justify-start">
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
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* SIZE GUIDE */}
          <div className="mt-4 text-[12px] font-semibold uppercase tracking-[0.34em] text-[#1d1c19] lg:col-start-2 lg:text-left">
            <SizeGuide
              productSlug="fuji-tshirt"
              imagePath="/images/size-guides/Size Guide/Fuji Table.png"
              buttonLabel="SIZE GUIDE"
              className="text-[12px] font-semibold uppercase tracking-[0.34em]"
            />
          </div>
        </div>

        {/* DESCRIPTION SECTION */}
        <div className="mx-auto w-full max-w-[900px] px-6 text-center lg:px-12 lg:text-left">
          <p className="px-1 text-[14px] leading-relaxed text-[#3d372f]">
            {PRODUCT.description}
          </p>
        </div>

        {/* DETAILS SECTION */}
        <div className="mx-auto w-full max-w-[900px] px-6 text-left lg:px-12">
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
        <div className="mx-auto w-full max-w-[1200px] px-6 text-center lg:px-12">
          <div className="mt-12">
            <p className="text-[22px] font-black uppercase tracking-[0.32em] text-[#1d1c19]">
              You May Also Like
            </p>
            <div className="mt-6 grid w-full grid-cols-2 gap-x-5 gap-y-10 text-left sm:grid-cols-3 lg:grid-cols-4">
              {boughtTogetherItems.map((product) => (
                <div key={`${product.name}-${product.image}`} className="flex flex-col">
                  <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#1d1c19] bg-white">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
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

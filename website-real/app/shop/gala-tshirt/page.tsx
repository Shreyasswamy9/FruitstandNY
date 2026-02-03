"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useCart } from "../../../components/CartContext";
import SizeGuide from "@/components/SizeGuide";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
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
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSelectColor = useCallback((option: GalaColorOption, ctx?: { image?: string }) => {
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

      <main className="bg-[#fbf5ed] pb-[60px] pt-16 md:pt-20 lg:pt-24">
        {/* HERO SECTION - Top 75% */}
        <div className="mx-auto w-full max-w-[1280px] px-6 text-center lg:px-12 lg:text-left lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start lg:gap-14" style={{ minHeight: '75vh' }}>
          {/* IMAGE */}
          <div className="relative mx-auto aspect-[4/5] w-full lg:mx-0 lg:max-w-[620px] lg:row-span-3">
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
          <div className="mt-8 flex flex-col items-center lg:col-start-2 lg:items-start lg:mt-45">
            <h1 className="text-[22px] font-black uppercase tracking-[0.08em] leading-tight text-[#1d1c19]">
              Gala Tee - {selectedColor.name}
            </h1>

            <p className="mt-2 text-[26px] font-black text-[#1d1c19]">${PRODUCT.price}</p>
          </div>

          {/* SWATCHES */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:col-start-2 lg:justify-start">
            {GALA_COLOR_OPTIONS.map((option) => {
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
          <div className="mt-4 text-[12px] font-semibold uppercase tracking-[0.34em] text-[#1d1c19] lg:col-start-2 lg:text-left">
            <SizeGuide
              productSlug="gala-tshirt"
              imagePath="/images/size-guides/Size Guide/Gala Table.png"
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
          <div className="mt-8">
            <p className="text-[22px] font-black uppercase tracking-[0.32em] text-[#1d1c19]">
              You May Also Like
            </p>
            <div className="mt-5 grid w-full grid-cols-2 gap-x-4 gap-y-6 text-left sm:grid-cols-3 lg:grid-cols-4">
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
        colorOptions={colorOptions}
        selectedColor={selectedColor.slug}
        onSelectColor={(value) => {
          const next = GALA_COLOR_OPTIONS.find((option) => option.slug === value);
          if (next) {
            handleSelectColor(next);
          }
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

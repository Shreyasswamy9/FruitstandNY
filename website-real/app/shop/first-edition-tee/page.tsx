"use client";
import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import SizeGuide from "@/components/SizeGuide";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { useCart } from "../../../components/CartContext";
import { type ColorOption } from '@/components/ColorPicker';
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { PurchaseColorOption, PurchaseSizeOption } from "@/components/ProductPurchaseBar";

const feImages = [
  "/images/products/First Edition Tee/FE1.png",
  "/images/products/First Edition Tee/FE2.png",
  "/images/products/First Edition Tee/FE3.png",
  "/images/products/First Edition Tee/FE4.png",
  "/images/products/First Edition Tee/FE5.png",
  "/images/products/First Edition Tee/FE6.png",
];

type FirstEditionColorOption = ColorOption & {
  images: string[];
};

const PRODUCT = {
  name: "FIRST EDITION T",
  price: 45,
  description: "100% Heavyweight cotton. Custom cut and sewn fit. Designed in NYC and crafted in Portugal. We spent over a year and a half researching, traveling and touring to source the best materials and people to work with. We had the mission to make the perfect T-shirt worthy to carry the FRUITSTAND brand; we succeeded.",
  details: [
    "100% Heavyweight Cotton, custom cut and sewn fit",
    "Designed in NYC — crafted in Portugal",
    "Trademark BLOCK LOGO at the chest with ‘ORGANIC NEW YORK CULTURE’ near the waist",
    "Comes with custom NYC-made hang tags and a sustainable burlap bag",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

export default function FirstEditionTeePage() {
  const colorOptions = React.useMemo<FirstEditionColorOption[]>(() => [
    { name: 'White', slug: 'white', images: feImages, color: '#ffffff', border: '#e5e7eb' },
    { name: 'Black', slug: 'black', images: feImages, color: '#000000' },
  ], []);
  const [selectedColor, setSelectedColor] = useState<FirstEditionColorOption>(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState<string>(colorOptions[0].images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleSelectColor = useCallback((option: FirstEditionColorOption, ctx?: { image?: string }) => {
    setSelectedColor(option);
    setSelectedImage(prev => ctx?.image ?? option.images?.[0] ?? prev);
  }, []);

  const handleImageChange = useCallback((image: string) => {
    setSelectedImage(image);
  }, []);
  
  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "149da285-d6ae-4c37-bf76-376ad50363f8",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  const boughtTogetherItems = getFBTForPage('first-edition-tee');

  const sizeOptions: PurchaseSizeOption[] = useMemo(
    () => PRODUCT.sizes.map((size) => ({ value: size, label: size })),
    []
  );

  const purchaseColorOptions: PurchaseColorOption[] = useMemo(
    () => colorOptions.map((option) => ({ value: option.slug ?? option.name, label: option.name, swatch: option.color, border: option.border })),
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
              First Edition T - {selectedColor.name}
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
              productSlug="first-edition-tee"
              imagePath="/images/size-guides/Size Guide/First Edition Tee Table.png"
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
        selectedColor={selectedColor.slug ?? selectedColor.name}
        onSelectColor={(value) => {
          const next = colorOptions.find((option) => (option.slug ?? option.name) === value);
          if (next) {
            handleSelectColor(next);
          }
        }}
        onAddToCart={handleAddToCart}
        sizeGuideTrigger={<SizeGuide productSlug="first-edition-tee" imagePath="/images/size-guides/Size Guide/First Edition Tee Table.png" />}
      />
    </div>
  );
}
"use client";
import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import SizeGuide from "@/components/SizeGuide";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { useCart } from "../../../components/CartContext";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { type PurchaseSizeOption } from "@/components/ProductPurchaseBar";

const MANDARIN_IMAGES = [
  "/images/products/Mandarin Tee/Mandarin Tee.png",
  "/images/products/Mandarin Tee/Mandarin 2.png",
  "/images/products/Mandarin Tee/Mandarin 3.png",
  "/images/products/Mandarin Tee/Mandarin 4.png",
];

const PRODUCT = {
  name: "Mandarin 橘子 [JUZI] Tee",
  price: 68,
  description:
    "Cut from heavyweight 300 GSM cotton, the Mandarin Tee brings structure to a relaxed, cropped silhouette. Minimal seams keep the oversized fruit graphic uninterrupted front and back.",
  details: [
    "100% premium heavyweight cotton (300 GSM)",
    "Two-panel construction for a seamless print",
    "Cropped, boxy silhouette",
    '32" screen-printed artwork front and back',
    "Made in Dongguan, Guangdong, China",
    "Ships with a custom FRUITSTAND sticker printed in NYC",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

const OUT_OF_STOCK_SIZES = ["XS", "S", "XXXL"] as const;

export default function MandarinTeePage() {
  const [selectedImage, setSelectedImage] = useState(MANDARIN_IMAGES[0]);
  const sizeOptions = useMemo<PurchaseSizeOption[]>(
    () =>
      PRODUCT.sizes.map((size) => ({
        value: size,
        label: size,
        soldOut: OUT_OF_STOCK_SIZES.includes(size as (typeof OUT_OF_STOCK_SIZES)[number]),
      })),
    []
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    const firstAvailable = sizeOptions.find((option) => !option.soldOut)?.value;
    return firstAvailable ?? null;
  });
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) return;
    addToCart({
      productId: "f47a07e4-6470-49b2-ace6-a60e70ee3737",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
  }, [addToCart, selectedImage, selectedSize]);

  const boughtTogetherItems = getFBTForPage("mandarin-tee");

  const selectedSizeSoldOut = selectedSize
    ? sizeOptions.find((option) => option.value === selectedSize)?.soldOut
    : false;

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
              alt={PRODUCT.name}
              fill
              sizes="(max-width: 768px) 92vw, 400px"
              className="object-contain"
              priority
            />
          </div>

          {/* TITLE / PRICE */}
          <div className="mt-8 flex flex-col items-center">
            <h1 className="text-[22px] font-black uppercase tracking-[0.08em] leading-tight text-[#1d1c19]">
              Mandarin 橘子 [JUZI] Tee
            </h1>

            <p className="mt-2 text-[26px] font-black text-[#1d1c19]">${PRODUCT.price}</p>

            {/* SIZE GUIDE */}
            <div className="mt-4 text-[12px] font-semibold uppercase tracking-[0.34em] text-[#1d1c19]">
              <SizeGuide
                productSlug="mandarin-tee"
                imagePath="/images/size-guides/Size Guide/Mandarin Tee Table.png"
                buttonLabel="SIZE GUIDE"
                className="text-[12px] font-semibold uppercase tracking-[0.34em]"
              />
            </div>
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
        summaryLabel="MANDARIN 橘子"
        sizeOptions={sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onAddToCart={handleAddToCart}
        addDisabled={!selectedSize || Boolean(selectedSizeSoldOut)}
        addDisabledReason={selectedSizeSoldOut ? "Sold out" : undefined}
        sizeGuideTrigger={
          <SizeGuide
            productSlug="mandarin-tee"
            imagePath="/images/size-guides/Size Guide/Mandarin Tee Table.png"
          />
        }
      />
    </div>
  );
}

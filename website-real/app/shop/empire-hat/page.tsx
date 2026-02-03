"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useCart } from "../../../components/CartContext";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { type PurchaseSizeOption } from "@/components/ProductPurchaseBar";

const EMPIRE_HAT_IMAGES = [
  "/images/products/empire-hat/Apple Hat.png",
  "/images/products/empire-hat/A1.png",
  "/images/products/empire-hat/A2.png",
  "/images/products/empire-hat/A3.png",
  "/images/products/empire-hat/A4.png",
  "/images/products/empire-hat/A5.png",
];

const PRODUCT = {
  name: "Empire Corduroy Hat",
  price: 49,
  description: "Premium corduroy finished with apple red embroidery front, back, and brim.",
  details: [
    "Deep red corduroy 6-panel camp hat",
    "Embroidered hits across the crown and brim",
    "Flexible brim with contrast under-bill",
    "Adjustable strap, one size fits most",
    "Made in Fujian, China",
  ],
};

export default function EmpireHatPage() {
  const galleryOption = useMemo(
    () => ({ name: PRODUCT.name, slug: "default", images: EMPIRE_HAT_IMAGES }),
    []
  );
  const [selectedImage, setSelectedImage] = useState(EMPIRE_HAT_IMAGES[0]);
  const sizeOptions = useMemo<PurchaseSizeOption[]>(
    () => [{ value: "ONE_SIZE", label: "One Size" }],
    []
  );
  const [selectedSize, setSelectedSize] = useState<string>(() => sizeOptions[0]?.value ?? "");
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) return;
    addToCart({
      productId: "98da26f5-be40-4f35-a8ad-b26dd9ae01f9",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
  }, [addToCart, selectedImage, selectedSize]);

  const boughtTogetherItems = getFBTForPage("empire-hat");

  return (
    <div>
      <ProductPageBrandHeader />

      <main className="bg-[#fbf5ed] pb-[210px] pt-12">
        {/* HERO SECTION - Top 75% */}
        <div className="mx-auto w-full max-w-[400px] px-6 text-center" style={{ minHeight: '75vh' }}>
          {/* IMAGE */}
          <div className="relative mx-auto aspect-[4/5] w-full">
            <img
              src={selectedImage}
              alt={PRODUCT.name}
              className="h-full w-full object-contain"
            />
          </div>

          {/* TITLE / PRICE / COLORWAY - Single Line */}
          <div className="mt-8 flex flex-col items-center">
            <h1 className="text-[22px] font-black uppercase tracking-[0.08em] leading-tight text-[#1d1c19]">
              Empire Corduroy Hat
            </h1>

            <p className="mt-2 text-[26px] font-black text-[#1d1c19]">${PRODUCT.price}</p>
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
        summaryLabel="APPLE RED CORDUROY"
        sizeOptions={sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

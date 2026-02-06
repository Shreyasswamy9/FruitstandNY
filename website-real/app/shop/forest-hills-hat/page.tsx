"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useCart } from "../../../components/CartContext";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { type PurchaseSizeOption } from "@/components/ProductPurchaseBar";

const FOREST_HILLS_IMAGES = [
  "/images/products/Forest Hills Hat/Green Hat.png",
  "/images/products/Forest Hills Hat/G1.png",
  "/images/products/Forest Hills Hat/G2.png",
  "/images/products/Forest Hills Hat/G3.png",
  "/images/products/Forest Hills Hat/G4.png",
];

const PRODUCT = {
  name: "Forest Hills Hat",
  price: 46,
  description: "Lime green cotton twill with tonal Fruitstand embroidery front and back.",
  details: [
    "6-panel camp silhouette",
    "Lime green crown with matching under-brim",
    "Detailed embroidery on front and back",
    "Adjustable strap, one size fits most",
    "Made in Fujian, China",
  ],
};

export default function ForestHillsHatPage() {
  const galleryOption = useMemo(
    () => ({ name: PRODUCT.name, slug: "default", images: FOREST_HILLS_IMAGES }),
    []
  );
  const [selectedImage, setSelectedImage] = useState(FOREST_HILLS_IMAGES[0]);
  const sizeOptions = useMemo<PurchaseSizeOption[]>(
    () => [{ value: "ONE_SIZE", label: "One Size" }],
    []
  );
  const [selectedSize, setSelectedSize] = useState<string>(() => sizeOptions[0]?.value ?? "");
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) return;
    addToCart({
      productId: "8d1d5080-2106-420d-b7ea-babc2fba5457",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
  }, [addToCart, selectedImage, selectedSize]);

  const boughtTogetherItems = getFBTForPage("forest-hills-hat");

  return (
    <div>
      <ProductPageBrandHeader />

      <main className="bg-[#fbf5ed] pb-[210px] pt-12">
        {/* HERO SECTION - Top 75% */}
        <div className="mx-auto w-full max-w-[1200px] px-6 text-center lg:px-12 lg:text-left lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-12" style={{ minHeight: '75vh' }}>
          {/* IMAGE */}
          <div className="relative mx-auto aspect-[4/5] w-full lg:mx-0 lg:max-w-[520px]">
            <img
              src={selectedImage}
              alt={PRODUCT.name}
              className="h-full w-full object-contain"
            />
          </div>

          {/* RIGHT COLUMN - Table-like Grid */}
          <div className="mt-8 flex flex-col items-stretch border border-[#1d1c19] bg-[#fbf5ed] lg:col-start-2 lg:mt-0">
            {/* TITLE & PRICE */}
            <div className="p-6 border-b border-[#1d1c19] text-center lg:text-left">
              <h1 className="text-[22px] font-black uppercase tracking-[0.08em] leading-tight text-[#1d1c19]">
                {PRODUCT.name}
              </h1>

              <p className="mt-2 text-[26px] font-black text-[#1d1c19]">${PRODUCT.price}</p>
            </div>

            {/* DESCRIPTION */}
            <div className="p-6 border-b border-[#1d1c19] text-center lg:text-left">
              <p className="text-[14px] leading-relaxed text-[#3d372f]">
                {PRODUCT.description}
              </p>
            </div>

            {/* DETAILS LIST */}
            <div className="p-6 text-left">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1d1c19]">Details</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-[13px] text-[#1d1c19]">
                {PRODUCT.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
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
        summaryLabel="LIME GREEN"
        sizeOptions={sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

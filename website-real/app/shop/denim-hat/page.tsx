"use client";
import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../../../components/CartContext";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { type PurchaseSizeOption } from "@/components/ProductPurchaseBar";
import { useTrackProductView } from "@/hooks/useTrackProductView";

function formatText(text: string, productName: string, colorNames: string[]): string {
  let lower = text.toLowerCase();
  const nameRegex = new RegExp(productName, "gi");
  lower = lower.replace(nameRegex, productName.toUpperCase());
  colorNames.forEach(color => {
    const colorRegex = new RegExp(color, "gi");
    lower = lower.replace(colorRegex, color.toUpperCase());
  });
  lower = lower.replace(/(?:^|[.!?]\s+)([a-z])/g, (match) => match.toUpperCase());
  return lower;
}

const DENIM_HAT_IMAGES = [
  "/images/products/denim-hat/Denim Hat.png",
  "/images/products/denim-hat/D1.png",
  "/images/products/denim-hat/D2.png",
  "/images/products/denim-hat/D3.png",
];

const PRODUCT = {
  name: "Indigo Hat",
  price: 44,
  description: "Classic indigo denim finished with tonal Fruitstand embroidery.",
  details: [
    "Washed denim 6-panel cap",
    "Contrasting top-stitch detail",
    "Adjustable strap with metal closure",
    "One size fits most",
  ],
};

export default function DenimHatPage() {
  const [selectedImage] = useState(DENIM_HAT_IMAGES[0]);
  const sizeOptions = useMemo<PurchaseSizeOption[]>(
    () => [{ value: "ONE_SIZE", label: "One Size" }],
    []
  );
  const [selectedSize, setSelectedSize] = useState<string>(() => sizeOptions[0]?.value ?? "");
  const { addToCart } = useCart();

  useTrackProductView({
    productId: "fe9f97fa-944a-4c36-8889-fdb3a9936615",
    productName: PRODUCT.name,
    price: PRODUCT.price,
    currency: "USD",
  });

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) return;
    addToCart({
      productId: "fe9f97fa-944a-4c36-8889-fdb3a9936615",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
  }, [addToCart, selectedImage, selectedSize]);

  const boughtTogetherItems = getFBTForPage("denim-hat");

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
            <h1 className="text-[24px] uppercase tracking-[0.08em] leading-tight text-[#1d1c19] font-avenir-black">
              {PRODUCT.name}
            </h1>

            <p className="mt-2 text-[26px] font-black text-[#1d1c19]">${PRODUCT.price}</p>
          </div>
        </div>

        {/* DESCRIPTION SECTION */}
        <div className="mx-auto w-full max-w-[400px] px-6 text-center mt-5">
          <p className="px-1 text-[14px] leading-relaxed text-[#3d372f]">
            {formatText(PRODUCT.description, "Indigo Hat", ["Indigo", "Denim", "Fruitstand"])}
          </p>
        </div>

        {/* DETAILS SECTION */}
        <div className="mx-auto w-full max-w-[400px] px-6 text-left">
          <div className="mt-8">
            <p className="text-base font-semibold text-[#1d1c19]">Details</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#1d1c19]">
              {PRODUCT.details.map((detail) => (
                <li key={detail}>{formatText(detail, "Indigo Hat", ["Indigo", "Denim", "Fruitstand"])}</li>
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
                    <Link
                      key={`${product.name}-${product.image}`}
                      href={`/shop/${product.id}`}
                      className="flex flex-col hover:shadow-lg transition-shadow rounded-lg"
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#1d1c19] bg-white">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-4 text-[11px] font-black uppercase tracking-[0.34em] text-[#1d1c19]">
                        {product.name}
                      </p>
                      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#1d1c19]">
                        ${product.price}
                      </p>
                    </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <ProductPurchaseBar
        price={PRODUCT.price}
        summaryLabel="INDIGO DENIM"
        sizeOptions={sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

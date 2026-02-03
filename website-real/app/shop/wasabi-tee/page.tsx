"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import { useCart } from "../../../components/CartContext";
import ProductPurchaseBar, { PurchaseSizeOption } from "@/components/ProductPurchaseBar";
import SizeGuide from "@/components/SizeGuide";

const wasabiImages = [
  "/images/products/Wasabi Tee/Wabasabi 1.png",
  "/images/products/Wasabi Tee/Wabasabi 2.png",
  "/images/products/Wasabi Tee/Wabsabi 3.png",
  "/images/products/Wasabi Tee/Wabsabi 4.png",
];

const PRODUCT = {
  name: "Wabisabi™ Scheffel Hall Pears Tee",
  price: 45,
  description: "100% Heavyweight Cotton. Custom cut and sewn fit. Designed in NYC and crafted in Portugal.\n\n***\n\nWe spent over a year and a half working researching, traveling and touring to source the best materials and people to work with. With this and future WABISABI designs, we look to feature motifs that study the effects of the passage of time in our City, culture and history.\n\nBuilt in 1895, Scheffel Hall remains an important part of the cultural and architectural history of the City. More can be read about here: http://s-media.nyc.gov/agencies/lpc/lp/1959.pdf\n\nThe WABISABI SCHEFFEL HALL PEARS T features an image we took of Scheffel Hall in December 2021, inside of our golden pear design.\n\nComes with uniquely made and universally loved hang tags. All of the hang tags were 100% made in NYC.\n\nYour purchase will arrive in a one of a kind, locally sourced sustainable burlap bag that features a custom Americana design.",
  details: [
    "100% Heavyweight Cotton",
    "Custom cut and sewn fit",
    "Designed in NYC and crafted in Portugal",
    "Includes NYC-made hang tags and sustainable burlap bag",
    "Image of Scheffel Hall (photo taken Dec 2021) inside our golden pear motif",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

export default function WasabiTeePage() {
  const [selectedImage, setSelectedImage] = useState(wasabiImages[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "51977ef7-ae8f-486f-9dd7-7620e3b6e70a",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
  };

  const boughtTogetherItems = getFBTForPage('wasabi-tee');

  const sizeOptions: PurchaseSizeOption[] = PRODUCT.sizes.map((size) => ({
    value: size,
    label: size,
  }));

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
              Wabisabi™ Scheffel Hall Pears Tee
            </h1>

            <p className="mt-2 text-[26px] font-black text-[#1d1c19]">${PRODUCT.price}</p>

            {/* SIZE GUIDE */}
            <div className="mt-4 text-[12px] font-semibold uppercase tracking-[0.34em] text-[#1d1c19]">
              <SizeGuide
                productSlug="wasabi-tee"
                imagePath="/images/size-guides/Size Guide/Wabasabi Tee Table.png"
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
        summaryLabel="WABISABI™ SCHEFFEL HALL PEARS TEE"
        sizeOptions={sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onAddToCart={handleAddToCart}
        sizeGuideTrigger={<SizeGuide productSlug="wasabi-tee" imagePath="/images/size-guides/Size Guide/Wabasabi Tee Table.png" />}
      />

    </div>
  );
}

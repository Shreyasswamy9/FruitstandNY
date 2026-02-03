"use client";

export const dynamic = 'force-dynamic'
import React, { useState, useEffect, useCallback, useMemo } from "react";
import SizeGuide from "@/components/SizeGuide";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { useCart } from "@/components/CartContext";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { PurchaseColorOption, PurchaseSizeOption } from "@/components/ProductPurchaseBar";

const HOCKEY_JERSEY_IMAGE_SET = [
  "/images/products/hockey Jersey/JN.png",
  "/images/products/hockey Jersey/JN1.png",
  "/images/products/hockey Jersey/JN2.png",
  "/images/products/hockey Jersey/JN3.png",
  "/images/products/hockey Jersey/JN4.png",
];

const HOCKEY_JERSEY_VARIANTS = [
  { name: 'Black Ice', slug: 'hockey-jersey', color: '#101010', images: HOCKEY_JERSEY_IMAGE_SET, bg: '#f2f1f0', border: '2px solid #d9d6d3' },
] as const;

type HockeyJerseyVariant = typeof HOCKEY_JERSEY_VARIANTS[number];

const PRODUCT = {
  name: "Broadway Blueberry Jersey",
  price: 180,
  description: "Inspired by vintage New York hockey uniforms, this jersey features an all-over blueberry print in a deep, tonal blue, accented with white striping featuring a red cherry pattern.\n\nAn embroidered FRUITSTAND logo runs across the chest. The relaxed fit drapes naturally and layers easily over a tee or hoodie.",
  details: [
    "100% polyester",
    "Blueberry base with cherry red accents",
    "Relaxed, hockey jersey silhouette",
    "Ribbed V-neck",
    "Made in Sialkot, Pakistan",
    "Ships with a custom FRUITSTAND sticker printed in NYC",
  ],
};

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function HockeyJerseyPage() {
  const colorOptions = HOCKEY_JERSEY_VARIANTS;
  const [selectedColor, setSelectedColor] = useState<HockeyJerseyVariant>(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState(colorOptions[0].images[0]);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const handleSelectColor = useCallback((option: HockeyJerseyVariant, ctx?: { image?: string }) => {
    setSelectedColor(option);
    setSelectedImage(prev => ctx?.image ?? option.images?.[0] ?? prev);
    if (typeof window !== 'undefined') {
      const basePath = window.location.pathname.split('?')[0];
      const query = option.slug ? `?color=${option.slug}` : '';
      window.history.replaceState(null, '', `${basePath}${query}`);
    }
  }, []);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const colorSlug = params.get('color');
    if (!colorSlug) return;
    const found = colorOptions.find(option => option.slug === colorSlug);
    if (found && found.slug !== selectedColor.slug) {
      handleSelectColor(found);
    }
  }, [colorOptions, handleSelectColor, selectedColor.slug]);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "e1e3790d-d37e-4327-a14e-53bad7745ec8",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  // Sample data for "bought together" items
  const boughtTogetherItems = getFBTForPage('hockey-jersey');

  const sizeOptionsForBar: PurchaseSizeOption[] = useMemo(
    () => sizeOptions.map((size) => ({ value: size, label: size })),
    []
  );

  const purchaseColorOptions: PurchaseColorOption[] = useMemo(
    () => colorOptions.map((option) => ({ value: option.slug, label: option.name, swatch: option.color })),
    [colorOptions]
  );

  

  return (
    <div>
      <ProductPageBrandHeader />

        <div className="bg-[#fbf5ed] pb-[210px] pt-16 md:pt-20 lg:pt-24">
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

          {/* TITLE / PRICE / COLORWAY - Single Line */}
          <div className="mt-8 flex flex-col items-center lg:col-start-2 lg:items-start lg:mt-6">
            <h1 className="text-[22px] font-black uppercase tracking-[0.08em] leading-tight text-[#1d1c19]">
              Broadway Blueberry Jersey
            </h1>

            <p className="mt-2 text-[26px] font-black text-[#1d1c19]">${PRODUCT.price}</p>

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
                productSlug="hockey-jersey"
                imagePath="/images/size-guides/Size Guide/Hockey Jersey Table.png"
                buttonLabel="SIZE GUIDE"
                className="text-[12px] font-semibold uppercase tracking-[0.34em]"
              />
            </div>
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
      </div>

      <ProductPurchaseBar
        price={PRODUCT.price}
        summaryLabel={selectedColor.name.toUpperCase()}
        sizeOptions={sizeOptionsForBar}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        colorOptions={purchaseColorOptions}
        selectedColor={selectedColor.slug}
        onSelectColor={(value) => {
          const next = colorOptions.find((option) => option.slug === value as HockeyJerseyVariant['slug']);
          if (next) {
            handleSelectColor(next);
          }
        }}
        onAddToCart={handleAddToCart}
        sizeGuideTrigger={<SizeGuide productSlug="hockey-jersey" imagePath="/images/size-guides/Size Guide/Hockey Jersey Table.png" />}
      />
    </div>
  );
}

"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useCart } from "../../../components/CartContext";
import SizeGuide from "@/components/SizeGuide";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { PurchaseColorOption, PurchaseSizeOption } from "@/components/ProductPurchaseBar";

// Per-color image map (multiple images per color)
const MUTSU_COLOR_IMAGE_MAP: Record<string, string[]> = {
  'broadway-noir': [
    '/images/products/mutsu-tshirt/broadwaynoir/N1.png',
    '/images/products/mutsu-tshirt/broadwaynoir/N2.png',
    '/images/products/mutsu-tshirt/broadwaynoir/N5.png'
  ],
  'sutton-place-snow': [
    '/images/products/mutsu-tshirt/suttonplacesnow/N3.png',
    '/images/products/mutsu-tshirt/suttonplacesnow/N4.png',
    '/images/products/mutsu-tshirt/suttonplacesnow/N6.png'
  ]
};

const PRODUCT = {
  name: "Mutsu Tee",
  price: 45,
  description: "Crafted from 100% organic cotton in Portugal, made in a relaxed fit. At 160 GSM, it’s a normal weight tee, but still soft and breathable. Features an oversized front left pocket — designed for effortless everyday wear.",
  details: [
    "100% organic cotton (160 GSM)",
    "Oversized, loose silhouette",
    "Breathable and soft for everyday wear",
    "Front left pocket",
    "Made in Portugal",
    "Ships with a custom FRUITSTAND sticker printed in NYC",
  ],
};

export default function MutsuTshirtPage() {
  const colorOptions = useMemo(() => [
    { name: 'Broadway Noir', slug: 'broadway-noir', color: '#000000', images: MUTSU_COLOR_IMAGE_MAP['broadway-noir'], bg: '#ffffff', border: '#e5e7eb' },
    { name: 'Sutton Place Snow', slug: 'sutton-place-snow', color: '#ffffff', images: MUTSU_COLOR_IMAGE_MAP['sutton-place-snow'], bg: '#ffffff', border: '#e5e7eb' },
  ], []);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState(colorOptions[0].images[0]);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSelectColor = useCallback((option: typeof colorOptions[number], ctx?: { image?: string }) => {
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

  // read color from window.location in effect to avoid useSearchParams suspense issues

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "21da7031-a510-4ea0-add3-1dce02fee867",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const colorSlug = params.get('color');
    if (!colorSlug) return;
    const found = colorOptions.find(c => c.slug === colorSlug);
    if (found && found.slug !== selectedColor.slug) {
      handleSelectColor(found);
    }
  }, [colorOptions, handleSelectColor, selectedColor.slug]);

  const boughtTogetherItems = getFBTForPage('mutsu-tshirt');

  const sizeOptions: PurchaseSizeOption[] = useMemo(
    () => ["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => ({ value: size, label: size })),
    []
  );

  const purchaseColorOptions: PurchaseColorOption[] = useMemo(
    () => colorOptions.map((option) => ({
      value: option.slug,
      label: option.name,
      swatch: option.color,
      border: option.border,
    })),
    [colorOptions]
  );

  return (
    <div>
      <ProductPageBrandHeader />

      <main className="bg-[#fbf5ed] pb-[60px] pt-16 md:pt-20 lg:pt-24">
        {/* HERO SECTION - Top 75% */}
        <div className="mx-auto w-full max-w-[1280px] px-6 text-center lg:px-12 lg:text-left lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start lg:gap-14" style={{ minHeight: '75vh' }}>
          {/* IMAGE */}
          <div className="relative mx-auto aspect-[4/5] w-full lg:mx-0 lg:max-w-[620px]">
            <Image
              src={selectedImage}
              alt={`${selectedColor.name} ${PRODUCT.name}`}
              fill
              sizes="(max-width: 768px) 92vw, 400px"
              className="object-contain"
              priority
            />
          </div>

          {/* RIGHT COLUMN - Table-like Grid */}
          <div className="mt-8 flex flex-col items-stretch border border-[#1d1c19] bg-[#fbf5ed] lg:col-start-2 lg:mt-0">
            {/* TITLE & PRICE */}
            <div className="p-6 border-b border-[#1d1c19] text-center lg:text-left">
              <h1 className="text-[22px] font-black uppercase tracking-[0.08em] leading-tight text-[#1d1c19]">
                Mutsu Tee - {selectedColor.name}
              </h1>

              <p className="mt-2 text-[26px] font-black text-[#1d1c19]">${PRODUCT.price}</p>
            </div>

            {/* SWATCHES & SIZE GUIDE */}
            <div className="p-6 border-b border-[#1d1c19] flex flex-col items-center lg:items-start">
              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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

              <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.34em] text-[#1d1c19] border-b border-[#1d1c19] inline-block pb-0.5 cursor-pointer">
                <SizeGuide
                  productSlug="mutsu-tshirt"
                  imagePath="/images/size-guides/Size Guide/Mutsu Table.png"
                  buttonLabel="SIZE GUIDE"
                  className="text-[12px] font-semibold uppercase tracking-[0.34em]"
                />
              </div>
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
        colorOptions={purchaseColorOptions}
        selectedColor={selectedColor.slug}
        onSelectColor={(value) => {
          const next = colorOptions.find((option) => option.slug === value);
          if (next) {
            handleSelectColor(next);
          }
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

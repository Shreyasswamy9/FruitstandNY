"use client";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import SizeGuide from "@/components/SizeGuide";
import React, { useState, useCallback, useMemo } from "react";
import { useCart } from "../../../components/CartContext";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { PurchaseColorOption, PurchaseSizeOption } from "@/components/ProductPurchaseBar";

type TrackTopColorOption = {
  name: string;
  slug: string;
  color: string;
  images: string[];
  bg: string;
  border?: string;
};

const COLOR_DATA: TrackTopColorOption[] = [
  { name: "Elmhurst Taro Custard", slug: "elmhurst-taro-custard", color: "#8271c2", images: ["/images/products/Track Top/ELMHURST TARO CUSTARD/J6.png"], bg: "#eee9ff", border: "2px solid #d1c8f3" },
  { name: "Greenpoint Patina Crew", slug: "greenpoint-patina-crew", color: "#58543a", images: ["/images/products/Track Top/Greenpoint Patina Crew/J1.png"], bg: "#f1f0e6", border: "2px solid #d2cfba" },
  { name: "Noho Napoletanos", slug: "noho-napoletanos", color: "#ab8c65", images: ["/images/products/Track Top/NOHO NAPOLETANOS/J7.png"], bg: "#f4ecdf", border: "2px solid #e1d2b8" },
  { name: "The Factory Floor", slug: "the-factory-floor", color: "#1e2744", images: ["/images/products/Track Top/THE FACTORY FLOOR/J4.png"], bg: "#e6e9f4", border: "2px solid #c2c8da" },
  { name: "Vice City Runners", slug: "vice-city-runners", color: "#fddde9", images: ["/images/products/Track Top/VICE CITY RUNNERS/J3.png"], bg: "#fff0f6", border: "2px solid #f7c2d8" },
  { name: "Victory Liberty Club", slug: "victory-liberty-club", color: "#7a273b", images: ["/images/products/Track Top/Victory Liberty Club/J2.png"], bg: "#f4dde4", border: "2px solid #e6b8c7" },
  { name: "Yorkville Black and White Cookies", slug: "yorkville-black-and-white-cookies", color: "#000000", images: ["/images/products/Track Top/YORKVILLE BLACK AND WHITE COOKIES/J5.png"], bg: "#f5f5f5", border: "2px solid #d4d4d4" },
];

const TRACKTOP_SWATCH_COLORS: Record<string, [string, string]> = {
  "elmhurst-taro-custard": ["#e7d9b0", "#7c6bc4"],
  "greenpoint-patina-crew": ["#f7c8d2", "#9c7a55"],
  "noho-napoletanos": ["#c8cbcd", "#1f294c"],
  "the-factory-floor": ["#1c1c1c", "#5f5a33"],
  "vice-city-runners": ["#f6c8d4", "#8ec4dd"],
  "victory-liberty-club": ["#0f4da8", "#7a273b"],
  "yorkville-black-and-white-cookies": ["#f3f3f3", "#1b1b1b"],
};

const PRODUCT = {
  name: "Retro Track Jacket",
  price: 110,
  description: "Inspired by classic New York athletic warm-ups, this track jacket features bold color blocking and a relaxed, vintage silhouette designed for movement and comfort. Each colorway pays homage to various motifs, with contrasting panels and an embroidered FRUITSTAND® logo across the chest.",
  details: [
    "100% Nylon shell",
    "Full-zip front with stand collar",
    "Inner mesh lining",
    "Ribbed cuffs and hem",
    "Two front pockets",
    "Relaxed fit",
    "Made in Sialkot, Pakistan",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

export default function TrackTopPage() {
  const colorOptions = COLOR_DATA;
  const [selectedColor, setSelectedColor] = useState<TrackTopColorOption>(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState(colorOptions[0].images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleSelectColor = useCallback((option: TrackTopColorOption, ctx?: { image?: string }) => {
    setSelectedColor(option);
    setSelectedImage(prev => ctx?.image ?? option.images?.[0] ?? prev);
    if (typeof window !== 'undefined' && option.slug) {
      const basePath = window.location.pathname.split('?')[0];
      window.history.replaceState(null, '', `${basePath}?color=${option.slug}`);
    }
  }, []);

  const handleImageChange = useCallback((image: string) => {
    setSelectedImage(image);
  }, []);
  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "91c47e89-efd4-4961-aadf-d4f7bf6e13b7",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  // Example: fetch or compute FBT products dynamically in the future
  const boughtTogetherItems = getFBTForPage('track-top');

  const sizeOptions: PurchaseSizeOption[] = useMemo(
    () => PRODUCT.sizes.map((size) => ({ value: size, label: size })),
    []
  );

  const purchaseColorOptions: PurchaseColorOption[] = useMemo(
    () => COLOR_DATA.map((option) => ({
      value: option.slug,
      label: option.name,
      swatch: option.color,
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
          <div className="relative mx-auto aspect-[4/5] w-full lg:mx-0 lg:max-w-[620px]">
            <img
              src={selectedImage}
              alt={`${selectedColor.name} ${PRODUCT.name}`}
              className="h-full w-full object-contain"
            />
          </div>

          {/* RIGHT COLUMN - Table-like Grid */}
          <div className="mt-8 flex flex-col items-stretch border border-[#1d1c19] bg-[#fbf5ed] lg:col-start-2 lg:mt-0">
            {/* TITLE & PRICE */}
            <div className="p-6 border-b border-[#1d1c19] text-center lg:text-left">
              <h1 className="text-[22px] font-black uppercase tracking-[0.08em] leading-tight text-[#1d1c19]">
                Retro Track Jacket - {selectedColor.name}
              </h1>

              <p className="mt-2 text-[26px] font-black text-[#1d1c19]">${PRODUCT.price}</p>
            </div>

            {/* SWATCHES & SIZE GUIDE */}
            <div className="p-6 border-b border-[#1d1c19] flex flex-col items-center lg:items-start">
              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {colorOptions.map((option) => {
                  const isActive = option.slug === selectedColor.slug;
                  const [primaryColor, secondaryColor] =
                    TRACKTOP_SWATCH_COLORS[option.slug] ?? [option.color, option.color];

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
                          backgroundColor: primaryColor,
                          backgroundImage: `linear-gradient(135deg, ${primaryColor} 50%, ${secondaryColor} 50%)`,
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.34em] text-[#1d1c19] border-b border-[#1d1c19] inline-block pb-0.5 cursor-pointer">
                <SizeGuide
                  productSlug="track-top"
                  imagePath="/images/size-guides/Size Guide/Track Jacket.png"
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
          const next = COLOR_DATA.find((option) => option.slug === value);
          if (next) {
            handleSelectColor(next);
          }
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

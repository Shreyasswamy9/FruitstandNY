"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import SizeGuide from "@/components/SizeGuide";
import { useCart } from "../../../components/CartContext";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { PurchaseColorOption, PurchaseSizeOption } from "@/components/ProductPurchaseBar";

const TRACKSUIT_IMAGE_MAP: Record<string, string[]> = {
  'elmhurst-taro-custard': [
    '/images/products/tracksuits/ELMHURST TARO CUSTARD/TP.png',
    '/images/products/tracksuits/ELMHURST TARO CUSTARD/TS7.png',
  ],
  'greenpoint-patina-crew': [
    '/images/products/tracksuits/Greenpoint Patina Crew/GB.png',
    '/images/products/tracksuits/Greenpoint Patina Crew/TS2.png',
  ],
  'noho-napoletanos': [
    '/images/products/tracksuits/NOHO NAPOLETANOS/TB.png',
    '/images/products/tracksuits/NOHO NAPOLETANOS/TS3.png',
  ],
  'the-factory-floor': [
    '/images/products/tracksuits/THE FACTORY FLOOR/BG.png',
    '/images/products/tracksuits/THE FACTORY FLOOR/TS4.png',
  ],
  'vice-city-runners': [
    '/images/products/tracksuits/VICE CITY RUNNERS/PB.png',
    '/images/products/tracksuits/VICE CITY RUNNERS/TS5.png',
  ],
  'victory-liberty-club': [
    '/images/products/tracksuits/Victory Liberty Club/RB.png',
    '/images/products/tracksuits/Victory Liberty Club/TS6.png',
  ],
  'yorkville-black-and-white-cookies': [
    '/images/products/tracksuits/YORKVILLE BLACK AND WHITE COOKIES/BW.png',
    '/images/products/tracksuits/YORKVILLE BLACK AND WHITE COOKIES/TS1.png',
  ],
};

const TRACKSUIT_VARIANTS = [
  { name: 'Elmhurst Taro Custard', slug: 'elmhurst-taro-custard', color: '#8271c2', images: TRACKSUIT_IMAGE_MAP['elmhurst-taro-custard'], bg: '#eee9ff', border: '2px solid #d1c8f3' },
  { name: 'Greenpoint Patina Crew', slug: 'greenpoint-patina-crew', color: '#58543a', images: TRACKSUIT_IMAGE_MAP['greenpoint-patina-crew'], bg: '#f1f0e6', border: '2px solid #d2cfba' },
  { name: 'Noho Napoletanos', slug: 'noho-napoletanos', color: '#ab8c65', images: TRACKSUIT_IMAGE_MAP['noho-napoletanos'], bg: '#f4ecdf', border: '2px solid #e1d2b8' },
  { name: 'The Factory Floor', slug: 'the-factory-floor', color: '#1e2744', images: TRACKSUIT_IMAGE_MAP['the-factory-floor'], bg: '#e6e9f4', border: '2px solid #c2c8da' },
  { name: 'Vice City Runners', slug: 'vice-city-runners', color: '#fddde9', images: TRACKSUIT_IMAGE_MAP['vice-city-runners'], bg: '#fff0f6', border: '2px solid #f7c2d8' },
  { name: 'Victory Liberty Club', slug: 'victory-liberty-club', color: '#7a273b', images: TRACKSUIT_IMAGE_MAP['victory-liberty-club'], bg: '#f4dde4', border: '2px solid #e6b8c7' },
  { name: 'Yorkville Black and White Cookies', slug: 'yorkville-black-and-white-cookies', color: '#000000', images: TRACKSUIT_IMAGE_MAP['yorkville-black-and-white-cookies'], bg: '#f5f5f5', border: '2px solid #d4d4d4' },
] as const;

type TracksuitVariant = typeof TRACKSUIT_VARIANTS[number];

const TRACKSUIT_SWATCH_COLORS: Record<string, [string, string]> = {
  "elmhurst-taro-custard": ["#e7d9b0", "#7c6bc4"],
  "greenpoint-patina-crew": ["#f7c8d2", "#9c7a55"],
  "noho-napoletanos": ["#c8cbcd", "#1f294c"],
  "the-factory-floor": ["#1c1c1c", "#5f5a33"],
  "vice-city-runners": ["#f6c8d4", "#8ec4dd"],
  "victory-liberty-club": ["#0f4da8", "#7a273b"],
  "yorkville-black-and-white-cookies": ["#f3f3f3", "#1b1b1b"],
};

const PRODUCT = {
  name: "Retro Track Suit",
  price: 110,
  description:
    "Inspired by classic New York athletic warm-ups, this track suit features bold color blocking and a relaxed, vintage silhouette designed for movement and comfort. Each colorway pays homage to various motifs, with contrasting panels and embroidered FRUITSTAND® logos.",
};

const PRODUCT_DETAILS = [
  "100% Nylon shell",
  "Full-zip front with stand collar",
  "Inner mesh lining",
  "Ribbed cuffs and hem",
  "Two front pockets",
  "Relaxed Fit",
  "Made in Sialkot, Pakistan",
];

const RECOMMENDED_PRODUCTS = [
  {
    name: "Retro Track Pant",
    price: "$90",
    image: "/images/products/Track Pants/YORKVILLE BLACK AND WHITE COOKIES/P5.png",
  },
  {
    name: "FS Cap",
    price: "$40",
    image: "/images/products/Porcelain Hat/FS2.png",
  },
  {
    name: "FS Cap",
    price: "$40",
    image: "/images/products/Ecru Hat/Beige Hat.png",
  },
  {
    name: "Retro Track Pant",
    price: "$90",
    image: "/images/products/Track Pants/Victory Liberty Club/P3.png",
  },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const DEFAULT_VARIANT = TRACKSUIT_VARIANTS.find((variant) => variant.slug === "victory-liberty-club") ?? TRACKSUIT_VARIANTS[0];

export default function TracksuitPage() {
  const colorOptions = TRACKSUIT_VARIANTS;
  const [selectedColor, setSelectedColor] = useState<TracksuitVariant>(DEFAULT_VARIANT);
  const [selectedImage, setSelectedImage] = useState(DEFAULT_VARIANT.images[0]);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSelectColor = useCallback((option: TracksuitVariant, ctx?: { image?: string }) => {
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

  // Show popup and keep it visible
  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "0f5810c1-abec-4e70-a077-33c839b4de2b",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  const sizeOptionsForBar: PurchaseSizeOption[] = useMemo(
    () => SIZE_OPTIONS.map((size) => ({ value: size, label: size })),
    []
  );

  const purchaseColorOptions: PurchaseColorOption[] = useMemo(
    () => TRACKSUIT_VARIANTS.map((option) => ({
      value: option.slug,
      label: option.name,
      swatch: option.color,
    })),
    []
  );
  return (
    <div>
      <ProductPageBrandHeader />

      <main className="bg-[#fbf5ed] pb-[210px] pt-16 md:pt-20 lg:pt-24">
        {/* HERO SECTION - Top 75% */}
        <div className="mx-auto w-full max-w-[1200px] px-6 text-center lg:px-12 lg:text-left lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-12" style={{ minHeight: '75vh' }}>
          {/* IMAGE */}
          <div className="relative mx-auto aspect-[4/5] w-full lg:mx-0 lg:max-w-[520px] lg:row-span-3">
            <Image
              src={selectedImage}
              alt={`${selectedColor.name} ${PRODUCT.name}`}
              fill
              sizes="(max-width: 768px) 92vw, 400px"
              className="object-contain"
              priority
            />
          </div>

          {/* TITLE / PRICE / COLORWAY - Single Line */}
          <div className="mt-8 flex flex-col items-center lg:col-start-2 lg:items-start lg:mt-6">
            <h1 className="text-[22px] font-black uppercase tracking-[0.08em] leading-tight text-[#1d1c19]">
              Retro Track Suit - {selectedColor.name}
            </h1>

            <p className="mt-2 text-[26px] font-black text-[#1d1c19]">${PRODUCT.price}</p>

            {/* SWATCHES */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:col-start-2 lg:justify-start">
              {colorOptions.map((option) => {
                const isActive = option.slug === selectedColor.slug;
                const [primaryColor, secondaryColor] =
                  TRACKSUIT_SWATCH_COLORS[option.slug] ?? [option.color, option.color];

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

            {/* SIZE GUIDE */}
            <div className="mt-4 text-[12px] font-semibold uppercase tracking-[0.34em] text-[#1d1c19] lg:col-start-2 lg:text-left">
              <SizeGuide
                productSlug="tracksuit"
                imagePath="/images/size-guides/Size Guide/Track Jacket.png"
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
              {PRODUCT_DETAILS.map((detail) => (
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
              {RECOMMENDED_PRODUCTS.map((product) => (
                <div key={`${product.name}-${product.image}`} className="flex flex-col">
                  <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#1d1c19] bg-white">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="200px" />
                  </div>
                  <p className="mt-4 text-[11px] font-black uppercase tracking-[0.34em] text-[#1d1c19]">
                    {product.name}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#1d1c19]">
                    {product.price}
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
        sizeOptions={sizeOptionsForBar}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        colorOptions={purchaseColorOptions}
        selectedColor={selectedColor.slug}
        onSelectColor={(value) => {
          const next = TRACKSUIT_VARIANTS.find((option) => option.slug === value);
          if (next) {
            handleSelectColor(next);
          }
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

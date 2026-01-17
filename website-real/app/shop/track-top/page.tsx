"use client";
import FrequentlyBoughtTogether, { FBTProduct, getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import SizeGuide from "@/components/SizeGuide";
import CustomerReviews from "@/components/CustomerReviews";
import Price from '@/components/Price';
import React, { useState, useCallback, useMemo } from "react";
import { useCart } from "../../../components/CartContext";
import ColorPicker from '@/components/ColorPicker';
import ProductImageGallery from "@/components/ProductImageGallery";
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
      productId: `track-top-${selectedColor.slug}`,
      name: `${PRODUCT.name} - ${selectedColor.name}`,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  // Example: fetch or compute FBT products dynamically in the future
  const boughtTogetherItems: FBTProduct[] = getFBTForPage('track-top');

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
      <div
        className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4"
        style={{ paddingTop: 96, paddingBottom: "calc(var(--purchase-bar-height, 280px) + 24px)" }}
      >
        <ProductImageGallery
          productName={PRODUCT.name}
          options={colorOptions}
          selectedOption={selectedColor}
          selectedImage={selectedImage}
          onOptionChange={(option, ctx) => handleSelectColor(option as TrackTopColorOption, ctx)}
          onImageChange={handleImageChange}
          className="md:w-1/2"
          frameBackground={selectedColor.bg}
          frameBorderStyle={selectedColor.border}
        />
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name} <span className="text-base font-medium text-gray-500">/ {selectedColor.name}</span></h1>
          {/* Color Picker */}
          <ColorPicker
            options={colorOptions as any}
            selectedName={selectedColor.name}
            onSelect={(opt) => {
              handleSelectColor(opt as TrackTopColorOption);
            }}
          />
          <div className="mb-4 space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">{PRODUCT.description}</p>
            {PRODUCT.details && (
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Details</span>
                <ul className="mt-2 list-disc list-inside text-gray-700 text-sm sm:text-base space-y-1">
                  {PRODUCT.details.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="text-2xl font-semibold mb-6"><Price price={PRODUCT.price} /></div>
        </div>
      </div>

      {/* Section 2: Frequently Bought Together */}
      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={(product) => {
          const fallbackSize = selectedSize ?? PRODUCT.sizes[0];
          addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            size: fallbackSize,
          });
        }}
        onAddAllToCart={(products) => {
          const fallbackSize = selectedSize ?? PRODUCT.sizes[0];
          products.forEach(product => {
            addToCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
              size: fallbackSize,
            });
          });
        }}
      />
      {/* Section 3: Customer Reviews */}
      <div
        style={{
          scrollSnapAlign: 'start',
          display: 'flex',
          alignItems: 'center',
          background: '#fbf6f0'
        }}
        className="py-12 px-4"
      >
        <div className="max-w-4xl mx-auto w-full">
          <CustomerReviews productId="track-top" />
        </div>
      </div>

      <ProductPurchaseBar
        price={PRODUCT.price}
        summaryLabel={selectedColor.name}
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
        sizeGuideTrigger={<SizeGuide productSlug="track-top" imagePath="/images/size-guides/Size Guide/Track Jacket.png" />}
      />
    </div>
  );
}

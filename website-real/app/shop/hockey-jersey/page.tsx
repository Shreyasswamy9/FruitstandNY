"use client";

export const dynamic = 'force-dynamic'
import React, { useState, useEffect, useCallback, useMemo } from "react";
import SizeGuide from "@/components/SizeGuide";
import Price from '@/components/Price';
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { useCart } from "@/components/CartContext";
import ProductImageGallery from "@/components/ProductImageGallery";
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

  const handleImageChange = useCallback((image: string) => {
    setSelectedImage(image);
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
      productId: "hockey-jersey",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  // Handle adding items from "Frequently Bought Together" section
  const handleAddBoughtTogetherItem = (item: { id: string; name: string; price: number; image: string }) => {
    const fallbackSize = selectedSize ?? "M";
    addToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      size: fallbackSize,
    });
  };

  // Handle adding all items from "Frequently Bought Together" section
  const handleAddAllToCart = () => {
    const fallbackSize = selectedSize ?? "M";
    boughtTogetherItems.forEach(item => {
      addToCart({
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        size: fallbackSize,
      });
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
      {/* Section 1: Product Details */}
      <div
        className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4"
        style={{
          paddingTop: 96,
          paddingBottom: "calc(var(--purchase-bar-height, 280px) + 24px)"
        }}
      >
        {/* Images */}
        <ProductImageGallery
          productName={PRODUCT.name}
          options={colorOptions}
          selectedOption={selectedColor}
          selectedImage={selectedImage}
          onOptionChange={(option, ctx) => handleSelectColor(option as HockeyJerseyVariant, ctx)}
          onImageChange={handleImageChange}
          className="md:w-1/2"
          frameBackground={selectedColor.bg}
          frameBorderStyle={selectedColor.border}
        />
        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          <div className="mb-4 space-y-4">
            <p className="text-sm font-medium text-gray-600">Pick your size using the floating bar below.</p>
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
          <div className="mb-4">
            <SizeGuide productSlug="hockey-jersey" imagePath="/images/size-guides/Size Guide/Hockey Jersey Table.png" />
          </div>
          <div className="text-2xl font-semibold mb-6"><Price price={PRODUCT.price} /></div>
        </div>
      </div>

      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={handleAddBoughtTogetherItem}
        onAddAllToCart={handleAddAllToCart}
      />

      {/* Section 3: Customer Reviews */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fbf6f0'
        }}
        className="py-12 px-4"
      >
        <div className="max-w-4xl mx-auto w-full">
          <CustomerReviews productId="hockey-jersey" />
        </div>
      </div>

      <ProductPurchaseBar
        price={PRODUCT.price}
        summaryLabel={selectedColor.name}
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

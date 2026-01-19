"use client";
import React, { useCallback, useMemo, useState } from "react";
import SizeGuide from "@/components/SizeGuide";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { useCart } from "../../../components/CartContext";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { type PurchaseSizeOption } from "@/components/ProductPurchaseBar";

const MANDARIN_IMAGES = [
  "/images/products/Mandarin Tee/Mandarin Tee.png",
  "/images/products/Mandarin Tee/Mandarin 2.png",
  "/images/products/Mandarin Tee/Mandarin 3.png",
  "/images/products/Mandarin Tee/Mandarin 4.png",
];

const PRODUCT = {
  name: "Mandarin 橘子 [JUZI] Tee",
  price: 68,
  description:
    "Cut from heavyweight 300 GSM cotton, the Mandarin Tee brings structure to a relaxed, cropped silhouette. Minimal seams keep the oversized fruit graphic uninterrupted front and back.",
  details: [
    "100% premium heavyweight cotton (300 GSM)",
    "Two-panel construction for a seamless print",
    "Cropped, boxy silhouette",
    '32" screen-printed artwork front and back',
    "Made in Dongguan, Guangdong, China",
    "Ships with a custom FRUITSTAND sticker printed in NYC",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

const OUT_OF_STOCK_SIZES = ["XS", "S", "XXXL"] as const;

export default function MandarinTeePage() {
  const galleryOption = useMemo(
    () => ({ name: PRODUCT.name, slug: "default", images: MANDARIN_IMAGES }),
    []
  );
  const [selectedImage, setSelectedImage] = useState(MANDARIN_IMAGES[0]);
  const sizeOptions = useMemo<PurchaseSizeOption[]>(
    () =>
      PRODUCT.sizes.map((size) => ({
        value: size,
        label: size,
        soldOut: OUT_OF_STOCK_SIZES.includes(size as (typeof OUT_OF_STOCK_SIZES)[number]),
      })),
    []
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    const firstAvailable = sizeOptions.find((option) => !option.soldOut)?.value;
    return firstAvailable ?? null;
  });
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) return;
    addToCart({
      productId: "f47a07e4-6470-49b2-ace6-a60e70ee3737",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
  }, [addToCart, selectedImage, selectedSize]);

  const boughtTogetherItems = getFBTForPage("mandarin-tee");

  const fallbackSize = useMemo(
    () => selectedSize ?? sizeOptions.find((option) => !option.soldOut)?.value ?? "M",
    [selectedSize, sizeOptions]
  );

  const handleAddBoughtTogetherItem = useCallback(
    (item: { id: string; name: string; price: number; image: string }) => {
      addToCart({
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        size: fallbackSize,
      });
    },
    [addToCart, fallbackSize]
  );

  const handleAddAllToCart = useCallback(() => {
    boughtTogetherItems.forEach((item) => {
      addToCart({
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        size: fallbackSize,
      });
    });
  }, [addToCart, boughtTogetherItems, fallbackSize]);

  const selectedSizeSoldOut = selectedSize
    ? sizeOptions.find((option) => option.value === selectedSize)?.soldOut
    : false;

  return (
    <div>
      <ProductPageBrandHeader />

      <div
        className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4"
        style={{ paddingTop: 96, paddingBottom: 64 }}
      >
        <ProductImageGallery
          productName={PRODUCT.name}
          options={[galleryOption]}
          selectedOption={galleryOption}
          selectedImage={selectedImage}
          onImageChange={setSelectedImage}
          className="md:w-1/2"
          frameBackground="#ffffff"
        />

        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-3">{PRODUCT.name}</h1>
          <p className="text-sm font-medium text-orange-600 flex items-center gap-2 mb-4">
            <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            Few units remaining in core sizes
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">{PRODUCT.description}</p>
          {PRODUCT.details?.length ? (
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Details</span>
              <ul className="mt-2 list-disc list-inside text-gray-700 text-sm sm:text-base space-y-1">
                {PRODUCT.details.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="text-2xl font-semibold mt-6">${PRODUCT.price.toFixed(2)}</div>
        </div>
      </div>

      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={handleAddBoughtTogetherItem}
        onAddAllToCart={handleAddAllToCart}
      />

      <ProductPurchaseBar
        price={PRODUCT.price}
        summaryLabel="Mandarin 橘子"
        sizeOptions={sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onAddToCart={handleAddToCart}
        addDisabled={!selectedSize || Boolean(selectedSizeSoldOut)}
        addDisabledReason={selectedSizeSoldOut ? "Sold out" : undefined}
        sizeGuideTrigger={
          <SizeGuide
            productSlug="mandarin-tee"
            imagePath="/images/size-guides/Size Guide/Mandarin Tee Table.png"
          />
        }
      />
    </div>
  );
}

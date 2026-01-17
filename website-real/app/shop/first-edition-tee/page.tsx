"use client";
import React, { useState, useCallback, useMemo } from "react";
import SizeGuide from "@/components/SizeGuide";
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { useCart } from "../../../components/CartContext";
import ColorPicker, { type ColorOption } from '@/components/ColorPicker';
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { PurchaseColorOption, PurchaseSizeOption } from "@/components/ProductPurchaseBar";

const feImages = [
  "/images/products/First Edition Tee/FE1.png",
  "/images/products/First Edition Tee/FE2.png",
  "/images/products/First Edition Tee/FE3.png",
  "/images/products/First Edition Tee/FE4.png",
  "/images/products/First Edition Tee/FE5.png",
  "/images/products/First Edition Tee/FE6.png",
];

type FirstEditionColorOption = ColorOption & {
  images: string[];
};

const PRODUCT = {
  name: "FIRST EDITION T",
  price: 45,
  description: "100% Heavyweight cotton. Custom cut and sewn fit. Designed in NYC and crafted in Portugal. We spent over a year and a half researching, traveling and touring to source the best materials and people to work with. We had the mission to make the perfect T-shirt worthy to carry the FRUITSTAND brand; we succeeded.",
  details: [
    "100% Heavyweight Cotton, custom cut and sewn fit",
    "Designed in NYC — crafted in Portugal",
    "Trademark BLOCK LOGO at the chest with ‘ORGANIC NEW YORK CULTURE’ near the waist",
    "Comes with custom NYC-made hang tags and a sustainable burlap bag",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

export default function FirstEditionTeePage() {
  const colorOptions = React.useMemo<FirstEditionColorOption[]>(() => [
    { name: 'White', slug: 'white', images: feImages, color: '#ffffff', border: '#e5e7eb' },
    { name: 'Black', slug: 'black', images: feImages, color: '#000000' },
  ], []);
  const [selectedColor, setSelectedColor] = useState<FirstEditionColorOption>(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState<string>(colorOptions[0].images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleSelectColor = useCallback((option: FirstEditionColorOption, ctx?: { image?: string }) => {
    setSelectedColor(option);
    setSelectedImage(prev => ctx?.image ?? option.images?.[0] ?? prev);
  }, []);

  const handleImageChange = useCallback((image: string) => {
    setSelectedImage(image);
  }, []);
  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "first-edition-tee",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  const boughtTogetherItems = getFBTForPage('first-edition-tee');

  const sizeOptions: PurchaseSizeOption[] = useMemo(
    () => PRODUCT.sizes.map((size) => ({ value: size, label: size })),
    []
  );

  const purchaseColorOptions: PurchaseColorOption[] = useMemo(
    () => colorOptions.map((option) => ({ value: option.slug ?? option.name, label: option.name, swatch: option.color })),
    [colorOptions]
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
          onOptionChange={(option, ctx) => handleSelectColor(option as FirstEditionColorOption, ctx)}
          onImageChange={handleImageChange}
          className="md:w-1/2"
        />
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          <div className="text-2xl font-semibold mb-6">${PRODUCT.price}</div>
          {/* Color Picker */}
          <ColorPicker
            options={colorOptions}
            selectedName={selectedColor.name}
            onSelect={(opt) => {
              const match = colorOptions.find(c => c.name === opt.name) ?? colorOptions[0];
              handleSelectColor(match);
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

        </div>
      </div>

      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={(item) => {
          const fallbackSize = selectedSize ?? PRODUCT.sizes[2];
          addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: fallbackSize });
        }}
        onAddAllToCart={() => {
          const fallbackSize = selectedSize ?? PRODUCT.sizes[2];
          boughtTogetherItems.forEach((item) => addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: fallbackSize }));
        }}
      />

      {/* Reviews */}
      <div style={{ display: 'flex', alignItems: 'center', background: '#fbf6f0' }} className="py-12 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <CustomerReviews productId="first-edition-tee" />
        </div>
      </div>

      <ProductPurchaseBar
        price={PRODUCT.price}
        summaryLabel={selectedColor.name}
        sizeOptions={sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        colorOptions={purchaseColorOptions}
        selectedColor={selectedColor.slug ?? selectedColor.name}
        onSelectColor={(value) => {
          const next = colorOptions.find((option) => (option.slug ?? option.name) === value);
          if (next) {
            handleSelectColor(next);
          }
        }}
        onAddToCart={handleAddToCart}
        sizeGuideTrigger={<SizeGuide productSlug="first-edition-tee" imagePath="/images/size-guides/Size Guide/First Edition Tee Table.png" />}
      />
    </div>
  );
}
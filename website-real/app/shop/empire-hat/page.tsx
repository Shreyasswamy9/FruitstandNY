"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useCart } from "../../../components/CartContext";
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { type PurchaseSizeOption } from "@/components/ProductPurchaseBar";

const EMPIRE_HAT_IMAGES = [
  "/images/products/empire-hat/Apple Hat.png",
  "/images/products/empire-hat/A1.png",
  "/images/products/empire-hat/A2.png",
  "/images/products/empire-hat/A3.png",
  "/images/products/empire-hat/A4.png",
  "/images/products/empire-hat/A5.png",
];

const PRODUCT = {
  name: "Empire Corduroy Hat",
  price: 49,
  description: "Premium corduroy finished with apple red embroidery front, back, and brim.",
  details: [
    "Deep red corduroy 6-panel camp hat",
    "Embroidered hits across the crown and brim",
    "Flexible brim with contrast under-bill",
    "Adjustable strap, one size fits most",
    "Made in Fujian, China",
  ],
};

export default function EmpireHatPage() {
  const galleryOption = useMemo(
    () => ({ name: PRODUCT.name, slug: "default", images: EMPIRE_HAT_IMAGES }),
    []
  );
  const [selectedImage, setSelectedImage] = useState(EMPIRE_HAT_IMAGES[0]);
  const sizeOptions = useMemo<PurchaseSizeOption[]>(
    () => [{ value: "ONE_SIZE", label: "One Size" }],
    []
  );
  const [selectedSize, setSelectedSize] = useState<string>(() => sizeOptions[0]?.value ?? "");
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) return;
    addToCart({
      productId: "98da26f5-be40-4f35-a8ad-b26dd9ae01f9",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
  }, [addToCart, selectedImage, selectedSize]);

  const boughtTogetherItems = getFBTForPage("empire-hat");

  const handleAddBoughtTogetherItem = useCallback(
    (item: { id: string; name: string; price: number; image: string }) => {
      addToCart({
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        size: "M",
      });
    },
    [addToCart]
  );

  const handleAddAllToCart = useCallback(() => {
    boughtTogetherItems.forEach((item) => {
      addToCart({
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        size: "M",
      });
    });
  }, [addToCart, boughtTogetherItems]);

  return (
    <div>
      <ProductPageBrandHeader />

      <div
        className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4"
        style={{ paddingTop: 96, paddingBottom: "calc(var(--purchase-bar-height, 280px) + 24px)" }}
      >
        <ProductImageGallery
          productName={PRODUCT.name}
          options={[galleryOption]}
          selectedOption={galleryOption}
          selectedImage={selectedImage}
          onImageChange={setSelectedImage }
          className="md:w-1/2"
          frameBackground="#ffffff"
        />

        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-3">{PRODUCT.name}</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">{PRODUCT.description}</p>
          {PRODUCT.details?.length ? (
            <div className="mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Details</span>
              <ul className="mt-2 list-disc list-inside text-gray-700 text-sm sm:text-base space-y-1">
                {PRODUCT.details.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="text-2xl font-semibold">${PRODUCT.price.toFixed(2)}</div>
        </div>
      </div>

      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={handleAddBoughtTogetherItem}
        onAddAllToCart={handleAddAllToCart}
      />

      <div style={{ display: "flex", alignItems: "center", background: "#fbf6f0" }} className="py-12 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <CustomerReviews productId="98da26f5-be40-4f35-a8ad-b26dd9ae01f9" />
        </div>
      </div>

      <ProductPurchaseBar
        price={PRODUCT.price}
        summaryLabel="Corduroy apple"
        sizeOptions={sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useCart } from "../../../components/CartContext";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { type PurchaseSizeOption } from "@/components/ProductPurchaseBar";

const FOREST_HILLS_IMAGES = [
  "/images/products/Forest Hills Hat/Green Hat.png",
  "/images/products/Forest Hills Hat/G1.png",
  "/images/products/Forest Hills Hat/G2.png",
  "/images/products/Forest Hills Hat/G3.png",
  "/images/products/Forest Hills Hat/G4.png",
];

const PRODUCT = {
  name: "Forest Hills Hat",
  price: 46,
  description: "Lime green cotton twill with tonal Fruitstand embroidery front and back.",
  details: [
    "6-panel camp silhouette",
    "Lime green crown with matching under-brim",
    "Detailed embroidery on front and back",
    "Adjustable strap, one size fits most",
    "Made in Fujian, China",
  ],
};

export default function ForestHillsHatPage() {
  const galleryOption = useMemo(
    () => ({ name: PRODUCT.name, slug: "default", images: FOREST_HILLS_IMAGES }),
    []
  );
  const [selectedImage, setSelectedImage] = useState(FOREST_HILLS_IMAGES[0]);
  const sizeOptions = useMemo<PurchaseSizeOption[]>(
    () => [{ value: "ONE_SIZE", label: "One Size" }],
    []
  );
  const [selectedSize, setSelectedSize] = useState<string>(() => sizeOptions[0]?.value ?? "");
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) return;
    addToCart({
      productId: "8d1d5080-2106-420d-b7ea-babc2fba5457",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
  }, [addToCart, selectedImage, selectedSize]);

  const boughtTogetherItems = getFBTForPage("forest-hills-hat");

  const handleAddBoughtTogetherItem = useCallback(
    (product: { id: string; name: string; price: number; image: string }) => {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: "M",
      });
    },
    [addToCart]
  );

  const handleAddAllToCart = useCallback(() => {
    boughtTogetherItems.forEach((product) => {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
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

      <ProductPurchaseBar
        price={PRODUCT.price}
        summaryLabel="Forest green"
        sizeOptions={sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useCart } from "../../../components/CartContext";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import ProductPurchaseBar, { type PurchaseSizeOption } from "@/components/ProductPurchaseBar";

const PORCELAIN_HAT_IMAGES = [
  "/images/products/Porcelain Hat/Fruitscale Hat.png",
  "/images/products/Porcelain Hat/FS2.png",
];

const PRODUCT = {
  name: "Porcelain FS Cap",
  price: 44,
  description: "Crisp porcelain white cap finished with tonal Fruitstand embroidery.",
  details: [
    "Structured 6-panel silhouette",
    "Adjustable strap with brushed metal closure",
    "Embroidered front and back hits",
    "One size fits most",
  ],
};

export default function PorcelainHatPage() {
  const galleryOption = useMemo(
    () => ({ name: PRODUCT.name, slug: "default", images: PORCELAIN_HAT_IMAGES }),
    []
  );
  const [selectedImage, setSelectedImage] = useState(PORCELAIN_HAT_IMAGES[0]);
  const sizeOptions = useMemo<PurchaseSizeOption[]>(
    () => [{ value: "ONE_SIZE", label: "One Size" }],
    []
  );
  const [selectedSize, setSelectedSize] = useState<string>(() => sizeOptions[0]?.value ?? "");
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) return;
    addToCart({
      productId: "bca735d7-f575-4ef3-9ff7-28966205618b",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
  }, [addToCart, selectedImage, selectedSize]);

  const boughtTogetherItems = getFBTForPage("porcelain-hat");

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
        sizeOptions={sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onAddToCart={handleAddToCart}
        summaryLabel="Adjustable fit"
      />
    </div>
  );
}

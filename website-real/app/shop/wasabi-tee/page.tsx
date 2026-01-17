"use client";
import React, { useMemo, useState } from "react";
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import { useCart } from "../../../components/CartContext";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductPurchaseBar, { PurchaseSizeOption } from "@/components/ProductPurchaseBar";
import SizeGuide from "@/components/SizeGuide";

const wasabiImages = [
  "/images/products/Wasabi Tee/Wabasabi 1.png",
  "/images/products/Wasabi Tee/Wabasabi 2.png",
  "/images/products/Wasabi Tee/Wabsabi 3.png",
  "/images/products/Wasabi Tee/Wabsabi 4.png",
];

const PRODUCT = {
  name: "Wabisabi™ Scheffel Hall Pears Tee",
  price: 45,
  description: "100% Heavyweight Cotton. Custom cut and sewn fit. Designed in NYC and crafted in Portugal.\n\n***\n\nWe spent over a year and a half working researching, traveling and touring to source the best materials and people to work with. With this and future WABISABI designs, we look to feature motifs that study the effects of the passage of time in our City, culture and history.\n\nBuilt in 1895, Scheffel Hall remains an important part of the cultural and architectural history of the City. More can be read about here: http://s-media.nyc.gov/agencies/lpc/lp/1959.pdf\n\nThe WABISABI SCHEFFEL HALL PEARS T features an image we took of Scheffel Hall in December 2021, inside of our golden pear design.\n\nComes with uniquely made and universally loved hang tags. All of the hang tags were 100% made in NYC.\n\nYour purchase will arrive in a one of a kind, locally sourced sustainable burlap bag that features a custom Americana design.",
  details: [
    "100% Heavyweight Cotton",
    "Custom cut and sewn fit",
    "Designed in NYC and crafted in Portugal",
    "Includes NYC-made hang tags and sustainable burlap bag",
    "Image of Scheffel Hall (photo taken Dec 2021) inside our golden pear motif",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

export default function WasabiTeePage() {
  const [selectedImage, setSelectedImage] = useState(wasabiImages[0]);
  const galleryOption = useMemo(() => ({ name: PRODUCT.name, slug: "default", images: wasabiImages }), []);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "51977ef7-ae8f-486f-9dd7-7620e3b6e70a",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
  };

  const boughtTogetherItems = getFBTForPage('wasabi-tee');

  const sizeOptions: PurchaseSizeOption[] = PRODUCT.sizes.map((size) => ({
    value: size,
    label: size,
  }));

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
          onImageChange={setSelectedImage}
          className="md:w-1/2"
          frameBackground="#ffffff"
        />
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          <div className="text-2xl font-semibold mb-6">${PRODUCT.price.toFixed(2)}</div>
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
          const defaultSize = selectedSize ?? PRODUCT.sizes[2];
          addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: defaultSize });
        }}
        onAddAllToCart={() => {
          const defaultSize = selectedSize ?? PRODUCT.sizes[2];
          boughtTogetherItems.forEach((item) => addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: defaultSize }));
        }}
      />

      {/* Reviews */}
      <div style={{ display: 'flex', alignItems: 'center', background: '#fbf6f0' }} className="py-12 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <CustomerReviews productId="51977ef7-ae8f-486f-9dd7-7620e3b6e70a" />
        </div>
      </div>

      <ProductPurchaseBar
        price={PRODUCT.price}
        summaryLabel="Fruitstand"
        sizeOptions={sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onAddToCart={handleAddToCart}
        sizeGuideTrigger={<SizeGuide productSlug="wasabi-tee" imagePath="/images/size-guides/Size Guide/Wabasabi Tee Table.png" />}
      />

    </div>
  );
}

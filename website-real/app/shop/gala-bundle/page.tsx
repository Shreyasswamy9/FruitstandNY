"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { useCart } from "@/components/CartContext";
import { TEE_VARIANTS, SIZE_OPTIONS, type TeeVariant, type TeeColor, type SizeOption } from "@/lib/teeVariants";
import { SHIRT_BUNDLE_PRICING, type BundleQty } from "@/lib/shirtBundles";
import { useTrackProductView } from "@/hooks/useTrackProductView";

const PRODUCT = {
  name: "Gala Tee Bundle",
  description: "Mix and match your favorite Gala Tees. Select colors and sizes.",
  details: [
    "All Gala Tees in this bundle",
    "Select color + size for each tee",
    "Bundle pricing applied automatically",
    "Ships together as one curated set",
    "Quality guaranteed, Free returns."
  ],
};

type BundleItem = {
  color: TeeColor;
  size: SizeOption | null;
};

export default function GalaBundlePage() {
  const { addToCart } = useCart();

  const galaTee = TEE_VARIANTS.find(t => t.slug === 'gala-tshirt')!;
  
  const [bundleSize, setBundleSize] = useState<BundleQty>(1);
  const [items, setItems] = useState<BundleItem[]>([
    { color: galaTee.colors[0], size: null },
  ]);

  // Modal state
  const [editingTeeIndex, setEditingTeeIndex] = useState<number | null>(null);
  const [tempColor, setTempColor] = useState<TeeColor | null>(null);
  const [tempSize, setTempSize] = useState<SizeOption | null>(null);

  useTrackProductView({
    productId: "8601b9a3-67c3-4820-8f74-2b975b1a95cf",
    productName: PRODUCT.name,
    price: SHIRT_BUNDLE_PRICING.gala[bundleSize],
    currency: "USD",
  });

  const handleBundleSizeChange = useCallback((newSize: BundleQty) => {
    setBundleSize(newSize);
    setItems((prev) => {
      const next = [...prev];
      while (next.length < newSize) {
        next.push({ color: galaTee.colors[0], size: null });
      }
      return next.slice(0, newSize);
    });
    setEditingTeeIndex(null);
  }, [galaTee.colors]);

  const openEditModal = useCallback((index: number) => {
    setEditingTeeIndex(index);
    setTempColor(items[index].color);
    setTempSize(items[index].size);
  }, [items]);

  const saveEdit = useCallback(() => {
    if (editingTeeIndex === null || !tempColor || !tempSize) return;
    setItems((prev) => {
      const next = [...prev];
      next[editingTeeIndex] = { color: tempColor, size: tempSize };
      return next;
    });
    setEditingTeeIndex(null);
  }, [editingTeeIndex, tempColor, tempSize]);

  const closeModal = useCallback(() => {
    setEditingTeeIndex(null);
  }, []);

  const filledCount = items.filter((item) => item.size).length;
  const allFilled = filledCount === bundleSize;

  const addBundleToCart = useCallback(() => {
    if (!allFilled) return;
    const price = SHIRT_BUNDLE_PRICING.gala[bundleSize];
    const summary = items
      .slice(0, bundleSize)
      .map((item, i) => `#${i + 1} ${item.color.name} • ${item.size}`)
      .join(" | ");
    addToCart({
      productId: "8601b9a3-67c3-4820-8f74-2b975b1a95cf",
      name: `Gala Tee Bundle (${bundleSize}) – ${summary}`,
      price,
      image: galaTee.colors[0].image,
      quantity: 1,
    });
  }, [addToCart, bundleSize, allFilled, items, galaTee.colors]);

  const boughtTogetherItems = useMemo(() => getFBTForPage("gala-bundle"), []);

  const savingsInfo = useMemo(() => {
    if (bundleSize === 1) return null;
    const singlePrice = SHIRT_BUNDLE_PRICING.gala[1] * bundleSize;
    const bundlePrice = SHIRT_BUNDLE_PRICING.gala[bundleSize];
    const savings = singlePrice - bundlePrice;
    const savingsPercent = Math.round((savings / singlePrice) * 100);
    return { savings, savingsPercent };
  }, [bundleSize]);

  return (
    <div>
      <ProductPageBrandHeader />

      <main className="bg-[#fbf5ed] pb-24 pt-16 md:pt-20 lg:pt-24">
        <div className="mx-auto w-full max-w-4xl px-4">
          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.08em] font-avenir-black text-[#1d1c19]">
              {PRODUCT.name}
            </h1>
            <p className="mt-2 text-sm md:text-base text-[#1d1c19]/80">
              {PRODUCT.description}
            </p>
          </div>

          {/* QUANTITY & PRICE SECTION */}
          <div className="mb-8 bg-white rounded-lg border-2 border-black/10 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#1d1c19]/60 mb-4 block">
              How many tees?
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {([1, 2, 3, 4, 5, 6] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => handleBundleSizeChange(size)}
                  className={`px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all ${
                    bundleSize === size
                      ? "bg-black text-white border-black"
                      : "border-black/20 text-[#1d1c19] hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-[#1d1c19]">
                ${SHIRT_BUNDLE_PRICING.gala[bundleSize]}
              </p>
              {savingsInfo && (
                <p className="text-sm text-green-700 font-semibold">
                  Save {savingsInfo.savingsPercent}% (${savingsInfo.savings.toFixed(2)})
                </p>
              )}
            </div>
          </div>

          {/* TEE CARDS GRID */}
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#1d1c19]/60 mb-4">
              Your Tees ({filledCount}/{bundleSize} configured)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => openEditModal(index)}
                  className="group"
                >
                  <div className="aspect-4/5 rounded-lg border-2 border-black/20 group-hover:border-black transition-all bg-white overflow-hidden mb-2 cursor-pointer">
                    {/* Color Swatch */}
                    <div className="h-1/3 w-full" style={{ backgroundColor: item.color.hex }} />
                    {/* Content */}
                    <div className="h-2/3 p-3 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#1d1c19] line-clamp-2 text-left">
                          {item.color.name}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs font-semibold text-left ${
                          item.size ? "text-[#1d1c19]" : "text-orange-600"
                        }`}>
                          {item.size ? `Sz ${item.size}` : "Select size"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-[#1d1c19] text-center">
                    Tee #{index + 1}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* BOTTOM SHEET MODAL */}
          <AnimatePresence>
            {editingTeeIndex !== null && tempColor && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeModal}
                  className="fixed inset-0 bg-black/40 z-40"
                />
                {/* Modal */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 400 }}
                  className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl border-t-2 border-black/10 max-h-[90vh] overflow-y-auto"
                >
                  <div className="px-6 py-6 max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#1d1c19]/60">
                        Tee #{editingTeeIndex + 1}
                      </p>
                      <h3 className="text-xl font-avenir-black text-[#1d1c19] mt-1">
                        Configure Tee
                      </h3>
                    </div>

                    {/* Color Preview */}
                    <div className="mb-8">
                      <div className="flex gap-4 items-center">
                        <div
                          className="w-16 h-16 rounded-lg border-2 border-black/20"
                          style={{ backgroundColor: tempColor.hex }}
                        />
                        <div>
                          <p className="text-xs uppercase tracking-[0.1em] text-[#1d1c19]/60">
                            Selected Color
                          </p>
                          <p className="text-lg font-bold text-[#1d1c19]">
                            {tempColor.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* COLOR SELECTOR */}
                    <div className="mb-8">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#1d1c19]/60 mb-4">
                        Choose Color
                      </p>
                      <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                        {galaTee.colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setTempColor(color)}
                            className={`aspect-square rounded-lg border-3 transition-all ${
                              color.name === tempColor.name
                                ? "border-black"
                                : "border-black/20 hover:border-black/40"
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* SIZE SELECTOR */}
                    <div className="mb-8">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#1d1c19]/60 mb-4">
                        Choose Size
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {SIZE_OPTIONS.map((size) => (
                          <button
                            key={size}
                            onClick={() => setTempSize(size)}
                            className={`py-4 px-3 rounded-lg border-2 font-bold text-sm transition-all ${
                              size === tempSize
                                ? "bg-black text-white border-black"
                                : "border-black/20 text-[#1d1c19] hover:border-black"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 py-4 px-4 rounded-lg border-2 border-black/20 text-[#1d1c19] font-bold text-sm hover:border-black transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        disabled={!tempSize}
                        className={`flex-1 py-4 px-4 rounded-lg border-2 font-bold text-sm transition-all ${
                          !tempSize
                            ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-black text-white border-black hover:bg-[#2a2a2a]"
                        }`}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* STICKY ADD TO CART BUTTON */}
          {allFilled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black/10 p-4 z-30"
            >
              <div className="max-w-4xl mx-auto">
                <button
                  onClick={addBundleToCart}
                  className="w-full bg-black text-white py-4 rounded-lg font-bold uppercase text-sm tracking-[0.1em] hover:bg-[#2a2a2a] transition-all"
                >
                  Add to Cart • ${SHIRT_BUNDLE_PRICING.gala[bundleSize]}
                </button>
              </div>
            </motion.div>
          )}

          {/* DESCRIPTION */}
          <section className="mt-16">
            <h2 className="text-lg md:text-xl uppercase tracking-[0.12em] font-avenir-black text-[#1d1c19] mb-4">
              About This Bundle
            </h2>
            <ul className="text-sm md:text-base text-[#1d1c19]/80 space-y-2">
              {PRODUCT.details.map((detail, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* YOU MAY ALSO LIKE */}
          {boughtTogetherItems && boughtTogetherItems.length > 0 && (
            <section className="mt-16">
              <h2 className="text-lg md:text-xl uppercase tracking-[0.12em] font-avenir-black text-[#1d1c19] mb-6">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {boughtTogetherItems.map((item) => (
                  <a key={item.id} href={`/shop/${item.id}`} className="group">
                    <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg bg-white border-2 border-black/10 group-hover:border-black transition-all">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#1d1c19] mt-2 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-base font-bold text-[#1d1c19]">
                      ${item.price}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

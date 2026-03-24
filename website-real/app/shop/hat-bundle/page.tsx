"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";
import { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { useCart } from "@/components/CartContext";
import { HAT_BUNDLE_PRICES } from "@/lib/shirtBundles";
import { useTrackProductView } from "@/hooks/useTrackProductView";

// Available hats for the bundle
const AVAILABLE_HATS = [
  {
    id: 'forest-hills',
    name: 'Forest Hills Camp Hat',
    image: '/images/products/Forest Hills Hat/Forest Hills Hat Final.png',
    hoverImage: '/images/products/Forest Hills Hat/G1.png',
  },
  {
    id: 'porcelain',
    name: 'Porcelain FS Cap',
    image: '/images/products/Porcelain Hat/Fruitscale Hat.png',
    hoverImage: '/images/products/Porcelain Hat/FS2.png',
  },
  {
    id: 'ecru',
    name: 'Ecru FS Cap',
    image: '/images/products/Ecru Hat/Beige Hat.png',
    hoverImage: '/images/products/Ecru Hat/B1.png',
  },
  {
    id: 'empire',
    name: 'Empire Corduroy Hat',
    image: '/images/products/empire-hat/Apple Hat.png',
    hoverImage: '/images/products/empire-hat/A2.png',
  },
  {
    id: 'indigo',
    name: 'Indigo FS Cap',
    image: '/images/products/denim-hat/Denim Hat.png',
    hoverImage: '/images/products/denim-hat/D1.png',
  },
];

const PRODUCT = {
  name: "Hat Bundle",
  subtitle: "Build Your Bundle",
  description: "Choose your favorite hats from our collection. 1 hat for $25, 2 hats for $39, or 3 hats for $49.",
  details: [
    "Pick any 1, 2, or 3 hats from our collection",
    "Mix and match your favorite styles",
    "Bundle pricing applied automatically",
    "Ships together as one curated set",
    "Quality guaranteed, Free returns."
  ],
};

type BundleItem = {
  hatId: string;
  hatName: string;
};

export default function HatBundlePage() {
  const { addToCart } = useCart();

  const [bundleSize, setBundleSize] = useState<1 | 2 | 3>(1);
  const [items, setItems] = useState<BundleItem[]>([
    { hatId: AVAILABLE_HATS[0].id, hatName: AVAILABLE_HATS[0].name },
  ]);

  // Modal state
  const [editingHatIndex, setEditingHatIndex] = useState<number | null>(null);
  const [tempHatId, setTempHatId] = useState<string | null>(null);

  useTrackProductView({
    productId: "ea9effdd-a3fa-4715-93fd-11afcac88b2a",
    productName: PRODUCT.name,
    price: HAT_BUNDLE_PRICES[bundleSize],
    currency: "USD",
  });

  const handleBundleSizeChange = useCallback((newSize: 1 | 2 | 3) => {
    setBundleSize(newSize);
    setItems((prev) => {
      const next = [...prev];
      while (next.length < newSize) {
        const nextHat = AVAILABLE_HATS[next.length % AVAILABLE_HATS.length];
        next.push({ hatId: nextHat.id, hatName: nextHat.name });
      }
      return next.slice(0, newSize);
    });
    setEditingHatIndex(null);
  }, []);

  const openEditModal = useCallback((index: number) => {
    setEditingHatIndex(index);
    setTempHatId(items[index].hatId);
  }, [items]);

  const saveEdit = useCallback(() => {
    if (editingHatIndex === null || !tempHatId) return;
    const hat = AVAILABLE_HATS.find(h => h.id === tempHatId);
    if (!hat) return;
    setItems((prev) => {
      const next = [...prev];
      next[editingHatIndex] = { hatId: hat.id, hatName: hat.name };
      return next;
    });
    setEditingHatIndex(null);
  }, [editingHatIndex, tempHatId]);

  const closeModal = useCallback(() => {
    setEditingHatIndex(null);
  }, []);

  const allFilled = items.length === bundleSize && items.every(item => item.hatId);

  const addBundleToCart = useCallback(() => {
    if (!allFilled) return;
    const price = HAT_BUNDLE_PRICES[bundleSize];
    const summary = items
      .slice(0, bundleSize)
      .map((item, i) => `#${i + 1} ${item.hatName}`)
      .join(" | ");
    addToCart({
      productId: "ea9effdd-a3fa-4715-93fd-11afcac88b2a",
      name: `Hat Bundle (${bundleSize}) – ${summary}`,
      price,
      image: AVAILABLE_HATS[0].image,
      quantity: 1,
    });
  }, [addToCart, bundleSize, allFilled, items]);

  const boughtTogetherItems = useMemo(() => getFBTForPage("hat-bundle"), []);

  const savingsInfo = useMemo(() => {
    if (bundleSize === 1) return null;
    const singlePrice = 25 * bundleSize; // All hats are $25 individually
    const bundlePrice = HAT_BUNDLE_PRICES[bundleSize];
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
              How many hats?
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {([1, 2, 3] as const).map((size) => (
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
                ${HAT_BUNDLE_PRICES[bundleSize]}
              </p>
              {savingsInfo && (
                <p className="text-sm text-green-700 font-semibold">
                  Save {savingsInfo.savingsPercent}% (${savingsInfo.savings.toFixed(2)})
                </p>
              )}
            </div>
          </div>

          {/* HAT CARDS GRID */}
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#1d1c19]/60 mb-4">
              Your Hats ({items.filter(i => i.hatId).length}/{bundleSize} selected)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
              {items.map((item, index) => {
                const hat = AVAILABLE_HATS.find(h => h.id === item.hatId);
                return (
                  <button
                    key={index}
                    onClick={() => openEditModal(index)}
                    className="group"
                  >
                    <div className="aspect-4/5 rounded-lg border-2 border-black/20 group-hover:border-black transition-all bg-white overflow-hidden mb-2 cursor-pointer relative">
                      {hat && (
                        <Image
                          src={hat.image}
                          alt={hat.name}
                          fill
                          className="object-contain p-2"
                        />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#1d1c19] line-clamp-2">
                        {hat?.name || 'Select hat'}
                      </p>
                      <p className="text-xs font-semibold text-[#1d1c19] mt-1">
                        Hat #{index + 1}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM SHEET MODAL */}
          <AnimatePresence>
            {editingHatIndex !== null && tempHatId && (
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
                        Hat #{editingHatIndex + 1}
                      </p>
                      <h3 className="text-xl font-avenir-black text-[#1d1c19] mt-1">
                        Choose Style
                      </h3>
                    </div>

                    {/* HAT SELECTOR */}
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#1d1c19]/60 mb-4">
                        Available Styles
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {AVAILABLE_HATS.map((hat) => {
                          const isSelected = hat.id === tempHatId;
                          return (
                            <button
                              key={hat.id}
                              onClick={() => setTempHatId(hat.id)}
                              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                                isSelected
                                  ? "border-black bg-black/5"
                                  : "border-black/20 hover:border-black"
                              }`}
                            >
                              <div className="relative h-20 w-20">
                                <Image
                                  src={hat.image}
                                  alt={hat.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <p className="text-[11px] font-semibold text-center text-[#1d1c19] leading-tight">
                                {hat.name}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3 mt-8">
                      <button
                        onClick={closeModal}
                        className="flex-1 py-4 px-4 rounded-lg border-2 border-black/20 text-[#1d1c19] font-bold text-sm hover:border-black transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="flex-1 py-4 px-4 rounded-lg border-2 bg-black text-white border-black font-bold text-sm hover:bg-[#2a2a2a] transition-all"
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
                  Add to Cart • ${HAT_BUNDLE_PRICES[bundleSize]}
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

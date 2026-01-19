"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";

export type PurchaseSizeOption = {
  value: string;
  label?: string;
  soldOut?: boolean;
  note?: string;
};

export type PurchaseColorOption = {
  value: string;
  label: string;
  swatch?: string;
  border?: string;
};

type ProductPurchaseBarProps = {
  price: number;
  currency?: string;
  addToCartLabel?: string;
  addDisabled?: boolean;
  addDisabledReason?: string;
  isAdding?: boolean;
  sizeOptions: PurchaseSizeOption[];
  selectedSize: string | null;
  onSelectSize: (value: string) => void;
  colorOptions?: PurchaseColorOption[];
  selectedColor?: string | null;
  onSelectColor?: (value: string) => void;
  onAddToCart: () => void;
  sizeGuideTrigger?: React.ReactNode;
  summaryLabel?: string;
};

const SUMMARY_ACTIVE_OFFSET = 0;
const BASE_OFFSET = 0;
const TOAST_GAP_PX = 18;
// Adjust this value to control the tallest the purchase bar stack may grow before it stops,
// useful if you want to keep a specific amount of the product hero visible.
export const PURCHASE_BAR_MAX_HEIGHT = 360;
const PURCHASE_BAR_HEIGHT_FALLBACK = 280;

function formatPrice(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    return `$${value.toFixed(2)}`;
  }
}

export default function ProductPurchaseBar({
  price,
  currency = "USD",
  addToCartLabel = "Add to Cart",
  addDisabled,
  addDisabledReason,
  isAdding,
  sizeOptions,
  selectedSize,
  onSelectSize,
  colorOptions,
  selectedColor,
  onSelectColor,
  onAddToCart,
  sizeGuideTrigger,
  summaryLabel,
}: ProductPurchaseBarProps) {
  const { items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [showCartSummary, setShowCartSummary] = useState(false);
  const prevCount = useRef(0);
  const isInitialized = useRef(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement | null>(null);
  const [barHeight, setBarHeight] = useState(0);

  const sizeTriggerRef = useRef<HTMLSelectElement | null>(null);
  const colorTriggerRef = useRef<HTMLSelectElement | null>(null);

  const cartCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const cartTotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const cartTotalFormatted = useMemo(() => formatPrice(cartTotal, currency), [cartTotal, currency]);
  const isCartPage = pathname === "/cart";
  const formattedPrice = useMemo(() => formatPrice(price, currency), [price, currency]);

  const sizeLabel = useMemo(() => {
    if (!selectedSize) return "Select size";
    const found = sizeOptions.find((opt) => opt.value === selectedSize);
    return found?.label ?? selectedSize;
  }, [selectedSize, sizeOptions]);

  const selectedColorOption = useMemo(() => {
    if (!selectedColor || !colorOptions?.length) return null;
    return colorOptions.find((opt) => opt.value === selectedColor) ?? null;
  }, [selectedColor, colorOptions]);

  const addButtonDisabled = addDisabled ?? !selectedSize;
  const disableReason = addDisabledReason ?? (!selectedSize ? "Select a size" : undefined);

  useEffect(() => {
    const count = cartCount;

    if (!isInitialized.current) {
      const storedCount = typeof window !== "undefined" ? parseInt(localStorage.getItem("cartCount") || "0", 10) : 0;
      prevCount.current = Number.isFinite(storedCount) ? storedCount : 0;
      isInitialized.current = true;
      const shouldShow = count > 0 && !isCartPage;
      setShowCartSummary(shouldShow);
      if (typeof window !== "undefined") {
        localStorage.setItem("cartCount", count.toString());
      }
      return;
    }

    if (count > prevCount.current) {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
      setShowPopup(true);
      popupTimeoutRef.current = setTimeout(() => {
        setShowPopup(false);
        setTimeout(() => setShowCartSummary(count > 0 && !isCartPage), 60);
      }, 1500);
    } else if (count < prevCount.current) {
      setShowCartSummary(count > 0 && !isCartPage && !showPopup);
    } else if (count === 0 || isCartPage) {
      setShowCartSummary(false);
    } else if (count > 0 && !isCartPage && !showPopup) {
      setShowCartSummary(true);
    }

    prevCount.current = count;
    if (typeof window !== "undefined") {
      localStorage.setItem("cartCount", count.toString());
    }
  }, [cartCount, isCartPage, showPopup]);

  useEffect(() => {
    const count = cartCount;
    if (!isInitialized.current) return;
    if (isCartPage) {
      setShowCartSummary(false);
      return;
    }
    if (count > 0 && !showPopup) {
      setShowCartSummary(true);
    }
  }, [pathname, cartCount, isCartPage, showPopup]);

  useEffect(() => {
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = barRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setBarHeight(entry.contentRect.height);
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const height = Math.max(barHeight || 0, PURCHASE_BAR_HEIGHT_FALLBACK);
    document.documentElement.style.setProperty("--purchase-bar-height", `${Math.round(height)}px`);
    return () => {
      document.documentElement.style.removeProperty("--purchase-bar-height");
    };
  }, [barHeight]);

  return (
    <>
      {showPopup && (
        <div
          className="fixed left-1/2 z-[10005] flex -translate-x-1/2 items-center justify-center rounded-2xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,15,15,0.32)]"
          style={{ bottom: `${Math.max((barHeight || PURCHASE_BAR_HEIGHT_FALLBACK) + TOAST_GAP_PX, 96)}px` }}
        >
          Added to cart!
        </div>
      )}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[10004] flex justify-center">
        <div
          className="pointer-events-auto w-full max-w-3xl px-3 pb-[env(safe-area-inset-bottom,0px)] sm:px-4"
          style={{ marginBottom: showCartSummary ? SUMMARY_ACTIVE_OFFSET : BASE_OFFSET }}
        >
          <div
            ref={barRef}
            className="rounded-[26px] border border-black/8 bg-white/95 shadow-[0_-8px_28px_rgba(15,15,15,0.16)] backdrop-blur-xl"
            style={{ maxHeight: PURCHASE_BAR_MAX_HEIGHT, overflowY: "auto" }}
          >
            <div className="flex flex-col gap-2 sm:gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <div className="flex flex-col">
                  {summaryLabel && (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
                      {summaryLabel}
                    </span>
                  )}
                  <span className="text-base font-semibold text-neutral-900 sm:text-lg">
                    {formattedPrice}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-500">
                  {selectedColorOption && (
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10 shadow"
                        style={{ background: selectedColorOption.swatch || "#d1d5db" }}
                      />
                      <span>{selectedColorOption.label}</span>
                    </span>
                  )}
                  <span>{selectedSize ? `Size ${selectedSize}` : "Size not selected"}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-stretch gap-2 sm:flex-nowrap">
                {colorOptions?.length && colorOptions.length > 1 ? (
                  <div className="relative min-w-[44%] flex-1 sm:min-w-[200px]">
                    <label className="sr-only" htmlFor="purchase-color-select">
                      Select color
                    </label>
                    <select
                      id="purchase-color-select"
                      ref={colorTriggerRef}
                      value={selectedColor ?? ""}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value) {
                          onSelectColor?.(value);
                        }
                      }}
                      className="flex h-full w-full appearance-none items-center rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-sm font-medium text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
                      style={{ backgroundImage: "none" }}
                    >
                      {!selectedColor && <option value="">Select color</option>}
                      {colorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                <div className="relative min-w-[44%] flex-1 sm:min-w-[180px]">
                  <label className="sr-only" htmlFor="purchase-size-select">
                    Select size
                  </label>
                  <select
                    id="purchase-size-select"
                    ref={sizeTriggerRef}
                    value={selectedSize ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value) {
                        onSelectSize(value);
                      }
                    }}
                    className="flex h-full w-full appearance-none items-center rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-sm font-semibold text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
                    style={{ backgroundImage: "none" }}
                  >
                    {!selectedSize && <option value="">Select size</option>}
                    {sizeOptions.map((option) => (
                      <option key={option.value} value={option.value} disabled={option.soldOut}>
                        {option.label ?? option.value}
                        {option.soldOut ? " (Sold out)" : option.note ? ` — ${option.note}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex min-w-[44%] flex-1 sm:min-w-[170px] sm:max-w-[200px] sm:flex-none">
                  <button
                    type="button"
                    onClick={onAddToCart}
                    disabled={addButtonDisabled || isAdding}
                    className={`relative flex h-full w-full items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white transition focus:outline-none focus:ring-1 focus:ring-black/60 focus:ring-offset-2 focus:ring-offset-white ${
                      addButtonDisabled || isAdding ? "opacity-60" : "hover:bg-neutral-800"
                    }`}
                    title={disableReason}
                  >
                    {isAdding ? "Adding..." : addButtonDisabled && disableReason ? disableReason : addToCartLabel}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                {sizeGuideTrigger}
                {selectedColorOption && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 font-medium text-neutral-600">
                    <span
                      className="h-3 w-3 rounded-full border border-neutral-300"
                      style={{ background: selectedColorOption.swatch || "#d4d4d4" }}
                    />
                    <span>{selectedColorOption.label}</span>
                  </span>
                )}
                {selectedSize && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 font-medium text-neutral-600">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Size</span>
                    <span className="font-semibold text-neutral-700">{selectedSize}</span>
                  </span>
                )}
              </div>

              {showCartSummary && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-neutral-200/70 bg-neutral-900 px-3 py-2 text-white shadow-[0_6px_20px_rgba(15,15,15,0.18)] sm:px-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="font-medium uppercase tracking-[0.3em] text-white/70">Cart</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-neutral-900 shadow">
                      {cartCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
                    <span>{cartTotalFormatted}</span>
                    <Link
                      href="/cart"
                      className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-900 transition hover:bg-neutral-200 sm:text-sm"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        style={{ height: `calc(var(--purchase-bar-height, ${PURCHASE_BAR_HEIGHT_FALLBACK}px) + 24px)` }}
      />
    </>
  );
}

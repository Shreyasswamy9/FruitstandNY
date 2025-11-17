"use client"

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { bundles as defaultBundles, type Bundle } from '@/lib/bundles'
import { products as gridProducts, type Product } from './ProductsGridHome'
import { useCart } from './CartContext'

function parsePrice(priceStr: string): number {
  // Expect formats like "$55" or "$120"; fallback to 0
  const n = Number(priceStr.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function formatPrice(n: number): string {
  return `$${n.toFixed(2).replace(/\.00$/, '')}`
}

export type BundleSheetProps = {
  open: boolean
  onClose: () => void
  bundles?: Bundle[]
  // Optionally override products source (for tests); defaults to ProductsGridHome.products
  products?: Product[]
}

export default function BundleSheet({ open, onClose, bundles = defaultBundles, products = gridProducts }: BundleSheetProps) {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Map products by id for lookup
  const productMap = new Map(products.map(p => [p.id, p]))

  // Compute the best discount to showcase in header
  const maxDiscount = useMemo(() => {
    return bundles.reduce((max, b) => Math.max(max, b.discountPercent || 0), 0)
  }, [bundles])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Mount flag for portal (avoids SSR document access)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Ensure a default selection when opening
  useEffect(() => {
    if (open) {
      setSelectedId(prev => prev ?? (bundles[0]?.id ?? null))
    }
  }, [open, bundles])

  const addBundleToCart = (bundle: Bundle) => {
    if (adding) return
    setAdding(true)
    // Add each item with quantity 1
    for (const id of bundle.itemIds) {
      const p = productMap.get(id)
      if (!p) continue
      addToCart({
        productId: String(p.id),
        name: p.name,
        price: parsePrice(p.price),
        image: p.image,
        quantity: 1,
      })
    }
    setCelebrate(true)
    setTimeout(() => {
      setAdding(false)
      // allow confetti to finish before hiding
      setTimeout(() => setCelebrate(false), 600)
    }, 800)
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[11000]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[11001] bg-white rounded-t-3xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Bundle and save"
          >
            {/* Header */}
            <div className="relative">
              {/* Gradient banner */}
              <div className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 text-white px-5 pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <h3 className="text-xl font-semibold tracking-wide">Bundle & Save</h3>
                  </div>
                  <button onClick={onClose} aria-label="Close" className="p-2 -mr-2 text-white/90 hover:text-white">✕</button>
                </div>
                <p className="text-sm text-white/90 mt-1">Save up to {maxDiscount}% on curated combos</p>
              </div>
              {/* Grab handle */}
              <div className="flex justify-center py-3 bg-white">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
            </div>

            {/* Content: horizontal scroll of bundles */}
            <div className="px-5 pb-28 overflow-x-auto">
              <div className="flex gap-12 pr-5">
                {bundles.map((b) => {
                  const items = b.itemIds.map(id => productMap.get(id)).filter(Boolean) as Product[]
                  const subtotal = items.reduce((acc, p) => acc + parsePrice(p.price), 0)
                  const discount = b.discountPercent ? Math.round(subtotal * (b.discountPercent / 100)) : 0
                  const total = Math.max(0, subtotal - discount)
                  return (
                    <div
                      key={b.id}
                      className={`relative min-w-[85%] max-w-[85%] sm:min-w-[420px] sm:max-w-[420px] bg-white rounded-xl border shadow-lg transition-all ${selectedId === b.id ? 'border-transparent ring-4 ring-fuchsia-500/70 ring-offset-2 ring-offset-white shadow-[0_0_0_2px_rgba(217,70,239,0.5),0_10px_22px_rgba(217,70,239,0.25)]' : 'border-gray-100'}`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedId === b.id}
                      aria-label={`Select bundle ${b.title}`}
                      onClick={() => setSelectedId(b.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedId(b.id)
                        }
                      }}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-base font-semibold">{b.title}</h4>
                          {b.discountPercent ? (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                              Save {b.discountPercent}%
                            </span>
                          ) : null}
                        </div>
                        {b.description && <p className="text-sm text-gray-500 mb-3">{b.description}</p>}
                        {/* Selected indicator */}
                        {selectedId === b.id && (
                          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-white bg-gradient-to-r from-fuchsia-500 to-violet-500 text-[11px] font-medium px-2 py-0.5 rounded-full shadow-md">
                            ✓ Selected
                          </span>
                        )}
                        {/* Thumbnails */}
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {items.map(p => (
                            <div key={p.id} className="shrink-0 w-28">
                              <div className="relative w-28 h-36 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                                <Image src={p.image} alt={p.name} fill sizes="112px" style={{ objectFit: 'cover' }} />
                              </div>
                              <p className="text-xs mt-1 font-medium truncate">{p.name}</p>
                              <p className="text-xs text-gray-500">{p.price}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">{formatPrice(subtotal)}</span>
                        </div>
                        {b.discountPercent ? (
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-green-600">Discount ({b.discountPercent}%)</span>
                            <span className="text-green-600">- {formatPrice(discount)}</span>
                          </div>
                        ) : null}
                        <div className="flex items-center justify-between text-base font-semibold">
                          <span>Total</span>
                          <span>{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sticky CTA bar */}
            <div className="fixed left-0 right-0 bottom-0 z-[11002] bg-white border-t border-gray-200 py-3 px-5">
              <div className="flex gap-3">
                {/* For MVP, primary action adds the first bundle; could be improved to select bundle first */}
                <button
                  disabled={adding || !bundles.length}
                  onClick={() => {
                    const selected = bundles.find(b => b.id === selectedId) || bundles[0]
                    if (selected) addBundleToCart(selected)
                  }}
                  className={`flex-1 ${adding ? 'bg-green-600' : 'bg-black'} text-white py-3 rounded-xl font-medium shadow-md active:opacity-90`}
                >
                  {adding ? 'Added!' : 'Add Selected Bundle'}
                </button>
                <button onClick={onClose} className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700">Close</button>
              </div>
            </div>

            {/* Confetti overlay */}
            {celebrate && (
              <div className="pointer-events-none fixed inset-0 z-[11003] overflow-hidden">
                <div className="absolute inset-0 animate-[confetti_0.9s_ease-out_forwards]">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute text-2xl select-none"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: '-10%',
                        transform: `rotate(${Math.random() * 360}deg)`,
                      }}
                    >
                      {['🎉','✨','🟡','🟣','🔵','🟢'][i % 6]}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

// Confetti keyframes
// Using global style injection to avoid editing global CSS
if (typeof document !== 'undefined') {
  const id = 'bundle-confetti-keyframes'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.innerHTML = `@keyframes confetti { from { transform: translateY(-5%) } to { transform: translateY(110vh) } }`
    document.head.appendChild(style)
  }
}

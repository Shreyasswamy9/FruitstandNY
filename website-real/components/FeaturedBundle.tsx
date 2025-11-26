"use client"

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { bundles as defaultBundles, type Bundle } from '@/lib/bundles'
import { products as gridProducts, type Product } from './ProductsGridHome'
import BundleSheet from './BundleSheet'
import Price from './Price'

function parsePrice(priceStr: string): number {
  const n = Number(String(priceStr).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function getEffectivePrice(p: Product): number {
  if (p.salePrice != null) {
    const s = typeof p.salePrice === 'number' ? p.salePrice : parsePrice(String(p.salePrice))
    if (Number.isFinite(s) && s > 0) return s
  }
  return parsePrice(p.price)
}

function formatPrice(n: number): string {
  return `$${n.toFixed(2).replace(/\.00$/, '')}`
}

export type FeaturedBundleProps = {
  bundle?: Bundle
  bundles?: Bundle[]
  products?: Product[]
  className?: string
}

export default function FeaturedBundle({ bundle, bundles = defaultBundles, products = gridProducts, className }: FeaturedBundleProps) {
  // no direct cart operations here; adding bundles handled via BundleSheet
  const [openSheet, setOpenSheet] = useState(false)
  const [selectedForSheet, setSelectedForSheet] = useState<string | null>(null)

  const featured = bundle ?? bundles[0]
  const productMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products])

  if (!featured) return null

  const items = featured.itemIds.map(id => productMap.get(id)).filter(Boolean) as Product[]
  const originalSubtotal = items.reduce((acc, p) => acc + parsePrice(p.price), 0)
  const effectiveSubtotal = items.reduce((acc, p) => acc + getEffectivePrice(p), 0)
  const discount = Math.max(0, originalSubtotal - effectiveSubtotal)
  const total = Math.max(0, effectiveSubtotal)
  const computedPercent = originalSubtotal > 0 ? Math.round((discount / originalSubtotal) * 100) : 0

  // Add bundle helper removed — use BundleSheet for selection to keep UI consistent

  return (
    <section className={className} aria-label="Featured bundle">
      <div className="text-center mb-6">
        <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">Featured Bundle</h2>
        <p className="mt-1 text-sm">Hand-picked combo for great value</p>
      </div>

  <div className="glass-card rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div>
            <h3 className="text-lg font-semibold">{featured.title}</h3>
            {featured.description && <p className="text-sm">{featured.description}</p>}
          </div>
          {discount > 0 ? (
            <span className="glass-badge" data-variant="discount">
              Save {computedPercent}%
            </span>
          ) : null}
        </div>

        {/* Items thumbnails */}
        <div className="px-4 pb-2">
          <div className="flex gap-3 overflow-x-auto">
            {items.map((p) => (
              <div key={p.id} className="shrink-0 w-28">
                <div className="relative w-28 h-36 rounded-lg overflow-hidden glass-thumb shadow-sm">
                  <Image src={p.image} alt={p.name} fill sizes="112px" style={{ objectFit: 'cover' }} />
                </div>
                <p className="text-xs mt-1 font-medium truncate">{p.name}</p>
                <p className="text-xs"><Price price={p.price} salePrice={p.salePrice} /></p>
              </div>
            ))}
          </div>
        </div>

        {/* Price summary */}
        <div className="px-4 pt-2 pb-4">
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(originalSubtotal)}</span>
          </div>
          {discount > 0 ? (
            <div className="flex items-center justify-between text-sm">
              <span>Bundle discount</span>
              <span>- {formatPrice(discount)}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between text-base font-semibold mt-1">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-4 pb-4">
          <button
            onClick={() => { setSelectedForSheet(featured.id); setOpenSheet(true) }}
            className="flex-1 bg-black text-white py-2.5 rounded-xl font-medium shadow-sm active:opacity-90"
            aria-label={`Add ${featured.title} bundle to cart`}
          >
            Add bundle to cart
          </button>
          <button
            onClick={() => { setSelectedForSheet(featured.id); setOpenSheet(true) }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50"
            aria-label="View all bundle options"
          >
            Details
          </button>
        </div>
      </div>

      <BundleSheet open={openSheet} initialSelectedId={selectedForSheet} onClose={() => { setOpenSheet(false); setSelectedForSheet(null) }} />
    </section>
  )
}

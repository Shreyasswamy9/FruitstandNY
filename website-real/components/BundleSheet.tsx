"use client"

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { bundles as defaultBundles, type Bundle } from '@/lib/bundles'
import { TEE_VARIANTS, SIZE_OPTIONS, type TeeVariant, type TeeColor, type SizeOption } from '@/lib/teeVariants'
import { CUSTOM_BUNDLE_SIZES, CUSTOM_BUNDLE_PRICES, type CustomBundleSize } from '@/lib/customBundles'
import { products as gridProducts, type Product } from './ProductsGridHome'
import { useCart } from './CartContext'

// ---------- utils
function parsePrice(priceStr: string): number {
  const n = Number(priceStr.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}
function formatPrice(n: number): string {
  return `$${n.toFixed(2).replace(/\.00$/, '')}`
}

// ---------- props
export type BundleSheetProps = {
  open: boolean
  onClose: () => void
  bundles?: Bundle[]
  products?: Product[]
}

// Rebuilt from scratch: a clean, polished bottom sheet for curated bundles and a custom builder
export default function BundleSheet({ open, onClose, bundles = defaultBundles, products = gridProducts }: BundleSheetProps) {
  const { addToCart } = useCart()

  // UI state
  const [mounted, setMounted] = useState(false)
  const [adding, setAdding] = useState(false)
  const [tab, setTab] = useState<'curated' | 'custom'>('curated')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [teaseBuild, setTeaseBuild] = useState(false)

  // Custom builder state
  const [comboSize, setComboSize] = useState<CustomBundleSize>(2)
  type CustomItem = { tee: TeeVariant; color: TeeColor; size?: SizeOption }
  const defaultItem = (i: number): CustomItem => {
    const tee = TEE_VARIANTS[i % TEE_VARIANTS.length]
    return { tee, color: tee.colors[0], size: undefined }
  }
  const [customItems, setCustomItems] = useState<CustomItem[]>(Array.from({ length: comboSize }, (_, i) => defaultItem(i)))

  // Derived
  const productMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products])
  const maxDiscount = useMemo(() => bundles.reduce((m, b) => Math.max(m, b.discountPercent || 0), 0), [bundles])
  const canAddCustom = useMemo(() => customItems.every(ci => ci.tee && ci.color && ci.size), [customItems])
  const filledCount = useMemo(() => customItems.filter(ci => !!ci.size).length, [customItems])

  // Lifecycle
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (!mounted) return
    const onKey = (e: KeyboardEvent) => { if (open && e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mounted, open, onClose])
  useEffect(() => {
    if (!mounted) return
    if (!open) return
    const { body } = document
    const prev = body.style.overflow
    body.style.overflow = 'hidden'
    return () => { body.style.overflow = prev }
  }, [mounted, open])
  // Gentle one-time nudge to highlight the Build tab (respect reduced motion)
  useEffect(() => {
    if (!open) return
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const already = sessionStorage.getItem('buildTeased')
    if (!already && !reduced) {
      setTeaseBuild(true)
      const t = setTimeout(() => setTeaseBuild(false), 1800)
      sessionStorage.setItem('buildTeased', '1')
      return () => clearTimeout(t)
    }
  }, [open])
  useEffect(() => {
    if (open) setSelectedId(prev => prev ?? (bundles[0]?.id ?? null))
  }, [open, bundles])
  useEffect(() => {
    setCustomItems(prev => {
      const next = [...prev]
      if (next.length < comboSize) for (let i = next.length; i < comboSize; i++) next.push(defaultItem(i))
      else if (next.length > comboSize) next.length = comboSize
      return next
    })
  }, [comboSize])

  // Actions
  const addCuratedToCart = (bundle: Bundle) => {
    if (adding) return
    setAdding(true)
    for (const id of bundle.itemIds) {
      const p = productMap.get(id)
      if (!p) continue
      addToCart({ productId: String(p.id), name: p.name, price: parsePrice(p.price), image: p.image, quantity: 1 })
    }
    setTimeout(() => setAdding(false), 350)
  }
  const addCustomToCart = () => {
    if (!canAddCustom || adding) return
    setAdding(true)
    const price = CUSTOM_BUNDLE_PRICES[comboSize]
    const summary = customItems.map(ci => `${ci.tee.name} • ${ci.color.name} • ${ci.size}`).join(' | ')
    addToCart({
      productId: `custom-bundle-${comboSize}-${Date.now()}`,
      name: `Build Your Bundle (${comboSize}) – ${summary}`,
      price,
      image: customItems[0]?.color.image || '/images/classicteemale1.jpeg',
      quantity: 1,
    })
    setTimeout(() => setAdding(false), 350)
  }

  // Render
  return mounted ? createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop with subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[11000] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Bottom sheet */}
          <motion.section
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            role="dialog" aria-modal="true" aria-label="Bundle deals"
            className="fixed inset-x-0 bottom-0 z-[11001] max-h-[75vh] bg-white rounded-t-[28px] shadow-2xl flex flex-col border border-black/5"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-100 rounded-t-[28px]">
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">Bundle & Save</h3>
                    <p className="text-xs text-gray-500">Save up to {maxDiscount}% with curated picks or build your own</p>
                  </div>
                  <button onClick={onClose} aria-label="Close"
                          className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 active:scale-95">✕</button>
                </div>
                {/* Tabs */}
                <div className="mt-3 inline-flex rounded-full bg-gray-100 p-1" role="tablist" aria-label="Bundle mode">
                  <button
                    role="tab" aria-selected={tab==='curated'}
                    onClick={() => setTab('curated')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${tab==='curated'?'bg-white shadow-sm':'text-gray-600 hover:text-gray-800'}`}
                  >
                    <span className="inline-flex items-center gap-1">Curated</span>
                  </button>
                  <button
                    role="tab" aria-selected={tab==='custom'}
                    onClick={() => setTab('custom')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition relative ${tab==='custom'?'bg-white shadow-sm':'text-gray-600 hover:text-gray-800'} ${(!tab||tab==='curated') && teaseBuild ? 'ring-2 ring-fuchsia-300 shadow-[0_0_0_4px_rgba(232,121,249,0.25)]' : ''}`}
                  >
                    <span className="inline-flex items-center gap-1">Build <span aria-hidden>✨</span></span>
                    {! (tab==='custom') && (
                      <span className="absolute -top-2 -right-2 text-[10px] bg-black text-white px-1.5 py-0.5 rounded-full">New</span>
                    )}
                  </button>
                </div>
                {tab === 'curated' && (
                  <div className="mt-2">
                    <button
                      onClick={() => setTab('custom')}
                      className="inline-flex items-center gap-1.5 text-xs text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 px-2.5 py-1 rounded-full hover:bg-fuchsia-100"
                    >
                      Prefer to mix your own? <span className="font-semibold">Try Build</span> →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {tab === 'curated' ? (
                <div className="p-5 space-y-4 pb-28">
                  {bundles.map(b => {
                    const items = (b.itemIds.map(id => productMap.get(id)).filter(Boolean) as Product[])
                    const subtotal = items.reduce((acc, p) => acc + parsePrice(p.price), 0)
                    const discount = b.discountPercent ? Math.round(subtotal * (b.discountPercent/100)) : 0
                    const total = Math.max(0, subtotal - discount)
                    const isSelected = selectedId === b.id
                    return (
                      <label key={b.id} className={`block rounded-2xl border ${isSelected?'border-fuchsia-400 ring-2 ring-fuchsia-200':'border-gray-200'} hover:border-gray-300 transition shadow-sm`}>
                        <input type="radio" name="bundle" value={b.id} className="sr-only"
                               checked={isSelected} onChange={() => setSelectedId(b.id)} />
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-base">{b.title}</h4>
                                {b.discountPercent ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700 border border-green-200">
                                    Save {b.discountPercent}%
                                  </span>
                                ) : null}
                              </div>
                              {b.description && <p className="text-sm text-gray-500 mt-0.5">{b.description}</p>}
                            </div>
                            {isSelected && <span className="text-xs text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 px-2 py-0.5 rounded-full">Selected</span>}
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-3">
                            {items.map(p => (
                              <div key={p.id} className="col-span-1">
                                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg border border-gray-100">
                                  <Image src={p.image} alt={p.name} fill sizes="33vw" className="object-cover" />
                                </div>
                                <p className="mt-1 text-[12px] font-medium truncate">{p.name}</p>
                                <p className="text-[12px] text-gray-500">{p.price}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 rounded-xl bg-gray-50 border border-gray-100 p-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-medium">{formatPrice(subtotal)}</span>
                            </div>
                            {b.discountPercent ? (
                              <div className="flex items-center justify-between mt-1 text-green-700">
                                <span>Discount ({b.discountPercent}%)</span>
                                <span>- {formatPrice(discount)}</span>
                              </div>
                            ) : null}
                            <div className="flex items-center justify-between mt-2 text-base font-semibold">
                              <span>Total</span>
                              <span>{formatPrice(total)}</span>
                            </div>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              ) : (
                <div className="p-5 pb-28">
                  {/* Top highlight */}
                  <div className="rounded-2xl p-4 border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 via-pink-50 to-cyan-50">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-semibold">Build your own bundle</h4>
                        <p className="text-sm text-gray-600 mt-0.5">Mix any tees, choose colors and sizes. One simple price.</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">{comboSize} tees</span>
                    </div>
                    {/* Steps */}
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-gray-700">
                      <span className="px-2 py-1 rounded-full bg-white/70 border border-gray-200">1 • Choose pack size</span>
                      <span className="px-2 py-1 rounded-full bg-white/70 border border-gray-200">2 • Customize each tee</span>
                      <span className="px-2 py-1 rounded-full bg-white/70 border border-gray-200">3 • Add to cart</span>
                    </div>
                    {/* Progress */}
                    <div className="mt-3">
                      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500" style={{ width: `${Math.round((filledCount/Number(comboSize))*100)}%` }} />
                      </div>
                      <p className="mt-1 text-[12px] text-gray-600">{filledCount} of {comboSize} tees configured</p>
                    </div>
                  </div>

                  {/* Size options (combo pack selector) */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-sm font-semibold text-gray-800">Choose bundle size</h5>
                      <span className="text-[11px] text-gray-500">Pick how many tees you want</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {CUSTOM_BUNDLE_SIZES.map(sz => {
                        const selected = comboSize === sz
                        return (
                          <button
                            key={sz}
                            onClick={() => setComboSize(sz)}
                            aria-pressed={selected}
                            aria-label={`${sz} tee bundle for ${formatPrice(CUSTOM_BUNDLE_PRICES[sz])}`}
                            className={`group relative rounded-2xl border transition shadow-sm active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-fuchsia-300 ${selected ? 'bg-black text-white border-black shadow-lg ring-2 ring-black/50' : 'bg-white text-gray-800 border-gray-300 hover:border-black'} flex flex-col items-center justify-center px-4 py-3 min-w-[110px]`}
                          >
                            <span className={`text-lg font-bold tracking-tight ${selected ? 'text-white' : 'text-gray-900'}`}>{sz}</span>
                            <span className={`mt-0.5 text-[11px] font-medium uppercase tracking-wide ${selected ? 'text-white/80' : 'text-gray-600'}`}>Tees</span>
                            <span className={`mt-1 text-xs font-semibold ${selected ? 'text-white' : 'text-gray-800'}`}>{formatPrice(CUSTOM_BUNDLE_PRICES[sz])}</span>
                            {selected && (
                              <span className="absolute -top-2 right-2 text-[10px] bg-fuchsia-600 text-white px-2 py-0.5 rounded-full shadow">Selected</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Rows */}
                  <div className="mt-4 space-y-3">
                    {customItems.map((ci, idx) => (
                      <div key={idx} className="rounded-2xl border border-gray-200 p-3 bg-white">
                        <div className="flex gap-3">
                          <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                            <Image src={ci.color.image} alt={`${ci.tee.name} ${ci.color.name}`} fill sizes="64px" className="object-cover" />
                            <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded-full bg-black/70 text-white">#{idx+1}</span>
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-2 min-w-0">
                            <div className="col-span-3">
                              <label className="block text-[11px] text-gray-500">Tee</label>
                              <select
                                value={ci.tee.slug}
                                onChange={e => {
                                  const tee = TEE_VARIANTS.find(t => t.slug === e.target.value as TeeVariant['slug'])!
                                  setCustomItems(prev => prev.map((it, i) => i===idx ? { tee, color: tee.colors[0], size: it.size } : it))
                                }}
                                className="w-full border rounded-md px-2 py-1.5 text-xs"
                              >
                                {TEE_VARIANTS.map(tv => <option key={tv.slug} value={tv.slug}>{tv.name}</option>)}
                              </select>
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[11px] text-gray-500">Color</label>
                              <div className="flex gap-1.5 flex-wrap mt-1">
                                {ci.tee.colors.map(color => (
                                  <button key={color.name} aria-label={color.name}
                                          onClick={() => setCustomItems(prev => prev.map((it, i) => i===idx ? { ...it, color } : it))}
                                          className={`w-6 h-6 rounded-full border ${ci.color.name===color.name?'ring-2 ring-blue-500 border-black':'border-gray-300'}`}
                                          style={{ background: color.hex }}
                                          title={color.name}
                                  />
                                ))}
                              </div>
                              {/* Show selected color name below color options as a pill with swatch */}
                              <div className="mt-2">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-gray-300 bg-white text-gray-900 text-[11px]">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full border border-black/10"
                                    style={{ background: ci.color?.hex || '#999' }}
                                    aria-hidden
                                  />
                                  {ci.color?.name || 'Color Name'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[11px] text-gray-500">Size</label>
                              <select
                                value={ci.size ?? ''}
                                onChange={e => setCustomItems(prev => prev.map((it, i) => i===idx ? { ...it, size: (e.target.value as typeof SIZE_OPTIONS[number]) || undefined } : it))}
                                className="mt-1 w-full border rounded-md px-2 py-1.5 text-xs"
                              >
                                <option value="" disabled>Select size</option>
                                {SIZE_OPTIONS.map(sz => (
                                  <option key={sz} value={sz}>{sz}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer CTA */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-3 rounded-t-2xl">
              {tab === 'curated' ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => { const b = bundles.find(x => x.id === selectedId) || bundles[0]; if (b) addCuratedToCart(b) }}
                    disabled={adding || !bundles.length}
                    className={`flex-1 py-3 rounded-xl text-white font-medium shadow-md active:opacity-90 ${adding ? 'bg-green-600' : 'bg-black'}`}
                  >{adding ? 'Added!' : 'Add selected bundle'}</button>
                  <button onClick={onClose} className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700">Close</button>
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  <button
                    onClick={addCustomToCart}
                    disabled={!canAddCustom || adding}
                    className={`flex-1 py-3 rounded-xl text-white font-medium shadow-md ${canAddCustom && !adding ? 'bg-black' : 'bg-gray-400'}`}
                  >{adding ? 'Adding…' : `Add ${comboSize}-tee bundle — ${formatPrice(CUSTOM_BUNDLE_PRICES[comboSize])}`}</button>
                  <button onClick={onClose} className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700">Close</button>
                </div>
              )}
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>,
    document.body
  ) : null
}

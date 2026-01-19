"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Price from './Price';

export interface FBTProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface FrequentlyBoughtTogetherProps {
  products: FBTProduct[];
  onAddToCart?: (product: FBTProduct) => void;
  onAddAllToCart?: (products: FBTProduct[]) => void;
}

const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({ products, onAddToCart, onAddAllToCart }) => {
  return (
    <div style={{ scrollSnapAlign: 'start', display: 'flex', alignItems: 'center', background: '#fbf6f0' }} className="py-8 px-4">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Frequently Bought Together</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <Link href={`/shop/${item.id}`} className="relative w-full h-48 mb-4 rounded-lg overflow-hidden block">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </Link>
              <h3 className="text-xl font-semibold mb-2">
                <Link href={`/shop/${item.id}`} className="hover:underline">{item.name}</Link>
              </h3>
              <div className="text-lg font-bold text-gray-800 mb-4">
                <Price price={item.price} />
              </div>
              <button
                className="w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                onClick={() => onAddToCart && onAddToCart(item)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => onAddAllToCart && onAddAllToCart(products)}
          >
            Add All to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;

// --- Centralized FBT data and helper (moved from components/fbt-products.ts) ---
const FBT_POOL: FBTProduct[] = [
  { id: 'gala-tshirt', name: 'Gala Tee', price: 40, image: '/images/products/gala-tshirt/broadwaynoir/GN4.png' },
  { id: 'wasabi-tee', name: 'Wabisabi™ Scheffel Hall Pears Tee', price: 45, image: '/images/products/Wasabi Tee/Wabasabi 1.png' },
  { id: 'forest-hills-hat', name: 'Forest Hills Hat', price: 46, image: '/images/products/Forest Hills Hat/G1.png' },
  { id: 'porcelain-hat', name: 'Porcelain FS Cap', price: 44, image: '/images/products/Porcelain Hat/FS2.png' },
  { id: 'denim-hat', name: 'Indigo Hat', price: 44, image: '/images/products/denim-hat/Denim Hat.png' },
  { id: 'ecru-hat', name: 'Ecru Hat', price: 44, image: '/images/products/Ecru Hat/Beige Hat.png' },
  { id: 'empire-hat', name: 'Empire Corduroy Hat', price: 49, image: '/images/products/empire-hat/Apple Hat.png' },
  { id: 'track-pants', name: 'Retro Track Pants', price: 90, image: '/images/products/Track Pants/ELMHURST TARO CUSTARD/P6.png' },
  { id: 'track-top', name: 'Retro Track Jacket', price: 110, image: '/images/products/Track Top/ELMHURST TARO CUSTARD/J6.png' },
  { id: 'tracksuit', name: 'Retro Track Suit', price: 165, image: '/images/products/tracksuits/ELMHURST TARO CUSTARD/TP.png' },
  { id: 'mandarin-tee', name: 'Mandarin 橘子 [JUZI] Tee', price: 68, image: '/images/products/Mandarin Tee/Mandarin Tee.png' },
  { id: 'mutsu-tshirt', name: 'Mutsu Tee', price: 45, image: '/images/products/mutsu-tshirt/broadwaynoir/N1.png' },
  { id: 'fuji-tshirt', name: 'Fuji Long Sleeve', price: 80, image: '/images/products/fuji-tshirt/Arboretum/F2.png' },
  { id: 'cameo-tshirt', name: 'Cameo Tee', price: 40, image: '/images/products/cameo-tshirt/broadwaynoir/MN.png' },
  { id: 'first-edition-tee', name: 'First Edition Tee', price: 45, image: '/images/products/First Edition Tee/FE1.png' },
  { id: 'hockey-jersey', name: 'Broadway Blueberry Jersey', price: 180, image: '/images/products/hockey Jersey/JN.png' },
];

const FBT_LOOKUP = new Map(FBT_POOL.map((product) => [product.id, product]));

const FALLBACK_COUNT = 3;
const DEFAULT_KEY = 'default';

const hashString = (input: string): number => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

const orderByKey = (items: FBTProduct[], key: string): FBTProduct[] => (
  items
    .map((item) => ({ item, sortKey: hashString(`${key}|${item.id}`) }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ item }) => ({ ...item }))
);

const cloneFromPool = (id: string): FBTProduct => {
  const base = FBT_LOOKUP.get(id);
  return base ? { ...base } : { id, name: id, price: 0, image: '' };
};

const buildFallback = (key: string): FBTProduct[] => {
  const candidates = FBT_POOL.filter((product) => product.id !== key);
  if (!candidates.length) {
    return [];
  }
  const ordered = orderByKey(candidates, key);
  return ordered.slice(0, Math.min(FALLBACK_COUNT, ordered.length));
};

export const defaultFBT: FBTProduct[] = buildFallback(DEFAULT_KEY);

export const FBT_BY_PAGE: Record<string, FBTProduct[]> = {
  'forest-hills-hat': [
    cloneFromPool('gala-tshirt'),
    cloneFromPool('porcelain-hat'),
    cloneFromPool('wasabi-tee'),
  ],
  'track-pants': [
    cloneFromPool('tracksuit'),
    cloneFromPool('forest-hills-hat'),
    cloneFromPool('gala-tshirt'),
  ],
  'track-top': [
    cloneFromPool('tracksuit'),
    cloneFromPool('porcelain-hat'),
    cloneFromPool('first-edition-tee'),
  ],
};

export function getFBTForPage(slug?: string): FBTProduct[] {
  if (!slug) return defaultFBT;

  const explicit = FBT_BY_PAGE[slug];
  if (explicit && explicit.length) {
    const ordered = orderByKey(explicit, slug);
    return ordered.slice(0, Math.min(FALLBACK_COUNT, ordered.length));
  }

  return buildFallback(slug);
}

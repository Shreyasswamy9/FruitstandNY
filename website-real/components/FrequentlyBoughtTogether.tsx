"use client";
import Image from "next/image";
import React from "react";

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
    <div style={{ minHeight: '100vh', scrollSnapAlign: 'start', display: 'flex', alignItems: 'center', background: '#fbf6f0' }} className="py-12 px-4">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Bought Together</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-lg font-bold text-gray-800 mb-4">${item.price}</p>
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
            Add All to Cart - Save 15%
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;

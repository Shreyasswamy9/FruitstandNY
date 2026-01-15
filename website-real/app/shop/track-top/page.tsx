"use client";
import FrequentlyBoughtTogether, { FBTProduct, getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import SizeGuide from "@/components/SizeGuide";
import CustomerReviews from "@/components/CustomerReviews";
import Price from '@/components/Price';
import React, { useState, useCallback } from "react";
import { useCart } from "../../../components/CartContext";
import ColorPicker from '@/components/ColorPicker';
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";

type TrackTopColorOption = {
  name: string;
  slug: string;
  color: string;
  images: string[];
  bg: string;
  border?: string;
};

const COLOR_DATA: TrackTopColorOption[] = [
  { name: "Elmhurst Taro Custard", slug: "elmhurst-taro-custard", color: "#8271c2", images: ["/images/products/Track Top/ELMHURST TARO CUSTARD/J6.png"], bg: "#eee9ff", border: "2px solid #d1c8f3" },
  { name: "Greenpoint Patina Crew", slug: "greenpoint-patina-crew", color: "#58543a", images: ["/images/products/Track Top/Greenpoint Patina Crew/J1.png"], bg: "#f1f0e6", border: "2px solid #d2cfba" },
  { name: "Noho Napoletanos", slug: "noho-napoletanos", color: "#ab8c65", images: ["/images/products/Track Top/NOHO NAPOLETANOS/J7.png"], bg: "#f4ecdf", border: "2px solid #e1d2b8" },
  { name: "The Factory Floor", slug: "the-factory-floor", color: "#1e2744", images: ["/images/products/Track Top/THE FACTORY FLOOR/J4.png"], bg: "#e6e9f4", border: "2px solid #c2c8da" },
  { name: "Vice City Runners", slug: "vice-city-runners", color: "#fddde9", images: ["/images/products/Track Top/VICE CITY RUNNERS/J3.png"], bg: "#fff0f6", border: "2px solid #f7c2d8" },
  { name: "Victory Liberty Club", slug: "victory-liberty-club", color: "#7a273b", images: ["/images/products/Track Top/Victory Liberty Club/J2.png"], bg: "#f4dde4", border: "2px solid #e6b8c7" },
  { name: "Yorkville Black and White Cookies", slug: "yorkville-black-and-white-cookies", color: "#000000", images: ["/images/products/Track Top/YORKVILLE BLACK AND WHITE COOKIES/J5.png"], bg: "#f5f5f5", border: "2px solid #d4d4d4" },
];

const PRODUCT = {
  name: "Retro Track Jacket",
  price: 110,
  description: "Inspired by classic New York athletic warm-ups, this track jacket features bold color blocking and a relaxed, vintage silhouette designed for movement and comfort. Each colorway pays homage to various motifs, with contrasting panels and an embroidered FRUITSTAND® logo across the chest.",
  details: [
    "100% Nylon shell",
    "Full-zip front with stand collar",
    "Inner mesh lining",
    "Ribbed cuffs and hem",
    "Two front pockets",
    "Relaxed fit",
    "Made in Sialkot, Pakistan",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

export default function TrackTopPage() {
  const colorOptions = COLOR_DATA;
  const [selectedColor, setSelectedColor] = useState<TrackTopColorOption>(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState(colorOptions[0].images[0]);
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[0]);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);

  const handleSelectColor = useCallback((option: TrackTopColorOption, ctx?: { image?: string }) => {
    setSelectedColor(option);
    setSelectedImage(prev => ctx?.image ?? option.images?.[0] ?? prev);
    if (typeof window !== 'undefined' && option.slug) {
      const basePath = window.location.pathname.split('?')[0];
      window.history.replaceState(null, '', `${basePath}?color=${option.slug}`);
    }
  }, []);

  const handleImageChange = useCallback((image: string) => {
    setSelectedImage(image);
  }, []);
  const handleAddToCart = () => {
    addToCart({
      productId: `track-top-${selectedColor.slug}`,
      name: `${PRODUCT.name} - ${selectedColor.name}`,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  // Example: fetch or compute FBT products dynamically in the future
  const boughtTogetherItems: FBTProduct[] = getFBTForPage('track-top');

  return (
    <div>
      <ProductPageBrandHeader />
      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4" style={{ paddingTop: 120 }}>
        <ProductImageGallery
          productName={PRODUCT.name}
          options={colorOptions}
          selectedOption={selectedColor}
          selectedImage={selectedImage}
          onOptionChange={(option, ctx) => handleSelectColor(option as TrackTopColorOption, ctx)}
          onImageChange={handleImageChange}
          className="md:w-1/2"
          frameBackground={selectedColor.bg}
          frameBorderStyle={selectedColor.border}
        />
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name} <span className="text-base font-medium text-gray-500">/ {selectedColor.name}</span></h1>
          {/* Color Picker */}
          <ColorPicker
            options={colorOptions as any}
            selectedName={selectedColor.name}
            onSelect={(opt) => {
              handleSelectColor(opt as TrackTopColorOption);
            }}
          />
          {/* Size Selection */}
          <div style={{ marginBottom: 18 }}>
            <p className="text-sm font-medium text-gray-700 mb-3">Size:</p>
            <div className="size-single-line">
              {PRODUCT.sizes.map((size) => (
                <button key={size} className={`size-button px-3 rounded-lg font-semibold border-2 transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50'}`} onClick={() => setSelectedSize(size)} type="button">{size}</button>
              ))}
            </div>
          <div className="mt-2"><SizeGuide productSlug="track-top" imagePath="/images/size-guides/Size Guide/Track Jacket.png" /></div>
          </div>
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
          <div className="text-2xl font-semibold mb-6"><Price price={PRODUCT.price} /></div>
          <button className={`bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2 ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleAddToCart}>
            {!selectedSize ? 'Pick a size to add to cart' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Section 2: Frequently Bought Together */}
      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={(product) => {
          addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            size: selectedSize,
          });
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 1500);
        }}
        onAddAllToCart={(products) => {
          products.forEach(product => {
            addToCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
              size: selectedSize,
            });
          });
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 1500);
        }}
      />
      {/* Section 3: Customer Reviews */}
      <div
        style={{
          scrollSnapAlign: 'start',
          display: 'flex',
          alignItems: 'center',
          background: '#fbf6f0'
        }}
        className="py-12 px-4"
      >
        <div className="max-w-4xl mx-auto w-full">
          <CustomerReviews productId="track-top" />
        </div>
      </div>

      {/* Minimalistic cart taskbar at bottom if cart has items */}
      {items.length > 0 && !showPopup && (
        <div
          className="fixed left-0 right-0 bottom-0 z-50 bg-black text-white px-2 py-3 md:px-4 md:py-4 flex items-center justify-between"
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)', borderBottom: 'none' }}
        >
          <span className="font-medium text-sm md:text-base">Cart</span>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="inline-block bg-white text-black rounded px-2 py-1 md:px-3 font-bold text-sm md:text-base">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
            <a
              href="/cart"
              className="ml-1 md:ml-2 px-3 py-2 md:px-4 md:py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 text-xs md:text-base"
              style={{ textDecoration: 'none' }}
            >
              Head to Cart
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

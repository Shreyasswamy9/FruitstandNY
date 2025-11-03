"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";

const beigeHatImages = [
  "/images/beigehatfemale1.jpeg",
  "/images/beigehatsolo.jpeg"
];

const PRODUCT = {
  name: "Beige Hat",
  price: 40,
  description: "Neutral beige hat, versatile and stylish for any look.",
};

export default function BeigeHatPage() {
  const colorOptions = [
    { name: 'Beige', color: '#e5d1b8', image: '/images/beigehatfemale1.jpeg', bg: '#f7f3ed' },
    { name: 'White', color: '#fff', image: '/images/beigehatsolo.jpeg', bg: '#f8f8f8', border: '#bbb' },
  ];
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState(colorOptions[0].image);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  // Show popup and keep it visible
  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "denim-hat",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: beigeHatImages[0],
      quantity: 1,
      size: selectedSize,
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  // Handle adding items from "Frequently Bought Together" section
  const handleAddBoughtTogetherItem = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      size: "M", // Default size for bought together items
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  // Handle adding all items from "Frequently Bought Together" section
  const handleAddAllToCart = () => {
    boughtTogetherItems.forEach(item => {
      addToCart({
        productId: item.id,
        name: item.name,
        price: item.price * 0.85, // 15% discount
        image: item.image,
        quantity: 1,
        size: "M", // Default size for bought together items
      });
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  // Height of the taskbar (matches py-3 + px-2, but add extra for safety)
  const taskbarHeight = items.length > 0 && !showPopup ? 64 : 0;

  // Sample data for "bought together" items
  const boughtTogetherItems = [
    { id: 'classic-tee', name: 'Classic Tee', price: 25, image: '/images/classicteemale1.jpeg' },
    { id: 'white-hat', name: 'White Hat', price: 18, image: '/images/beigehatfemale1.jpeg' },
    { id: 'tracksuit', name: 'Tracksuit', price: 45, image: '/images/B&Wtracksuitmale1.jpeg' },
  ];

  // Sample customer reviews
  const customerReviews = [
    {
      id: 1,
      name: 'Sarah M.',
      rating: 5,
      review: 'Perfect fit and great quality! The denim material feels premium and the hat looks exactly like the photos.',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Mike R.',
      rating: 4,
      review: 'Really comfortable and stylish. Goes well with any outfit. Shipping was fast too!',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'Emma K.',
      rating: 5,
      review: 'Love this hat! The blue color is beautiful and it fits perfectly. Definitely recommending to friends.',
      date: '3 weeks ago'
    },
  ];

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      {/* Go Back button - top center to avoid overlap with logo (left) and menu (right) */}
      <span
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Go back button clicked');
          try {
            router.back();
          } catch (error) {
            console.log('Router.back failed, using window.history.back');
            window.history.back();
          }
        }}
        style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 16,
          color: '#232323',
          cursor: 'pointer',
          fontWeight: 500,
          zIndex: 10005,
          userSelect: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #e0e0e0',
          borderRadius: '20px',
          padding: '8px 16px',
          textDecoration: 'none',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          pointerEvents: 'auto',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
          e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.transform = 'translateX(-50%) translateY(0px)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
      >
        ← Go Back
      </span>
      
      {/* Section 1: Product Details */}
      <div
        className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4"
        style={{ 
          paddingBottom: taskbarHeight,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
      {/* Images */}
      <div className="flex flex-col gap-4 md:w-1/2">
               <div className="w-full rounded-lg overflow-hidden bg-white flex items-center justify-center" style={{ height: 600, minHeight: 600, position: 'relative' }}>
          <Image
            src={selectedImage}
            alt={PRODUCT.name}
            style={{ objectFit: "contain", background: "#fff" }}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            priority
          />
        </div>
        <div className="flex gap-2 justify-center">
          {beigeHatImages.map((img) => (
            <button
              key={img}
              onClick={() => setSelectedImage(img)}
              className={`relative w-16 h-16 rounded border ${selectedImage === img ? "ring-2 ring-black" : ""}`}
            >
              <Image src={img} alt="Beige Hat" fill style={{ objectFit: "contain", background: "#fff" }} />
            </button>
          ))}
        </div>
      </div>
  {/* Product Info */}
  <div className="md:w-1/2 flex flex-col justify-center">
  <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
        {/* Color Picker */}
  <div className="flex gap-3 mb-4 px-1" style={{ overflowX: 'auto', marginBottom: 24, paddingTop: 8, paddingBottom: 8, minHeight: 48 }}>
          {colorOptions.map((opt) => (
            <button
              key={opt.name}
              aria-label={opt.name}
              onClick={() => {
                setSelectedColor(opt);
                setSelectedImage(opt.image);
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: opt.color,
                border: selectedColor.name === opt.name ? '2px solid #232323' : (opt.border || '2px solid #fff'),
                outline: selectedColor.name === opt.name ? '2px solid #3B82F6' : 'none',
                boxShadow: selectedColor.name === opt.name ? '0 0 0 2px #3B82F6' : '0 1px 4px 0 rgba(0,0,0,0.07)',
                display: 'inline-block',
                cursor: 'pointer',
                marginRight: 4,
              }}
            />
          ))}
        </div>
        {/* Size Selection Buttons */}
        <div style={{ marginBottom: 18 }}>
          <p className="text-sm font-medium text-gray-700 mb-3">Size:</p>
          <div className="flex gap-2 flex-wrap">
            {sizeOptions.map((size) => (
              <button
                key={size}
                className={`px-4 py-2 rounded-lg font-semibold border-2 transition-all ${
                  selectedSize === size
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50'
                }`}
                style={{ minWidth: 48, fontSize: 14 }}
                onClick={() => setSelectedSize(size)}
                type="button"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <p className="text-lg text-gray-700 mb-4">{PRODUCT.description}</p>
        <div className="text-2xl font-semibold mb-6">${PRODUCT.price}</div>
        <button
          className={`bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2 ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          {!selectedSize ? 'Pick a size to add to cart' : 'Add to Cart'}
        </button>
        {/* Buy Now button removed as requested */}
      </div>
      </div>

      {/* Section 2: Items Bought Together */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: '#f8f9fa'
        }}
        className="py-12 px-4"
      >
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Bought Together</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {boughtTogetherItems.map((item) => (
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
                <button onClick={() => handleAddBoughtTogetherItem(item)} className="w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={handleAddAllToCart} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Add All to Cart - Save 15%
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Customer Reviews */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: '#ffffff'
        }}
        className="py-12 px-4"
      >
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Customer Reviews</h2>
          <div className="space-y-6">
            {customerReviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{review.name}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`text-lg ${index < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">{review.date}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.review}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
              View All Reviews
            </button>
          </div>
        </div>
      </div>

      {/* No add to cart popup or animation */}

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

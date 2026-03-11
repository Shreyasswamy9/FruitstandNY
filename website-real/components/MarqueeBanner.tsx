"use client";

import React from "react";

interface MarqueeBannerProps {
  items?: string[];
  speed?: number; // seconds for one full loop
  backgroundColor?: string;
  textColor?: string;
  separator?: string;
}

const defaultItems = [
  "FREE SHIPPING ON ORDERS OVER $75",
  "NEW ARRIVALS",
  "MADE FOR THE STREETS OF NEW YORK",
  "SHOP NOW",
  "FRUITSTAND NY",
];

export default function MarqueeBanner({
  items = defaultItems,
  speed = 30,
  backgroundColor = "#181818",
  textColor = "#ffffff",
  separator = "✦",
}: MarqueeBannerProps) {
  // Duplicate items so the loop looks seamless
  const allItems = [...items, ...items, ...items];

  return (
    <div
      className="marquee-banner w-full overflow-hidden"
      style={{ backgroundColor, borderTop: "1px solid #6ee86e", borderBottom: "1px solid #6ee86e" }}
    >
      <div
        className="marquee-track flex items-center whitespace-nowrap"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          willChange: "transform",
        }}
      >
        {allItems.map((item, i) => (
          <React.Fragment key={i}>
            <span
              className="text-[13px] font-black uppercase tracking-[0.22em] py-3 px-4"
              style={{ color: textColor, fontFamily: "Avenir Black, Avenir, Helvetica, Arial, sans-serif", WebkitTextStroke: "0.5px currentColor" }}
            >
              {item}
            </span>
            <span
              className="text-[10px] py-3 px-1"
              style={{ color: textColor, opacity: 0.5 }}
            >
              {separator}
            </span>
          </React.Fragment>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .marquee-track {
          display: inline-flex;
          width: max-content;
        }
      `}</style>
    </div>
  );
}

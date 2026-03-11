"use client";

export default function ProductPageBrandHeader() {
  return (
    <div
      className="fixed left-1/2 top-[22px] z-[10005] -translate-x-1/2 select-none"
      style={{ pointerEvents: "none" }}
    >
      {/* Blurred backdrop */}
      <div
        className="absolute rounded-full"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          top: "-12px",
          bottom: "-12px",
          left: "-3px",
          right: "-48px",
        }}
      />
      {/* Text */}
      <span
        className="relative uppercase text-[#181818] text-[24px] sm:text-[28px] md:text-[34px] lg:text-[40px] font-avenir-black"
        style={{
          letterSpacing: "0.12em",
          textRendering: "optimizeLegibility",
          fontWeight: 900,
        }}
      >
        FRUITSTAND
      </span>
    </div>
  );
}

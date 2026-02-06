"use client";

export default function ProductPageBrandHeader() {
  return (
    <div
      className="fixed left-0 top-0 z-[10005] w-full flex justify-center py-[20px] select-none uppercase text-[#181818] bg-[#fbf6f0]"
      style={{
        fontFamily: "var(--font-avenir-black)",
        letterSpacing: "0.12em",
        textRendering: "optimizeLegibility",
      }}
    >
      <div className="text-[24px] sm:text-[28px] md:text-[34px] lg:text-[40px]">
        FRUITSTAND
      </div>
    </div>
  );
}

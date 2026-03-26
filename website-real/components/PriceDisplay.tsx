"use client";

type PriceDisplayProps = {
  regularPrice: number;
  salePrice?: number;
  salePriceEffectiveDate?: string;
  className?: string;
};

export default function PriceDisplay({
  regularPrice,
  salePrice,
  // salePriceEffectiveDate kept in props for backwards compat but not used for display gating
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  salePriceEffectiveDate: _salePriceEffectiveDate,
  className = "mt-2 text-[26px] font-black text-[#1d1c19]",
}: PriceDisplayProps) {
  const showSalePrice = salePrice !== undefined && salePrice < regularPrice;

  if (!showSalePrice) {
    return <p className={className}>${regularPrice}</p>;
  }

  return (
    <p className={className}>
      <span className="line-through mr-2 text-gray-500" style={{ textDecorationThickness: '2px' }}>${regularPrice}</span>
      <span className="font-semibold">${salePrice}</span>
    </p>
  );
}

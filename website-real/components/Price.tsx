import React from 'react';

type PriceProp = {
  price: number | string;
  salePrice?: number | string | null;
  className?: string;
  strikeColor?: string;
};

const toNumber = (v: number | string) => {
  if (typeof v === 'number') return v;
  const n = Number(String(v).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

const format = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Price({ price, salePrice, className, strikeColor }: PriceProp) {
  const p = toNumber(price);
  const s = salePrice != null ? toNumber(salePrice) : NaN;

  if (!Number.isFinite(p)) {
    // fallback to raw string
    return <span className={className}>{String(price)}</span>;
  }

  if (Number.isFinite(s) && s < p) {
    return (
      <span className={className}>
        <span style={{ textDecoration: 'line-through', color: strikeColor || '#6b7280', marginRight: 8 }}>{format(p)}</span>
        <span style={{ fontWeight: 700, color: '#111827' }}>{format(s)}</span>
      </span>
    );
  }

  return <span className={className}>{format(p)}</span>;
}

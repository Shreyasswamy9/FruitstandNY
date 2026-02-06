# Tracking Pixels Setup & Usage

## Environment Variables

Add these to your `.env.local`:

```bash
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id_here
NEXT_PUBLIC_TIKTOK_PIXEL_ID=your_tiktok_pixel_id_here
```

## What's Installed

### 1. TrackingPixels Component
- **Location**: `app/components/TrackingPixels.tsx`
- **Mounted in**: `app/layout.tsx` (ONCE, globally)
- **Behavior**: Only loads in production (`NODE_ENV === "production"`)
- **Tracks**: PageView automatically on all pages

### 2. Analytics Helpers
- **Location**: `lib/analytics/pixels.ts`
- **Functions**:
  - `trackPurchase({ value, currency, orderId })`
  - `trackAddToCart({ value, currency, productId })`
  - `trackViewContent({ value, currency, productId })`
  - `trackInitiateCheckout({ value, currency })`

## Usage Examples

### Track Purchase (Order Confirmation Page)

```tsx
"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics/pixels";

export default function OrderSuccessPage({ orderId, total }) {
  useEffect(() => {
    // Automatically guarded against double-firing on refresh
    trackPurchase({
      value: total,
      currency: "USD",
      orderId: orderId,
    });
  }, [orderId, total]);

  return (
    <div>
      <h1>Thank you for your order!</h1>
      <p>Order ID: {orderId}</p>
    </div>
  );
}
```

### Track Add to Cart

```tsx
"use client";

import { trackAddToCart } from "@/lib/analytics/pixels";

export default function ProductPage({ product }) {
  const handleAddToCart = () => {
    // Add to cart logic...
    
    // Track event
    trackAddToCart({
      value: product.price,
      currency: "USD",
      productId: product.id,
    });
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

### Track Product View

```tsx
"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/analytics/pixels";

export default function ProductPage({ product }) {
  useEffect(() => {
    trackViewContent({
      value: product.price,
      currency: "USD",
      productId: product.id,
    });
  }, [product.id, product.price]);

  return <div>{/* product details */}</div>;
}
```

### Track Checkout Initiation

```tsx
"use client";

import { useEffect } from "react";
import { trackInitiateCheckout } from "@/lib/analytics/pixels";

export default function CheckoutPage({ cartTotal }) {
  useEffect(() => {
    trackInitiateCheckout({
      value: cartTotal,
      currency: "USD",
    });
  }, [cartTotal]);

  return <div>{/* checkout form */}</div>;
}
```

## Important Notes

1. **Production Only**: All tracking only fires when `NODE_ENV === "production"`
2. **No Double-Firing**: `trackPurchase` uses sessionStorage to prevent duplicate events on page refresh
3. **Client-Only**: All helpers check for `window` before accessing `fbq` or `ttq`
4. **SSR Safe**: TrackingPixels component is "use client" and won't break server rendering
5. **No Hardcoding**: Pixel IDs come from environment variables only

## Testing

In development, pixels won't fire. To test:
1. Build for production: `npm run build`
2. Run production server: `npm start`
3. Open browser console and check for `fbq` and `ttq` on `window`
4. Verify events fire when calling tracking functions

## Verification

After deployment, verify in:
- **Meta Events Manager**: Check if PageView and custom events are received
- **TikTok Events Manager**: Check if PageView and CompletePayment events are tracked

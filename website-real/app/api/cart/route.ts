import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/supabase-client';
import { SupabaseCartService, SupabaseProductService } from '@/lib/services/supabase';
import { validateCartStock } from '@/lib/stock/validateStock';

const normalizeToken = (value: string | null | undefined): string => {
  if (!value) return '';
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const COLOR_ALIASES: Record<string, string> = {
  onyx: 'black',
  noir: 'black',
  stone: 'grey',
  gray: 'grey',
};

const canonicalColorToken = (value: string | null | undefined): string => {
  const token = normalizeToken(value);
  return COLOR_ALIASES[token] ?? token;
};

const matchesSize = (variantSize: string | null | undefined, requestedSize: string): boolean => {
  if (!variantSize) return false;
  return variantSize.trim().toLowerCase() === requestedSize.trim().toLowerCase();
};

const matchesColor = (variantColor: string | null | undefined, requestedColor: string): boolean => {
  if (!variantColor) return false;

  const left = variantColor.trim().toLowerCase();
  const right = requestedColor.trim().toLowerCase();
  if (left === right) return true;

  return canonicalColorToken(variantColor) === canonicalColorToken(requestedColor);
};

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    // Get user from auth (optional for guest users)
    let userId = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }
    
    const sessionId = request.headers.get('x-session-id');

    if (!userId && !sessionId) {
      console.warn('GET /api/cart missing user and sessionId');
      return NextResponse.json(
        { success: false, error: 'Authentication or session ID required' },
        { status: 400 }
      );
    }

    const cart = await SupabaseCartService.getCart(userId || undefined, sessionId || undefined);

    return NextResponse.json({
      success: true,
      data: cart || { cart_items: [] }
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    // Get user from auth (optional for guest users)
    let userId = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }
    
    const sessionId = request.headers.get('x-session-id');

    if (!userId && !sessionId) {
      console.warn('POST /api/cart missing user and sessionId');
      return NextResponse.json(
        { success: false, error: 'Authentication or session ID required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { productId, quantity, size, color, variantId } = body;

    // Validate required fields
    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Product ID and valid quantity required' },
        { status: 400 }
      );
    }

    // Get product details
    const product = await SupabaseProductService.getProduct(productId);
    console.debug('Product fetched for addToCart:', { productId, product });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Support multiple possible field names from schema
    const isActive = product.is_active ?? product.active ?? true;
    const price = Number(product.price ?? product.unit_price ?? 0);
    const enableStockTracking = product.enable_stock_tracking ?? true;

    // Detailed checks with logs
    if (!isActive) {
      console.warn('Product inactive:', productId, { isActive });
      return NextResponse.json(
        { success: false, error: 'Product not available' },
        { status: 400 }
      );
    }

    // Check variant-level stock when a variantId is provided or when size/color can identify a variant
    let resolvedVariantId: string | undefined = variantId || undefined;
    
    // Skip stock validation if stock tracking is disabled for this product
    if (enableStockTracking) {
      // Try to resolve variant by variantId first, then by size+color lookup
      let variantToCheck: { id: string; stock_quantity: number; is_available: boolean } | null = null;

      if (variantId) {
        const { data } = await supabase
          .from('product_variants')
          .select('id, stock_quantity, is_available')
          .eq('id', variantId)
          .maybeSingle();
        variantToCheck = data;
        if (!variantToCheck) {
          return NextResponse.json(
            { success: false, error: 'Selected variant is unavailable' },
            { status: 409 }
          );
        }
      } else if (size || color) {
        // Resolve variants with normalized matching so PDP display labels and DB values
        // (e.g., Onyx vs Black) still map to the correct row.
        const { data: variants, error: variantsError } = await supabase
          .from('product_variants')
          .select('id, size, color, stock_quantity, is_available')
          .eq('product_id', productId);

        if (variantsError) {
          console.error('Error loading product variants for cart validation', variantsError);
          return NextResponse.json(
            { success: false, error: 'Failed to validate inventory' },
            { status: 500 }
          );
        }

        if (variants && variants.length > 0) {
          const matches = variants.filter((v) => {
            if (size && !matchesSize(v.size, size)) return false;
            if (color && !matchesColor(v.color, color)) return false;
            return true;
          });

          if (matches.length === 0) {
            const hasSizedVariants = size ? variants.some((v) => Boolean(v.size)) : false;
            const hasColorVariants = color ? variants.some((v) => Boolean(v.color)) : false;

            if (hasSizedVariants || hasColorVariants) {
              return NextResponse.json(
                { success: false, error: 'Selected variant is unavailable' },
                { status: 409 }
              );
            }
          } else {
            const exactRaw = matches.find((v) => {
              const sameSize = !size || (v.size ?? '').trim().toLowerCase() === size.trim().toLowerCase();
              const sameColor = !color || (v.color ?? '').trim().toLowerCase() === color.trim().toLowerCase();
              return sameSize && sameColor;
            });

            const picked = exactRaw ?? matches[0];
            variantToCheck = {
              id: picked.id,
              stock_quantity: Number(picked.stock_quantity) || 0,
              is_available: Boolean(picked.is_available),
            };
            resolvedVariantId = picked.id;
          }
        }
      }

      if (variantToCheck) {
        if (!variantToCheck.is_available || variantToCheck.stock_quantity <= 0 || variantToCheck.stock_quantity < quantity) {
          console.warn('Insufficient variant inventory', { variantId: variantToCheck.id, stock: variantToCheck.stock_quantity, requested: quantity });
          return NextResponse.json(
            { success: false, error: 'Insufficient inventory' },
            { status: 400 }
          );
        }
      } else {
        // No variant found — fall back to product-level stock check
        const inventoryQty = Number(product.stock_quantity ?? product.inventory_quantity ?? product.quantity ?? 0);
        if (inventoryQty < quantity) {
          console.warn('Insufficient inventory', { productId, inventoryQty, requested: quantity });
          return NextResponse.json(
            { success: false, error: 'Insufficient inventory' },
            { status: 400 }
          );
        }
      }
    }

    // Get or create cart
    let cart = await SupabaseCartService.getCart(userId || undefined, sessionId || undefined);

    if (!cart) {
      cart = await SupabaseCartService.createCart(userId || undefined, sessionId || undefined);
      console.debug('Created new cart', { cart });
    }

    // Add item to cart
    let cartItem;
    try {
      cartItem = await SupabaseCartService.addToCart(cart.id, {
        product_id: productId,
        variant_id: resolvedVariantId,
        quantity,
        size,
        color,
        price
      });
    } catch (svcErr) {
      console.error('SupabaseCartService.addToCart error:', svcErr);
      return NextResponse.json(
        { success: false, error: 'Failed to add item to cart (service error)' },
        { status: 500 }
      );
    }

    // Verify returned cartItem
    if (!cartItem) {
      console.error('addToCart returned no item', { cartId: cart.id, productId });
      return NextResponse.json(
        { success: false, error: 'Failed to add item to cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cartItem
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// PUT /api/cart - Update cart item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity < 0) {
      return NextResponse.json(
        { success: false, error: 'Item ID and valid quantity required' },
        { status: 400 }
      );
    }

    if (quantity === 0) {
      // Remove item
      await SupabaseCartService.removeFromCart(itemId);
      return NextResponse.json({ success: true, message: 'Item removed' });
    }

    // Validate new cumulative quantity against live stock before updating.
    // Fetch the existing cart item to know which product/variant is being updated.
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('product_id, variant_id, size, color')
      .eq('id', itemId)
      .maybeSingle();

    if (existingItem) {
      const stockCheck = await validateCartStock([
        {
          productId: existingItem.product_id,
          variantId: existingItem.variant_id ?? null,
          size: existingItem.size ?? null,
          color: existingItem.color ?? null,
          quantity,
        },
      ]);
      if (!stockCheck.valid) {
        const available = stockCheck.errors[0]?.available ?? 0;
        console.warn('PUT /api/cart: Stock check failed for item update', stockCheck.errors);
        return NextResponse.json(
          {
            success: false,
            error: available > 0
              ? `Only ${available} unit${available === 1 ? '' : 's'} available`
              : 'Item is out of stock',
          },
          { status: 409 },
        );
      }
    }

    // Update quantity
    const cartItem = await SupabaseCartService.updateCartItem(itemId, quantity);
    return NextResponse.json({
      success: true,
      data: cartItem
    });

  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart or remove item
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemId = searchParams.get('itemId');

    if (itemId) {
      // Remove specific item
      await SupabaseCartService.removeFromCart(itemId);
      return NextResponse.json({ success: true, message: 'Item removed' });
    } else {
      // Clear entire cart
      // Get user from auth (optional for guest users)
      let userId = null;
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      }
      
      const sessionId = request.headers.get('x-session-id');

      if (!userId && !sessionId) {
        return NextResponse.json(
          { success: false, error: 'Authentication or session ID required' },
          { status: 400 }
        );
      }

      const cart = await SupabaseCartService.getCart(userId || undefined, sessionId || undefined);
      
      if (cart) {
        await SupabaseCartService.clearCart(cart.id);
      }

      return NextResponse.json({ success: true, message: 'Cart cleared' });
    }

  } catch (error) {
    console.error('Error deleting from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete from cart' },
      { status: 500 }
    );
  }
}
// Updated Supabase services to match your existing schema
import { supabase } from '@/app/supabase-client';
import { createClient } from '@supabase/supabase-js';

// Create service role client for admin operations
// Fallback to regular client if service role key is not set (development mode)
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY &&
  process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your_service_role_key_here'
  ? createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  : supabase; // Fallback to regular client for development

// Types matching your existing schema
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category_id?: string;
  stripe_price_id?: string;
  stripe_product_id?: string;
  image_url: string;
  hover_image_url?: string;
  is_active: boolean;
  featured: boolean;
  stock_quantity: number;
  material?: string;
  care_instructions?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  product_variants?: ProductVariant[];
  product_images?: Array<{
    id: string;
    url: string;
    alt_text?: string;
    is_primary: boolean;
  }>;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  stripe_price_id?: string;
  size?: string;
  color?: string;
  color_hex?: string;
  gender?: string;
  sku?: string;
  stock_quantity: number;
  price_adjustment: number;
  is_available: boolean;
  variant_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: string;
  user_id?: string;
  session_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  // Joined data
  product?: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  user_id?: string;
  order_number: string;
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
  status: string;
  payment_status: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  shipping_name: string;
  shipping_email: string;
  shipping_phone?: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  tracking_number?: string;
  carrier?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_name: string;
  product_image_url?: string;
  variant_details?: {
    size?: string;
    color?: string;
    [key: string]: string | undefined;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

// Product Service
export class SupabaseProductService {
  static async getProducts(options: {
    category_id?: string;
    featured?: boolean;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  } = {}) {
    let query = supabase
      .from('products')
      .select(`
        *,
        product_variants (*),
        product_images (*)
      `);

    if (options.category_id) {
      query = query.eq('category_id', options.category_id);
    }
    if (options.featured !== undefined) {
      query = query.eq('featured', options.featured);
    }
    if (options.is_active !== undefined) {
      query = query.eq('is_active', options.is_active);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as Product[];
  }

  static async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants (*),
        product_images (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Product;
  }

  static async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants (*),
        product_images (*)
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as Product;
  }
}

// Cart Service
export class SupabaseCartService {
  static async getOrCreateCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId is required');
    }

    // First try to find existing cart
    let query = supabase.from('carts').select(`
      *,
      cart_items (
        *,
        product:products (*),
        variant:product_variants (*)
      )
    `);

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('session_id', sessionId);
    }

    const { data: existingCart } = await query.single();

    if (existingCart) {
      return existingCart as Cart & { cart_items: CartItem[] };
    }

    // Create new cart if none exists
    const cartData: Partial<Cart> = {};
    if (userId) {
      cartData.user_id = userId;
    } else {
      cartData.session_id = sessionId;
    }

    const { data: newCart, error } = await supabase
      .from('carts')
      .insert(cartData)
      .select()
      .single();

    if (error) throw error;

    return { ...newCart, cart_items: [] } as Cart & { cart_items: CartItem[] };
  }

  static async addToCart(cartId: string, item: {
    product_id: string;
    variant_id?: string;
    quantity: number;
  }) {
    // Check if item already exists
    let query = supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId)
      .eq('product_id', item.product_id);

    if (item.variant_id) {
      query = query.eq('variant_id', item.variant_id);
    } else {
      query = query.is('variant_id', null);
    }

    const { data: existingItem } = await query.single();

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + item.quantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) throw error;
      return data as CartItem;
    } else {
      // Add new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ cart_id: cartId, ...item })
        .select()
        .single();

      if (error) throw error;
      return data as CartItem;
    }
  }

  static async updateCartItem(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data as CartItem;
  }

  static async removeFromCart(itemId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  }

  static async clearCart(cartId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cartId);

    if (error) throw error;
  }
}

// Order Service
export class SupabaseOrderService {
  static async getOrders(userId: string, options: {
    limit?: number;
    offset?: number;
  } = {}) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Order[];
  }

  static async getOrder(id: string, userId?: string) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error) throw error;
    return data as Order;
  }

  static async createOrder(orderData: {
    user_id?: string;
    stripe_payment_intent_id?: string;
    stripe_checkout_session_id?: string;
    status?: string;
    payment_status?: string;
    total_amount: number;
    subtotal: number;
    tax_amount?: number;
    shipping_amount?: number;
    discount_amount?: number;
    shipping_name: string;
    shipping_email: string;
    shipping_phone?: string;
    shipping_address_line1: string;
    shipping_address_line2?: string;
    shipping_city: string;
    shipping_state: string;
    shipping_postal_code: string;
    shipping_country: string;
    notes?: string;
    items: Array<{
      product_id: string;
      variant_id?: string;
      product_name: string;
      product_image_url?: string;
      variant_details?: {
        size?: string;
        color?: string;
        [key: string]: string | undefined;
      };
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
  }) {
    // Use admin client to bypass RLS for order creation
    const { items, ...order } = orderData;

    const { data: newOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map(item => ({
      order_id: newOrder.id,
      ...item
    }));

    const { data: newOrderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)
      .select();

    if (itemsError) throw itemsError;

    return { ...newOrder, order_items: newOrderItems } as Order & { order_items: OrderItem[] };
  }

  static async updateOrderStatus(id: string, status: string) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  }

  static async updatePaymentStatus(id: string, payment_status: string) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ payment_status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  }

  static async updateOrderWithShipping(id: string, updateData: {
    shipping_name?: string;
    shipping_email?: string;
    shipping_phone?: string | null;
    shipping_address_line1?: string;
    shipping_address_line2?: string | null;
    shipping_city?: string;
    shipping_state?: string;
    shipping_postal_code?: string;
    shipping_country?: string;
    payment_status?: string;
    status?: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  }

  static async getOrderByStripeSession(stripeSessionId: string) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('stripe_checkout_session_id', stripeSessionId)
      .single();

    if (error) throw error;
    return data as Order;
  }

  static async getOrderByPaymentIntent(paymentIntentId: string) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (error) throw error;
    return data as Order;
  }
}
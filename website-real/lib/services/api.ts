import { 
  SupabaseProductService, 
  Product,
  Cart,
  CartItem,
  Order
} from '@/lib/services/supabase-existing';
import { supabase } from '@/app/supabase-client';

// Utility function to get auth headers with Supabase token
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Get current session and add Authorization header
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  return headers;
}

// Utility function to get session headers
function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  
  // Add session ID for guest users
  if (typeof window !== 'undefined') {
    const sessionId = getSessionId();
    if (sessionId) {
      headers['x-session-id'] = sessionId;
    }
  }

  return headers;
}

function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  
  let sessionId = localStorage.getItem('guest-session-id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('guest-session-id', sessionId);
  }
  return sessionId;
}

// API service functions using Supabase
export class ProductService {
  static async getProducts(options: {
    category_id?: string;
    featured?: boolean;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  } = {}) {
    return SupabaseProductService.getProducts(options);
  }

  static async getProduct(id: string) {
    return SupabaseProductService.getProduct(id);
  }

  static async getProductBySlug(slug: string) {
    return SupabaseProductService.getProductBySlug(slug);
  }
}

export class CartService {
  static async getCart() {
    const authHeaders = await getAuthHeaders();
    const sessionHeaders = getSessionHeaders();
    
    const response = await fetch('/api/cart', {
      headers: {
        ...authHeaders,
        ...sessionHeaders,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    const result = await response.json();
    return result.data;
  }

  static async addToCart(item: {
    productId: string;
    variantId?: string;
    quantity: number;
  }) {
    const authHeaders = await getAuthHeaders();
    const sessionHeaders = getSessionHeaders();
    
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        ...authHeaders,
        ...sessionHeaders,
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }

    return response.json();
  }

  static async updateCartItem(itemId: string, quantity: number) {
    const authHeaders = await getAuthHeaders();
    const sessionHeaders = getSessionHeaders();
    
    const response = await fetch('/api/cart', {
      method: 'PUT',
      headers: {
        ...authHeaders,
        ...sessionHeaders,
      },
      body: JSON.stringify({ itemId, quantity }),
    });

    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }

    return response.json();
  }

  static async removeFromCart(itemId: string) {
    const authHeaders = await getAuthHeaders();
    const sessionHeaders = getSessionHeaders();
    
    const response = await fetch(`/api/cart?itemId=${itemId}`, {
      method: 'DELETE',
      headers: {
        ...authHeaders,
        ...sessionHeaders,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }

    return response.json();
  }

  static async clearCart() {
    const authHeaders = await getAuthHeaders();
    const sessionHeaders = getSessionHeaders();
    
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        ...authHeaders,
        ...sessionHeaders,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }

    return response.json();
  }
}

export class OrderService {
  static async getOrders(page = 1, limit = 10) {
    const authHeaders = await getAuthHeaders();
    
    const response = await fetch(`/api/orders?page=${page}&limit=${limit}`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  }

  static async getOrder(id: string) {
    const authHeaders = await getAuthHeaders();
    
    const response = await fetch(`/api/orders/${id}`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }

    return response.json();
  }

  static async createOrder(orderData: {
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
    stripePaymentIntentId?: string;
    stripeCheckoutSessionId?: string;
  }) {
    const authHeaders = await getAuthHeaders();
    const sessionHeaders = getSessionHeaders();
    
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        ...authHeaders,
        ...sessionHeaders,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return response.json();
  }
}

export class AuthService {
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }
}

export class TicketService {
  static async getTickets() {
    const authHeaders = await getAuthHeaders();
    
    const response = await fetch('/api/tickets', {
      method: 'GET',
      headers: authHeaders,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return response.json();
  }

  static async createTicket(ticketData: {
    subject: string;
    description: string;
    category: string;
    priority?: string;
  }) {
    const authHeaders = await getAuthHeaders();
    
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      throw new Error('Failed to create ticket');
    }

    return response.json();
  }
}

// Export types
export type { Product, Cart, CartItem, Order };

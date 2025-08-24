import { IProduct } from '@/database/Product';
import { IShippingAddress } from '@/database/Order';

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
  
  // Try to get from cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'guest-session-id') {
      return value;
    }
  }

  return null;
}

// API service functions
export class ProductService {
  private static baseUrl = '/api/products';

  static async getProducts(params?: {
    category?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.baseUrl}?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  }

  static async getProduct(id: string) {
    const response = await fetch(`${this.baseUrl}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return response.json();
  }

  static async createProduct(product: Partial<IProduct>) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return response.json();
  }

  static async updateProduct(id: string, updates: Partial<IProduct>) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return response.json();
  }

  static async deleteProduct(id: string) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    return response.json();
  }
}

export class CartService {
  private static baseUrl = '/api/cart';

  static async getCart() {
    const response = await fetch(this.baseUrl, {
      headers: getSessionHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    return response.json();
  }

  static async addToCart(productId: string, quantity: number, size?: string, color?: string) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getSessionHeaders(),
      },
      body: JSON.stringify({ productId, quantity, size, color }),
    });

    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }

    return response.json();
  }

  static async updateCartItem(productId: string, quantity: number, size?: string, color?: string) {
    const response = await fetch(this.baseUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getSessionHeaders(),
      },
      body: JSON.stringify({ productId, quantity, size, color }),
    });

    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }

    return response.json();
  }

  static async clearCart() {
    const response = await fetch(this.baseUrl, {
      method: 'DELETE',
      headers: getSessionHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }

    return response.json();
  }
}

export class OrderService {
  private static baseUrl = '/api/orders';

  static async getOrders(page = 1, limit = 10) {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${this.baseUrl}?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  }

  static async getOrder(id: string) {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }

    return response.json();
  }

  static async createOrder(orderData: {
    email: string;
    shippingAddress: IShippingAddress;
    billingAddress?: IShippingAddress;
    paymentMethod: string;
    paymentId?: string;
  }) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getSessionHeaders(),
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
  static async register(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to register');
    }

    return response.json();
  }
}

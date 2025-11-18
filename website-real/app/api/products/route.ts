import { NextRequest, NextResponse } from 'next/server';
import { SupabaseProductService } from '@/lib/services/supabase-existing';

// GET /api/products - Get all products with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Support both `category` and `category_id` (normalized service expects category_id)
    const category_id = searchParams.get('category_id') || searchParams.get('category') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    // Normalized service expects `is_active`
    const is_active = searchParams.get('active') !== 'false'; // Default true to match previous behavior
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    const products = await SupabaseProductService.getProducts({
      category_id,
      featured,
      is_active,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: products.length
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST() {
  // Not implemented against the normalized service in this API route.
  // Prefer using an admin tool or direct Supabase admin service for product creation.
  return NextResponse.json(
    { success: false, error: 'Product creation not implemented in this route' },
    { status: 501 }
  );
}
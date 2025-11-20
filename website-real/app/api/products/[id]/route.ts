import { NextRequest, NextResponse } from 'next/server';
import { SupabaseProductService } from '@/lib/services/supabase-existing';

// GET /api/products/[id] - Get a specific product
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  void _request;
  try {
    const { id } = await params;
    const product = await SupabaseProductService.getProduct(id);

    return NextResponse.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    );
  }
}

// PUT /api/products/[id] - Update a product (admin only)
export async function PUT() {
  // Not implemented for normalized service here. Use an admin flow or direct Supabase admin service.
  return NextResponse.json(
    { success: false, error: 'Product update not implemented in this route' },
    { status: 501 }
  );
}

// DELETE /api/products/[id] - Delete a product (admin only)
export async function DELETE() {
  // Not implemented for normalized service here. Use an admin flow or direct Supabase admin service.
  return NextResponse.json(
    { success: false, error: 'Product deletion not implemented in this route' },
    { status: 501 }
  );
}
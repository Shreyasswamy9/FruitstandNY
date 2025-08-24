import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

// POST /api/admin/seed - Seed the database (Admin only)
export async function POST(request: NextRequest) {
  try {
    // In production, you should add proper authentication here
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.ADMIN_SEED_TOKEN || 'admin-seed-token';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await seedDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully'
    });

  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}

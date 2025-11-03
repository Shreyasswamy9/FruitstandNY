import { NextRequest, NextResponse } from 'next/server';
import { initializeBuckets } from '@/lib/storage';

// POST /api/admin/setup-storage - Initialize storage buckets (admin only)
export async function POST(request: NextRequest) {
  try {
    // This should only be called during setup or by admins
    // Add authentication check in production
    
    const results = await initializeBuckets();
    
    const summary = {
      total: results.length,
      created: results.filter(r => r.created).length,
      existing: results.filter(r => !r.created && !r.error).length,
      failed: results.filter(r => r.error).length
    };
    
    return NextResponse.json({
      success: true,
      message: 'Storage buckets initialized',
      summary,
      details: results
    });
    
  } catch (error) {
    console.error('Error initializing storage:', error);
    return NextResponse.json(
      { error: 'Failed to initialize storage buckets' },
      { status: 500 }
    );
  }
}

// GET /api/admin/setup-storage - Check bucket status
export async function GET() {
  try {
    // This endpoint can be used to check if buckets are properly set up
    return NextResponse.json({
      success: true,
      message: 'Use POST to initialize buckets',
      buckets: [
        'tickets - Support ticket attachments',
        'products - Product images (public)',
        'users - User profile pictures', 
        'orders - Order documents',
        'general - General file storage'
      ]
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check storage status' },
      { status: 500 }
    );
  }
}
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function createSuccessResponse<T>(
  data?: T,
  message?: string,
  pagination?: ApiResponse['pagination']
): ApiResponse<T> {
  return {
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message }),
    ...(pagination && { pagination })
  };
}

export function createErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    error
  };
}

export async function getCurrentUser() {
  try {
    const session = await getServerSession();
    return session?.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long' };
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { 
      valid: false, 
      error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    };
  }
  
  return { valid: true };
}

export function parseQueryParams(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100), // Max 100 items per page
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    search: searchParams.get('search'),
    category: searchParams.get('category'),
    featured: searchParams.get('featured') === 'true'
  };
}

export function calculatePagination(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1
  };
}

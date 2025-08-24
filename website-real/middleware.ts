import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  // Protect user account routes
  if (request.nextUrl.pathname.startsWith('/account')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  // Add session ID for guest users on cart/checkout routes
  if (request.nextUrl.pathname.startsWith('/api/cart') || 
      request.nextUrl.pathname.startsWith('/api/orders')) {
    
    const response = NextResponse.next();
    
    // If no user token, generate a session ID for guest cart
    if (!token) {
      let sessionId = request.cookies.get('guest-session-id')?.value;
      
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        response.cookies.set('guest-session-id', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
      }
      
      response.headers.set('x-session-id', sessionId);
    }
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/api/cart/:path*',
    '/api/orders/:path*'
  ]
};

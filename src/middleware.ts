import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

// Pages that require authentication
const protectedRoutes = ['/profile', '/dashboard', '/settings'];
// Pages that are only accessible when NOT authenticated
const authRoutes = ['/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the authentication token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const isAuthenticated = !!token;
  
  // If the user is logged in and tries to access auth pages, redirect to home
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If the user is not logged in and tries to access protected pages, redirect to auth
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  return NextResponse.next();
} 
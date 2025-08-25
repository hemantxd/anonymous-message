import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'
export { default } from 'next-auth/middleware'

 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;

  if(token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify') ||
    url.pathname === '/'
  ) ){
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

// ✅ If user is NOT authenticated and trying to access protected routes
  // if (
  //   !token &&
  //   url.pathname.startsWith('/dashboard')
  // ) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  // ✅ Otherwise, allow access
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/sign-in',
    '/sign-up',
    '/verify/:path*',
    '/',
    '/dashboard/:path*',
    // "/((?!api/auth|_next|favicon.ico).*)"
  ]
}
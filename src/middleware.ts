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
    url.pathname.startsWith('/')
  ) ){
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.redirect(new URL('/home', request.url))
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
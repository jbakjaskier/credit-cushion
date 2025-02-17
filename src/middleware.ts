import { NextRequest, NextResponse } from 'next/server'

import { cookies } from 'next/headers'
import { decrypt } from './lib/auth/session'
 
// 1. Specify protected and public routes
const protectedRoutes = ['/products', '/api/auth/refresh', `/loans`]
const publicRoutes = ['/', '/hardship', '/unsupportedAccount']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isPublicRoute = publicRoutes.includes(path)
 
  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  // 4. Redirect to / if the user is not authenticated
  if (isProtectedRoute && !session?.userInfo?.sub) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  //5. Redirect to refresh token if required
  if(isProtectedRoute && 
    session?.userInfo?.sub !== undefined && 
    session?.accessTokenResponse?.expires_in !== undefined &&
    session.createdOn + session.accessTokenResponse.expires_in + 5000 < Date.now()) { //Refreshing the token 5 seconds before it expires
      return NextResponse.redirect(new URL(`/api/auth/refresh?redirectPath=${encodeURIComponent(req.nextUrl.pathname)}&redirectPathSearchParams=${encodeURIComponent(req.nextUrl.search)}`, req.nextUrl))
    }
  
    
  // 6. Redirect to /loans if the user is authenticated
  if (
    isPublicRoute &&
    session?.userInfo?.sub &&
    !req.nextUrl.pathname.startsWith('/loans')
  ) {
    return NextResponse.redirect(new URL('/loans', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
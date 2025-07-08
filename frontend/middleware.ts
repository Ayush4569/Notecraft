import { NextRequest, NextResponse } from "next/server";
const authRoutes = [/^\/login$/, /^\/signup$/, /^\/verifycode\/[^/]+$/]
export default async function (req: NextRequest) {

   const token = req.cookies.get('refreshToken')?.value;
   const pathname = req.nextUrl.pathname;
   const isDocumentRoute = pathname.startsWith('/documents')
   const isVerifyCodeRoute = pathname.startsWith('/verifycode');
   const authProtectedRoutes = authRoutes.some(route => route.test(pathname));

   if (authProtectedRoutes && token) {
      return NextResponse.redirect(new URL('/', req.url))
   }
   if(isVerifyCodeRoute && token){
      return NextResponse.redirect(new URL('/', req.url));
   }
   if(pathname.startsWith("/subscriptions") && !token){
      console.log("Redirecting to login from subscriptions route");
      
      return NextResponse.redirect(new URL('/login', req.url));
   }
   if (isDocumentRoute && !token) {
      return NextResponse.redirect(new URL('/login', req.url));
   }
   return NextResponse.next()
}
export const config = {
   matcher: ["/documents/:path*", "/verifycode/:path*", "/login", "/signup","/subscriptions"],
};
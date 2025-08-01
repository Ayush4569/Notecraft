import { NextRequest, NextResponse } from "next/server";
const authRoutes = [/^\/login$/, /^\/signup$/, /^\/verifycode\/[^/]+$/]
export default async function (req: NextRequest) {

   const token:string | undefined = req.cookies.get('refreshToken')?.value;
   const pathname:string = req.nextUrl.pathname;
   const isDocumentRoute:boolean = pathname.startsWith('/documents')
   const subscriptionRoute:boolean = pathname.startsWith("/subscriptions")
   const authProtectedRoutes:boolean = authRoutes.some(route => route.test(pathname));

   if (authProtectedRoutes && token) {
      return NextResponse.redirect(new URL('/', req.url))
   }
   if(subscriptionRoute && !token){
      return NextResponse.redirect(new URL('/login', req.url));
   }
   if (isDocumentRoute && !token) {
      return NextResponse.redirect(new URL('/login', req.url));
   }
   return NextResponse.next()
}
export const config = {
   matcher: ["/documents/:path*", "/verifycode/:path*", "/signup","/subscriptions"],
};
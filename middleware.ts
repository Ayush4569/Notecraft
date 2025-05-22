import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
const protectedRoutes = ["/documents"];
const authRoutes = [/^\/login$/, /^\/signup$/, /^\/verifycode\/[^/]+$/]
export default async function (req:NextRequest){

 const token = await getToken({req});
   const pathname = req.nextUrl.pathname;
 const isRouteProtected = protectedRoutes.some(route => pathname.startsWith(route));

 const authProtectedRoutes = authRoutes.some(route=> route.test(pathname));

 if(authProtectedRoutes && token){
    return NextResponse.redirect(new URL('/',req.url))
 }

 if(isRouteProtected && !token){
    return NextResponse.redirect(new URL('/login',req.url));
 }
 return NextResponse.next()
}
export const config = {
    matcher: ["/documents", "/verifycode/:path*", "/login", "/signup"],
};
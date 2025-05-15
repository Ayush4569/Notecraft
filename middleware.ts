import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
const protectedRoutes = ["/documents"];
const afterLoginProtectedRoutes = ["/login","/signup"]
export default async function (req:NextRequest){

 const token = await getToken({req});

 const isRouteProtected = protectedRoutes.some(route => req.nextUrl.pathname.includes(route));

 const isafterLoginProtectedRoutes = afterLoginProtectedRoutes.some(route=> req.nextUrl.pathname.includes(route));

 if(isafterLoginProtectedRoutes && token){
    return NextResponse.redirect(new URL('/',req.url))
 }

 if(isRouteProtected && !token){
    return NextResponse.redirect(new URL('/login',req.url));
 }
 return NextResponse.next()
}
export const config = {
    matcher: ["/documents"],
};
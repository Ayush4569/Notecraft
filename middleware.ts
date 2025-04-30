import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
const protectedRoutes = ["/"];
export default async function (req:NextRequest){


 const token = await getToken({req});

 const isRouteProtected = protectedRoutes.some(route => req.nextUrl.pathname.includes(route));

 if(isRouteProtected && !token){
    return NextResponse.redirect(new URL('/auth/login',req.url));
 }
 return NextResponse.next()
}
export const config = {
    matcher: ['/'],
};
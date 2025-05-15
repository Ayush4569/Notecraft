import { NextResponse,NextRequest } from "next/server";

export function GET(req:NextRequest){
    console.log('req',req);
    return NextResponse.json('Hello')
}
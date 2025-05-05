import { NextResponse, NextRequest } from "next/server";
import client from "@/db/index"
export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get('query')
    if (!email) {
        return NextResponse.json({
            message: "No such user"
        })
    }
    try {
        const user = await client.user.findFirst({
            where: {
                email
            }
        })
        return NextResponse.json({
            user
        })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occured"
        return NextResponse.json({
            message:"Internal server error",
            error:errorMessage
        })
    }
} 
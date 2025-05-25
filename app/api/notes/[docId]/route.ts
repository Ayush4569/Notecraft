import { NextRequest, NextResponse } from "next/server";
import client from "@/db/index"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id) {
        return NextResponse.json({
            success: false,
            message: 'Unauthorized'
        }, {
            status: 403
        })
    }
    try {
        const document = await client.document.findFirst({
            where:{
                userId:session.user.id,
                isTrashed:false,
            }
        })
        return NextResponse.json({
            success: true,
            message: 'Page fetched',
            notes: document
        }, {
            status: 200
        })
    } catch (error) {
        console.log('Error fetching page', error);
        return NextResponse.json({
            success: false,
            message: 'Error fetching page'
        }, {
            status: 500
        })

    }
}
import { NextRequest, NextResponse } from "next/server";
import client from "@/db/index"
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { Document } from "@/types/document";
export async function POST(req: NextRequest){
    const { title } = await req.json()
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
        const createdNote = await client.document.create(
            {
                data: {
                    title,
                    userId: session.user.id
                }
            }
        )
        return NextResponse.json({
            success: true,
            message: 'Note created',
            note: createdNote 
        }, {
            status: 200
        })
    } catch (error) {
        console.log('Error creating note', error);
        return NextResponse.json({
            success: false,
            message: 'Error creating note'
        }, {
            status: 500
        })

    }
}
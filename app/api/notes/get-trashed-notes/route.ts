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
        const trashedNotes = await client.document.findMany({
            where:{
                userId:session.user.id,
                isTrashed:true,
            },
            select:{
                id:true,
                title:true,
                parentId:true,
                icon:true,
            },
            orderBy:{
                createdAt:'desc'
            },
        })
        return NextResponse.json({
            success: true,
            message: 'Notes fetched',
            notes: trashedNotes
        }, {
            status: 200
        })
    } catch (error) {
        console.log('Error fetching trashed notes', error);
        return NextResponse.json({
            success: false,
            message: 'Error fetching trashed notes'
        }, {
            status: 500
        })
    }
}
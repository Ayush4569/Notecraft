import { NextRequest, NextResponse } from "next/server";
import client from "@/db/index"
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const {docId,childPageId} = await req.json()
    if (!session || !session.user.id) {
        return NextResponse.json({
            success: false,
            message: 'Unauthorized'
        }, {
            status: 403
        })
    }
    try {
        const updatedDocument = await client.document.update({
            where:{
                id:docId
            },
            data:{
                children:{
                   
                }
            },
            include:{
                children:true
            }
        })
        return NextResponse.json({
            success: true,
            message: 'child page added',
            notes: updatedDocument
        }, {
            status: 200
        })
    } catch (error) {
        console.log('Error updating user notes', error);
        return NextResponse.json({
            success: false,
            message: 'Error updating user notes'
        }, {
            status: 500
        })

    }
}
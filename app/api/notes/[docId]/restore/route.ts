import { NextRequest, NextResponse } from "next/server";
import client from "@/db/index"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { docIdSchema } from "@/schemas";
import { applyOperationRecursively } from "@/helpers/parent-with-child";

interface Params {
    params: Promise<{ docId: string }>
}


export async function PATCH(req: NextRequest, { params }: Params) {
    const docId = (await (params)).docId
    const session = await getServerSession(authOptions)
    const result = docIdSchema.safeParse(docId)
    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: "unauthorized" }, { status: 401 })
    }
    const userId = session.user.id
    if (!docId || !result.success) {
        return NextResponse.json({ success: false, message: "Invalid document id" }, { status: 400 })
    }
    try {
        const document = await client.document.findFirst({
            where: {
                id: docId,
                userId
            },
            select: {
                id: true,
                title: true,
                isTrashed: true,
                parent:true
            }
        })
        if (!document) {
            return NextResponse.json({
                success: false,
                message: 'Document not found'
            }, {
                status: 404
            })

        }
        if(document.parent?.isTrashed){
            return NextResponse.json({
                success: false,
                message: 'Cannot restore child while parent is still archived'
            }, {
                status: 400
            }) 
        }
        const restoredDocs = applyOperationRecursively('restore');
        await restoredDocs(docId, userId!)
        return NextResponse.json({
            success: true,
            message: 'Pages restored'
        }, {
            status: 200
        })
    } catch (error) {
        console.log('Error restoring page', error);
        return NextResponse.json({
            success: false,
            message: 'Error restoring page'
        }, {
            status: 500
        })

    }
}
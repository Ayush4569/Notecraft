import { NextRequest, NextResponse } from "next/server";
import client from "@/db/index"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { docIdSchema } from "@/schemas";
import { applyOperationRecursively } from "@/helpers/recursive-delete";

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
                isTrashed: true
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

        const archiveDocs = applyOperationRecursively('archive');
        await archiveDocs(docId, userId!)
        return NextResponse.json({
            success: true,
            message: 'Page archived'
        }, {
            status: 200
        })
    } catch (error) {
        console.log('Error archiving page', error);
        return NextResponse.json({
            success: false,
            message: 'Error archiving page'
        }, {
            status: 500
        })

    }
}
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import client from "@/db/index"
import { docIdSchema } from "@/schemas";
import { applyOperationRecursively } from "@/helpers/parent-with-child";
interface Params {
    params: Promise<{ docId: string }>
}
export async function DELETE(req: NextRequest, { params }: Params) {
    const docId = (await (params)).docId
    const session = await getServerSession()
    const result = docIdSchema.safeParse(docId)
    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: "unauthorized" }, { status: 401 })
    }
    const userId = session.user.id
    if (!docId || !result.success) {
        return NextResponse.json({ success: false, message: "Invalid document id" }, { status: 400 })
    }
    try {
        const document = await client.document.findUnique({
            where: {
                id: docId,
                userId
            },
            select: {
                id: true
            }
        })
        if (!document) {
            return NextResponse.json(
                { success: false, message: "Document not found" }, { status: 404 }
            )
        }
        const deleteDocWithChildren = applyOperationRecursively("delete");
        await deleteDocWithChildren(docId, userId!)
        return NextResponse.json({ success: true, message: "Document deleted" }, { status: 200 })
    } catch (error) {
        console.log("error deleting document", error)
        return NextResponse.json({ success: false, message: "error deleting document" }, { status: 500 })
    }
}
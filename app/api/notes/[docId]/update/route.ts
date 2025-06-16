import { NextRequest, NextResponse } from "next/server";
import client from "@/db/index"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Params } from "@/types/params-promise";
import { docIdSchema } from "@/schemas";
import { deleteObject, generateSignedUrl } from "@/helpers/aws.service";

export async function PATCH(req: NextRequest, { params }: Params) {
    const docId = (await (params)).docId
    const data = await req.json()
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
        const doc = await client.document.findFirst({
            where: {
                id: docId,
                userId,
                isTrashed: false,
            },
            select: {
                id: true,
            }
        })
        if (!doc) {
            return NextResponse.json({
                success: false,
                message: 'Document not found'
            }, {
                status: 404
            })
        }
        const updatedDocument = await client.document.update({
            where: {
                id: docId,
                userId,
            },
            data: {
                ...data
            }
        })
        if(updatedDocument.coverImage) {
            const url = await generateSignedUrl(updatedDocument.coverImage);
            return NextResponse.json({
                success: true,
                message: 'Page updated',
                doc :{
                    ...updatedDocument,
                    imageUrl: url
                }
            }, {
                status: 200
            })
        }
        return NextResponse.json({
            success: true,
            message: 'Page updated',
            doc: updatedDocument
        }, {
            status: 200
        })
    } catch (error) {
        console.log('Error updating note', error);
        return NextResponse.json({
            success: false,
            message: 'Error updating note'
        }, {
            status: 500
        })

    }
}
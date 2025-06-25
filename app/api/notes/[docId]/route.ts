import { NextRequest, NextResponse } from "next/server";
import client from "@/db/index"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { docIdSchema } from "@/schemas";
import { generateSignedUrl } from "@/helpers/aws.service";
import { Params } from "@/types/params-promise";

export async function GET(req: NextRequest, { params }: Params) {
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
                userId,
            }
        })
        if (!document) {
            return NextResponse.json({
                success: false,
                message: 'No such page exist'
            }, {
                status: 500
            })
        }
        let coverUrl: string | null = null;
        if (document.coverImage) {
            coverUrl = await generateSignedUrl(document.coverImage);
            return NextResponse.json({
                success: true,
                message: 'Page fetched',
                note: {
                    ...document,
                    tempImageUrl: coverUrl
                }
            }, {
                status: 200
            })
        }
        return NextResponse.json({
            success: true,
            message: 'Page fetched',
            note: document,
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
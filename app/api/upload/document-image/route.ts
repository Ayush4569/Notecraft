import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { uploadSchema } from "@/schemas";
import { uploadToS3 } from "@/helpers/aws.service";

export async function POST(req: NextRequest, res: NextResponse) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: 'Unauthorized'
        }, {
            status: 401
        })
    }
    const body = await req.json();
    
    const result = uploadSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json({
            success: false,
            message: 'Invalid request body'
        }, {
            status: 500
        })
    }
    const userId = session.user.id as string;
    const { fileName, fileType, docId } = result.data;
    try {
        const uploadFile = await uploadToS3(userId, docId, fileName, fileType);
        if (!uploadFile) return NextResponse.json({ success: false, message: "Failed to upload file" }, { status: 500 });
        return NextResponse.json({ success: true, uploadUrl: uploadFile.url, key: uploadFile.Key }, { status: 200 });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ success: false, message: "Failed to upload file" }, { status: 500 });
    }

}
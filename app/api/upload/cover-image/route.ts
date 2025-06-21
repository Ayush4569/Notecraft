import { NextRequest, NextResponse } from "next/server";
import { deleteObject, uploadToS3 } from "@/helpers/aws.service";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { uploadSchema } from "@/schemas";
import client from "@/db/index";


export async function POST(req: NextRequest) {
    const body = await req.json();
    const session = await getServerSession(authOptions)
    const result = uploadSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json({
            success: false,
            message: 'Invalid request body'
        }, {
            status: 403
        })
    }
    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message: 'Unauthorized'
        }, {
            status: 401
        })
    }
    const userId = session.user.id;
    const { fileType, fileName,docId } = result.data;
    try {
        const document = await client.document.findFirst({
            where: {
                id: docId,
            },
            select:{
                id: true,
                coverImage: true,
            }
        })
        if(document && document.coverImage) {
            await deleteObject(document.coverImage);
        }
       const presignedUrl = await uploadToS3(userId!,docId,fileName,fileType);
         if (!presignedUrl?.url) {
                return NextResponse.json({ error: "Failed to get presigned URL" }, { status: 500 });
          }
          return NextResponse.json({ success: true, url: presignedUrl.url,key:presignedUrl.Key }, { status: 200 });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({success:false, message: "Failed to upload file" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { generateSignedUrl } from "@/helpers/aws.service";

export async function GET(req: NextRequest, res: NextResponse) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: 'Unauthorized'
        }, {
            status: 401
        })
    }
    const {searchParams} = new URL(req.url);
    
    const key = decodeURIComponent(searchParams.get('key') as string);
    
    if(!key) {
        return NextResponse.json({ success: false, message: "Invalid key" }, { status: 500 });
    }
    try {
        const signedUrl:string | null = await generateSignedUrl(key,60);
        if (!signedUrl) return NextResponse.json({ success: false, message: "Failed to render file" }, { status: 500 });
        return NextResponse.redirect(signedUrl,302);
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ success: false, message: "Failed to upload file" }, { status: 500 });
    }

}
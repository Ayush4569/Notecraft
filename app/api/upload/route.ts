import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/helpers/aws.service";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    console.log("Received form data:", formData);
    
    const file = formData.get("file") as File;
    console.log("File received:", file);
    
    if (!file || !(file instanceof File) || file.size === 0) { 
        return NextResponse.json({ error: "Upload a file" }, { status: 400 });
    }
    try {
        const fileBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(fileBuffer);
        // Upload to S3
        const fileUrl = await uploadToS3(buffer, file.name, file.type);
        if (!fileUrl) {
            return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
        }
        return NextResponse.json({ url: fileUrl,success:true,message:"File uploaded" }, { status: 200 });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({success:false, message: "Failed to upload file" }, { status: 500 });
    }
}

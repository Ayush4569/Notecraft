import { deleteObject } from "@/helpers/aws.service";
import { NextRequest, NextResponse } from "next/server";
export async function DELETE(req: NextRequest) {
 const {searchParams} = new URL(req.url);
 const url = decodeURIComponent(searchParams.get('url') as string)
 const key = url.split("=")[1] as string;
 console.log('key',key);
 
  try {
    const isDeleted = await deleteObject(key)
    if(!isDeleted) return NextResponse.json({ success: false,message:"Failed to delete" }, { status: 500 });
    return NextResponse.json({ success: true,message:"file deleted" },{status:200});
  } catch (err) {
    console.error("S3 delete error:", err);
    return NextResponse.json({ success: false,message:"Failed to delete" }, { status: 500 });
  }
}

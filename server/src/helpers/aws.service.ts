import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"

const s3:S3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const uploadToS3 = async (userId: string, docId:string ,fileName: string, fileType: string
):Promise<{url:string,Key:string} | null> => {
  try {
    const Key =  `uploads/${userId}/${docId}/${fileName}`
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key,
      ContentType: fileType,
    })
    const url = await getSignedUrl(s3,command,{expiresIn:360})
    return {url,Key}
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return null
  }
};

export const generateSignedUrl = async (key:string,expiry?:number):Promise<string|null>=>{
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: key,
    })
    const url = await getSignedUrl(s3, command, { expiresIn: expiry ?? 360 });
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
}

export const deleteObject = async(key:string):Promise<boolean>=>{
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: key,
  })
  try {
    await s3.send(command);
    return true
  } catch (error) {
    console.error("Error deleting object:", error);
    return false
  }
}
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (fileBuffer: Buffer,fileName: string,fileType: string
) => {
  try {
    const uniqueFileName = `${randomUUID()}-${fileName}`;

  const uploadParams = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: fileType,
  });

  await s3.send(uploadParams);

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return null
  }
};

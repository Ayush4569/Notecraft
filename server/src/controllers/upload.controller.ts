import { Request, Response } from "express";
import { uploadSchema } from "../schemas/index";
import { prisma } from "../db/db";
import { deleteObject, uploadToS3 } from "../helpers/aws.service";

const uploadCoverImage = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return
    }
   
    const body = req.body
    const result = uploadSchema.safeParse(body);
    if (!result.success) {
        res.status(403).json({
            success: false,
            message: 'Invalid request body'
        });
        return
    }

    const { fileType, fileName, docId } = result.data;
    try {
        const document = await prisma.document.findFirst({
            where: {
                id: docId,
            },
            select: {
                id: true,
                coverImage: true,
            }
        })
        if (document && document.coverImage) {
            await deleteObject(document.coverImage);
        }
        const presignedUrl = await uploadToS3(req.user.id as string, docId, fileName, fileType);
        if (!presignedUrl?.url) {
            res.status(500).json({ error: "Failed to get presigned URL" });
            return
        }
        res.status(200).json({ success: true, url: presignedUrl.url, key: presignedUrl.Key });
        return;
    } catch (error) {
        console.error("Error uploading cover image:", error);
        res.status(500).json({ success: false, message: "Failed to upload file" });
        return;
    }
}

const uploadDocumentImage = async (req: Request, res: Response) => {

    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return
    }
    const body = req.body
    const result = uploadSchema.safeParse(body);
    if (!result.success) {
        res.status(403).json({
            success: false,
            message: 'Invalid request body'
        });
        return
    }

    const { fileName, fileType, docId } = result.data;
    try {
        const uploadFile = await uploadToS3(req.user.id, docId, fileName, fileType);
        if (!uploadFile) {
            res.status(500).json({ error: "Failed to get presigned URL" });
            return
        }
        res.status(200).json({ success: true, uploadUrl: uploadFile.url, key: uploadFile.Key });
        return
    } catch (error) {
        console.error("Error uploading document image:", error);
        res.status(500).json({ success: false, message: "Failed to upload file" });
        return;
    }
}

export {
    uploadCoverImage,uploadDocumentImage
}
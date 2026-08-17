import { Response, Request } from "express";
import { generateSignedUrl, deleteObject } from "../helpers/aws.service";

const getFile = async (req: Request, res: Response) => {
    
    const fileKey = req.query.key
    const key = decodeURIComponent(fileKey as string)

    if (!key) {
        res.status(500).json({ success: false, message: "Invalid key" });
        return;
    }
    try {
        const signedUrl: string | null = await generateSignedUrl(key as string, 60);
        if (!signedUrl) {
            res.status(500).json({ success: false, message: "Failed to render file" });
            return;
        }
        res.redirect(302, signedUrl);
        return
    } catch (error) {
        console.error("Error getting file:", error);
        res.status(500).json({ success: false, message: "Failed to upload file" });
        return;
    }
}
const deleteFile = async (req: Request, res: Response) => {
    const url = req.query.url as string

    let key:string = url as string;
   
    
    if (url && (url.includes("?key=") || url.includes("&key="))) {
        try {
            const parsedUrl = new URL(url);
            const parsedKey = parsedUrl.searchParams.get("key");
            if (parsedKey) {
                key = parsedKey;
            }
        } catch (e) {
            const parts = url.split("key=");
            if (parts.length > 1) {
                key = parts[1].split("&")[0];
            }
        }
    }
    try {
        const isDeleted = await deleteObject(key as string)
        if (!isDeleted) {
             res.status(500).json({ success: false, message: "Failed to delete" });
             return;
        }
        res.status(200).json({ success: true, message: "file deleted" });
        return;
    }
    catch (err) {
        console.error("S3 delete error:", err);
        res.status(500).json({ success: false, message: "Failed to delete" });
        return;
    }
}
export {
    getFile,
    deleteFile
}
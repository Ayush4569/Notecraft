import { uploadCoverImage, uploadDocumentImage } from "../controllers/upload.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const router:Router = Router()
router.post('/cover-image',authMiddleware,uploadCoverImage)
router.post('/document-image',authMiddleware,uploadDocumentImage)
export default router
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { deleteFile, getFile } from "../controllers/file.controller";

const router:Router = Router()
router.get("/view",authMiddleware,getFile,)
router.delete("/delete",authMiddleware,deleteFile)
export default router
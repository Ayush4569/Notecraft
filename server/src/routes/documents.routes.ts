import { Router } from "express";
import { getAllDocuments, getDocumentById, getTrashedDocuments, createDocument, updateDocument, archiveDocument, restoreDocument, deleteDocument } from "../controllers/document.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { rateLimiter } from "../middlewares/redis.middleware";

const router:Router = Router();
router.get("/",authMiddleware,rateLimiter("rl:getDocs",100,600),getAllDocuments)
router.get("/trashed",authMiddleware,getTrashedDocuments)
router.post("/create",authMiddleware,rateLimiter("rl:createDoc",10,60),createDocument)
router.get('/:id',getDocumentById)
router.patch("/update/:id", authMiddleware,updateDocument)
router.patch("/archive/:id",authMiddleware,archiveDocument)
router.patch("/restore/:id",authMiddleware,restoreDocument)
router.delete("/delete/:id",authMiddleware,deleteDocument)

export default router;

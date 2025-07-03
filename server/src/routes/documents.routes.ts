import { Router } from "express";
import { getAllDocuments, getDocumentById, getTrashedDocuments, createDocument, updateDocument, archiveDocument, restoreDocument, deleteDocument } from "../controllers/document.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router:Router = Router();
router.get("/",authMiddleware,getAllDocuments)
router.get("/trashed",authMiddleware,getTrashedDocuments)
router.post("/create",authMiddleware,createDocument)
router.get('/:id',authMiddleware,getDocumentById)
router.patch("/update/:id", authMiddleware,updateDocument)
router.patch("/archive/:id",authMiddleware,archiveDocument)
router.patch("/restore/:id",authMiddleware,restoreDocument)
router.delete("/delete/:id",authMiddleware,deleteDocument)

export default router;

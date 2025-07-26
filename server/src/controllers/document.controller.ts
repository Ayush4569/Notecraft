import { generateSignedUrl } from "../helpers/aws.service";
import { applyOperationRecursively } from "../helpers/recursive-delete";
import { docIdSchema } from "../schemas/index";
import { prisma } from "../db/db";
import { Request, Response } from "express";
import { RedisClient } from "../helpers/redis";
const getAllDocuments = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return
    }
    try {
        const isUserDocsCached = await RedisClient.get(`user:docs:${req.user.id}`);

        if (isUserDocsCached) {
            res.status(200).json({
                success: true,
                message: 'Notes fetched',
                notes: JSON.parse(isUserDocsCached)
            });
            return
        }
        const userNotes = await prisma.document.findMany({
            where: {
                userId: req.user.id as string,
                isTrashed: false,
            },
            select: {
                id: true,
                title: true,
                parentId: true,
                icon: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
        })
        await RedisClient.setex(`user:docs:${req.user.id}`, 300, JSON.stringify(userNotes))
        res.status(200).json({
            success: true,
            message: 'Notes fetched',
            notes: userNotes
        });
        return
    } catch (error) {
        console.log('Error fetching user notes', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user notes'
        })
        return
    }
}

const getDocumentById = async (req: Request, res: Response) => {
    const docId = req.params.id;
    const result = docIdSchema.safeParse(docId)
    if (!docId || !result.success) {
        res.status(400).json({ success: false, message: "Invalid document id" });
        return
    }
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return
    }
    const isCached = await RedisClient.get(`user:doc:${docId}`);

    if (isCached) {
        res.status(200).json({
            success: true,
            message: 'Page fetched',
            note: JSON.parse(isCached),
        });
        return
    }
    try {
        const document = await prisma.document.findFirst({
            where: {
                id: docId,
                userId: req.user.id as string,
            }
        })
        if (!document) {
            res.status(500).json({
                success: false,
                message: 'No such page exist'
            });
            return
        }
        let coverUrl: string | null = null;
        if (document.coverImage) {
            coverUrl = await generateSignedUrl(document.coverImage);
            await RedisClient.setex(`user:doc:${docId}`, 300, JSON.stringify({ ...document, tempImageUrl: coverUrl }))
            res.status(200).json({
                success: true,
                message: 'Page fetched',
                note: {
                    ...document,
                    tempImageUrl: coverUrl
                }
            });
            return
        }
        await RedisClient.setex(`user:doc:${docId}`, 300, JSON.stringify(document))
        res.status(200).json({
            success: true,
            message: 'Page fetched',
            note: document,
        });
        return
    } catch (error) {
        console.log('Error fetching page', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching page'
        });
        return

    }
}
const getTrashedDocuments = async (req: Request, res: Response) => {

    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return
    }
    try {
        const isCached = await RedisClient.get(`docs:trashed:${req.user.id}`);
        if (isCached) {
            res.status(200).json({
                success: true,
                message: 'Notes fetched',
                notes: JSON.parse(isCached)
            });
            return
        }
        const trashedNotes = await prisma.document.findMany({
            where: {
                userId: req.user.id as string,
                isTrashed: true,
            },
            select: {
                id: true,
                title: true,
                parentId: true,
                icon: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
        })
        await RedisClient.setex(`docs:trashed:${req.user.id}`, 300, JSON.stringify(trashedNotes))
        res.status(200).json({
            success: true,
            message: 'Notes fetched',
            notes: trashedNotes
        });
        return
    } catch (error) {
        console.log('Error fetching trashed notes', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching trashed notes'
        });
        return
    }
}
const createDocument = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return
    }
    const { title, parentId } = req.body
    try {
        const createdNote = await prisma.document.create(
            {
                data: {
                    title,
                    userId: req.user.id as string,
                    parentId: parentId ?? null,
                }
            }
        )
        await RedisClient.del(`user:docs:${req.user.id}`)
        res.status(200).json({
            success: true,
            message: 'Note created',
            note: createdNote
        })
        return;
    } catch (error) {
        console.log('Error creating note', error);
        res.status(500).json({
            success: false,
            message: 'Error creating note'
        });
        return

    }
}
const updateDocument = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return
    }
    const docId = req.params.id;
    const data = req.body
    const result = docIdSchema.safeParse(docId)
    if (!docId || !result.success) {
        res.status(400).json({ success: false, message: "Invalid document id" });
        return
    }
    try {
        const doc = await prisma.document.findFirst({
            where: {
                id: docId,
                userId: req.user.id as string,
                isTrashed: false,
            },
            select: {
                id: true,
            }
        })
        if (!doc) {
            res.status(400).json({ success: false, message: "Document not found" });
            return
        }
        const updatedDocument = await prisma.document.update({
            where: {
                id: docId,
                userId: req.user.id as string,
            },
            data: {
                ...data
            }
        })
        await RedisClient.del(`user:doc:${docId}`);

        if (updatedDocument.coverImage) {
            const url = await generateSignedUrl(updatedDocument.coverImage);
            res.status(200).json({
                success: true,
                message: 'Page updated',
                doc: {
                    ...updatedDocument,
                    imageUrl: url
                }
            });
            return
        }

        res.status(200).json({
            success: true,
            message: 'Page updated',
            doc: updatedDocument
        });
        return
    } catch (error) {
        console.log('Error updating note', error);
        res.status(400).json({ success: false, message: "Failed to update document" });
        return

    }
}
const archiveDocument = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return
    }
    const docId = req.params.id;
    const result = docIdSchema.safeParse(docId)
    if (!docId || !result.success) {
        res.status(400).json({ success: false, message: "Invalid document id" });
        return
    }
    try {
        const document = await prisma.document.findFirst({
            where: {
                id: docId,
                userId: req.user.id as string,
            },
            select: {
                id: true,
                title: true,
                isTrashed: true
            }
        })
        if (!document) {
            res.status(400).json({ success: false, message: "Document not found" });
            return
        }

        const archiveDocs = applyOperationRecursively('archive');
        await archiveDocs(docId, req.user.id as string);
        await RedisClient.del(`user:doc:${docId}`);
        await RedisClient.del(`user:docs:${req.user.id}`);
        await RedisClient.del(`docs:trashed:${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Page archived'
        });
        return
    } catch (error) {
        console.log('Error archiving page', error);
        res.status(500).json({
            success: false,
            message: 'Error archiving page'
        });
        return

    }
}
const restoreDocument = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return
    }
    const docId = req.params.id;
    const result = docIdSchema.safeParse(docId)
    if (!docId || !result.success) {
        res.status(400).json({ success: false, message: "Invalid document id" });
        return
    }
    try {
        const document = await prisma.document.findFirst({
            where: {
                id: docId,
                userId: req.user.id as string,
            },
            select: {
                id: true,
                title: true,
                isTrashed: true,
                parent: true
            }
        })
        if (!document) {
            res.status(400).json({ success: false, message: "Document not found" });
            return

        }
        if (document.parent?.isTrashed) {
            res.status(400).json({
                success: false,
                message: 'Cannot restore child while parent is still archived'
            });
            return
        }
        const restoredDocs = applyOperationRecursively('restore');
        await restoredDocs(docId, req.user.id as string);
        await RedisClient.del(`user:doc:${docId}`);
        await RedisClient.del(`user:docs:${req.user.id}`);
        await RedisClient.del(`docs:trashed:${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Page restored'
        });
        return
    } catch (error) {
        console.log('Error restoring page', error);
        res.status(400).json({ success: false, message: "Failed to restore document" });
        return
    }
}
const deleteDocument = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return
    }
    const docId = req.params.id;
    const result = docIdSchema.safeParse(docId)
    if (!docId || !result.success) {
        res.status(400).json({ success: false, message: "Invalid document id" });
        return
    }
    try {
        const document = await prisma.document.findUnique({
            where: {
                id: docId,
                userId: req.user.id as string,
            },
            select: {
                id: true
            }
        })
        if (!document) {
            res.status(400).json({ success: false, message: "Document not found" });
            return
        }
        const deleteDocWithChildren = applyOperationRecursively("delete");
        await deleteDocWithChildren(docId, req.user.id as string);
        await RedisClient.del(`user:doc:${docId}`);
        await RedisClient.del(`user:docs:${req.user.id}`);
        await RedisClient.del(`docs:trashed:${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Page deleted'
        });
        return
    } catch (error) {
        console.log("Error deleting document", error)
        res.status(400).json({ success: false, message: "Failed to delete document" });
        return
    }
}
export {
    getAllDocuments,
    getDocumentById,
    getTrashedDocuments,
    createDocument,
    updateDocument,
    archiveDocument,
    restoreDocument,
    deleteDocument
}

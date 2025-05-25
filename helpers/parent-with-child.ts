import client from "../db/index"
type operations = "restore" | "archive" | "delete"
export function applyOperationRecursively(operation: operations) {
    return async function change(docId: string, userId: string) {

        try {
            const children = await client.document.findMany({
                where: {
                    parentId: docId,
                    userId
                },
                select: {
                    id: true
                }
            })
            if (children.length > 0) {
                await Promise.all(children.map(child => change(child.id, userId)))
            }
            switch (operation) {
                case "archive":
                    await client.document.update({
                        where: {
                            id: docId,
                            userId
                        },
                        data: {
                            isTrashed: true
                        }
                    })
                    break;

                case "restore":
                    await client.document.update({
                        where: {
                            id: docId,
                            userId
                        },
                        data: {
                            isTrashed: false
                        }
                    })
                    break;

                case "delete":
                    await client.document.delete({
                        where: {
                            id: docId,
                            userId
                        }
                    })
                    break;


                default:
                    throw new Error(`Unknown operation: ${operation}`)
            }
        } catch (error) {
            console.error(`Failed to ${operation} document ${docId}:`, error)
            throw error
        }
    }
}
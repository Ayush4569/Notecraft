import { User } from "./user";

export interface Comment {
    id: string;
    content: string;
    userId: string;
    documentId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    document: Document;
}
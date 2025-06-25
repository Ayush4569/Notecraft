import { PartialBlock } from "@blocknote/core";
import {Comment} from "./comments"

export interface Document {
    id: string;
    title: string;
    content?: {
        blocks:PartialBlock[]
    },
    createdAt: Date;
    updatedAt?: Date | null;
    userId: string;
    parentId?: string | null;
    isPublished: boolean;
    coverImage?: string;
    icon?:string;
    isTrashed: boolean;
    tempImageUrl?:string;
    comments?: Comment[] | null ;
    children?: Document[];
}

export interface DocNode {
    id: string;
    title: string;
    icon: string;
    parentId?: string | null;
    children?: DocNode[];
}



import { Favorite } from "./favorites"

interface DocumentContent {
    time: number
    blocks: Block[]
    version?: string
}

type Block = ParagraphBlock | HeadingBlock | ImageBlock | ListBlock

interface ParagraphBlock {
    type: "paragraph",
    data: {
        text: string
    }
}

interface HeadingBlock {
    type: "header",
    data: {
        text: string,
        level: number
    }
}
interface ImageBlock {
    type: "image",
    data: {
        url: string,
        caption?: string
    }
}
interface ListBlock {
    type: "list",
    data: {
        items: string[],
        style: string
    }
}

export interface Document {
    id: string;
    title: string;
    content?: DocumentContent;
    createdAt: Date;
    updatedAt?: Date;
    userId: string;
    parentId?: string;
    isPublished: boolean;
    coverImage?: string;
    isArchived: boolean;
    isTrashed: boolean;
    comments: Comment[];
    FavoriteId?: string;
    favorite?: Favorite;
    parent?: Document;
    children?: Document[];
}



// import {Comment} from "./comments"
interface BlockNoteBlock {
    id:string
    type:"string"
    props:Record<string,any>   // contruct an obj with properties of type string * their values as any
    content : string | BlockNoteBlock[]
    children : BlockNoteBlock[]
}

interface BlockNoteContent {
    version:string
    blocks:BlockNoteBlock[]
}

export interface Document {
    id: string;
    title: string;
    content?: BlockNoteContent | string;
    createdAt: Date;
    updatedAt?: Date | null;
    userId: string;
    parentId?: string | null;
    isPublished: boolean;
    coverImage?: string;
    isArchived: boolean;
    isTrashed: boolean;
    comments?: Comment[] | null ;
    children?: Document[];
}



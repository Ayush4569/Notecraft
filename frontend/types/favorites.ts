import {Document} from "./document"
export interface Favorite {
    id: string;
    userId:string
    documents: Document[];
}
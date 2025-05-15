import { Document } from "@/types/document";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDocuments = ()=> {
   return useQuery({
        queryKey:['documents'],
        queryFn:async()=>{
            const { data } = await axios.get('/api/notes/get-user-notes');
            return data.notes as Document[]
        },
        staleTime:0
    })
}
import { DocNode } from "@/types/document";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useGetTrashedDocs = ()=> useQuery({
    queryKey:["documents","trashed"],
    queryFn: async () => {

        try {
           const res = await axios.get('/api/notes/get-trashed-notes');
            return res.data.notes as DocNode[] 
        } catch (error) {
            console.log('Error fetching user docs', error);
            toast.error("Error fetching user docs")
            const msg = axios.isAxiosError(error) ? error.response?.data.message : "Failed to fetch docs"
            throw new Error(msg)
        } 
    },
    
})
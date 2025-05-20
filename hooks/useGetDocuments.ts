import { Document, GetDocumentsResponse } from "@/types/document";
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner";


export const getDocs = () => useQuery<GetDocumentsResponse[],Error>({
    queryKey: ["documents"],
    queryFn: async () => {
        const toastLoading = toast.loading("Fetching user docs...")
        try {
           const res = await axios.get('/api/notes/get-user-notes');
            toast.success('Fetched user docs', { id: toastLoading })
            // console.log('res.data',res.data.notes);
            
            return res.data.notes as GetDocumentsResponse[] 
        } catch (error) {
            console.log('Error fetching user docs', error);
            toast.error("Error fetching user docs", { id: toastLoading })
            const msg = axios.isAxiosError(error) ? error.response?.data.message : "Failed to fetch docs"
            throw new Error(msg)
        } finally{
            toast.dismiss(toastLoading)
        }
    },
    staleTime: 1000 * 60
})

import { Document } from "@/types/document";
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner";
export const getDocs = () => useQuery<Document[],Error>({
    queryKey: ["documents"],
    queryFn: async () => {
        try {
           const res = await axios.get('/api/notes/get-user-notes');
            return res.data.notes as Document[] 
        } catch (error) {
            console.log('Error fetching user docs', error);
            toast.error("Error fetching user docs")
            const msg = axios.isAxiosError(error) ? error.response?.data.message : "Failed to fetch docs"
            throw new Error(msg)
        }
    },
    staleTime: 1000 * 60
})

import { Document } from "@/types/document";
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const getDocs = () => useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
        try {
           const res = await axios.get('/api/notes/get-user-notes');
            return res.data.notes as Document[]
        } catch (error) {
            console.log('Error fetching user docs', error);
        }
    },
    staleTime: 1000 * 60
})

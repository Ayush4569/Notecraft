import { DocNode } from "@/types/document"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export const getDocs = () => {
    const pathname = usePathname();
    return useQuery<DocNode[],Error>({
        queryKey: ["documents"],
        queryFn: async () => {
            try {
               const res = await axios.get('/api/notes/get-docs');
                return res.data.notes as DocNode[] 
            } catch (error) {
                console.log('Error fetching user docs', error);
                toast.error("Error fetching user docs")
                const msg = axios.isAxiosError(error) ? error.response?.data.message : "Failed to fetch docs"
                throw new Error(msg)
            } 
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus:false,
        enabled: pathname.startsWith("/documents")
    })
    
}
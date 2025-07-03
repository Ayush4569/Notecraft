import { Document } from "@/types/document";
import {  useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

async function getDocbyId(docId: string):Promise<Document | null>{
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/document/${docId}`,{
            withCredentials: true
        });
        return res.data.note as Document
     } catch (error) {
         console.log('Error fetching pagee', error);
         toast.error("Error fetching page")
         const msg = axios.isAxiosError(error) ? error.response?.data.message : "Failed to fetch page"
         throw new Error(msg)
     } 
}

export const usePage = (docId: string) => {
    return useQuery({
      queryKey: ["document", docId], 
      queryFn: () => getDocbyId(docId!), 
      enabled: !!docId ,
      retry:false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchInterval: 1000 * 60 * 5, // 5 minutes
    })
  }

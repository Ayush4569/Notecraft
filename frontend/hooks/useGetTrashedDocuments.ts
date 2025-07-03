import { DocNode } from "@/types/document";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const getTrash = async () => {

    try {
       const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/document/trashed`,{
        withCredentials: true
    });
        return res.data.notes as DocNode[] 
    } catch (error) {
        console.log('Error fetching trash docs', error);
        toast.error("Error fetching trash docs")
        const msg = axios.isAxiosError(error) ? error.response?.data.message : "Failed to fetch docs"
        throw new Error(msg)
    } 
}

export const useGetTrashedDocs = ()=> useQuery({
    queryKey:["documents","trashed"],
    queryFn:()=> getTrash()
    
})
import { queryClient } from "@/helpers/tanstack"
import { Document } from "@/types/document"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

// export const useEditDocuments  =()=> useMutation<Document,Error,string>({
//     mutationFn:async()=>{
//        try {
        
//        } catch (error) {
        
//        }
//     }
// })
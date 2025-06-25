import { queryClient } from "@/helpers/tanstack"
import { DocNode, Document } from "@/types/document"
import { PartialBlock } from "@blocknote/core"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

interface docPayload {
    title:string;
    content:string | {version:string,blocks:PartialBlock[]};
    coverImage:string | null;
    icon:string | null;
    isPublished:boolean
    version:string;
}

type mutationProps = {
    docId:string;
    data: Partial<docPayload>
}

export const useEditDocument  =()=> useMutation({
   
    mutationFn:async({docId,data}:mutationProps)=>{
       try {
        const res = await axios.patch(`/api/notes/${docId}/update`,data);
        return res.data.doc
       } catch (error) {
        console.error("Error updating doc", error)
        toast.error(
          axios.isAxiosError(error)
            ? error.response?.data.message
            : "Error updating document"
        )
        throw error
       }
    },
    onMutate:async({docId,data}:mutationProps)=>{
        await queryClient.cancelQueries({queryKey:["document",docId]})
  
        const previousDocState = queryClient.getQueryData<Document>(["document",docId]);
        
        queryClient.setQueryData(["document",docId],(oldDoc:Document)=>{
            return {...oldDoc,...data}
        })
        queryClient.setQueryData(["documents"],(oldDoc:DocNode[]=[])=>{
           return oldDoc.map(doc=>doc.id === docId ? {...doc,...data} : doc);
        })
        
        return {previousDocState}
    },
    onError(error,variables,context){
        if(context?.previousDocState){
            queryClient.setQueryData(["document",variables.docId],context.previousDocState)
            queryClient.invalidateQueries({queryKey:["documents"]})
        }
    },
    onSettled:(doc,err,{docId,data},context)=>{
          queryClient.invalidateQueries({queryKey:["document",docId]})
          queryClient.invalidateQueries({queryKey:["documents"]})
    }
})
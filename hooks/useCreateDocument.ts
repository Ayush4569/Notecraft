import { queryClient } from "@/helpers/tanstack"
import { Document } from "@/types/document"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

export const useCreateDocuments = () => {
    return useMutation({
        mutationFn: async (title: string) => {
            const promise = toast.loading("creating note...")
            try {
                const { data } = await axios.post('/api/notes/create-note', { title });
                toast.success("Note created",{id:promise})
                return data.note as Document
            } catch (error) {
                toast.error("Failed to create note", { id: promise });
                throw error;
            }
        },
        onSuccess: (newDoc) => {
            queryClient.setQueryData<Document[]>(['documents'], (oldDocs) => {
              if (!oldDocs) return [newDoc];
              return [newDoc, ...oldDocs]; 
            });
          }
      
    })
}
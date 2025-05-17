import { queryClient } from "@/helpers/tanstack"
import { Document } from "@/types/document"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

export const useCreateDocuments = () => useMutation<Document, Error, string>({
    mutationFn: async (title: string) => {
        const toastCreation = toast.loading("creating note...")
        try {
            const res = await axios.post('/api/notes/create-note', { title });
            toast.success("Note created", { id: toastCreation })
            return res.data.note as Document
        } catch (error) {
            console.log('Failed to create note', error);
            const message = axios.isAxiosError(error) ? error.response?.data.message : "Failed to create note"
            toast.error(message, { id: toastCreation });
            throw new Error(message)
        }
    },
    onMutate: async (title: string) => {
        await queryClient.cancelQueries({ queryKey: ["documents"] });

        const previousDocuments = queryClient.getQueryData<Document[]>(["documents"])

        const initialDoc: Document = {
            id: `temp-${Date.now()}`,
            title,
            content: "",
            userId: '',
            createdAt: new Date(),
            isPublished: false,
            isArchived: false,
            isTrashed: false
        }

        queryClient.setQueryData(["documents"], (oldDocs: Document[] | undefined) => {
            return [initialDoc, ...(oldDocs || [])]
        })

        return { previousDocuments }
    },
    onError: (error, _title, context) => {
        // Rollback to previous state
        // @ts-ignore
        queryClient.setQueryData(["documents"], context?.previousDocuments);
    },
    onSuccess: (newDoc) => {

        queryClient.setQueryData(["documents"], (oldDocs: Document[] | undefined) => {
            console.log('oldDocs : ', oldDocs);
            console.log('newDoc : ', newDoc);

            if (!oldDocs) return [newDoc]
            return oldDocs.map(doc => doc.id.startsWith('temp-') ? newDoc : doc)
        })
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["documents"] }).catch((err) => {
            console.error("Failed to invalidate queries:", err);
        });
        toast.dismiss();
    }
})
import { queryClient } from "@/helpers/tanstack"
import { Document } from "@/types/document"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { GetDocumentsResponse } from "./useGetDocuments"

interface CreateDocumentProps {
    title: string
    parentId?: string
}

export const useCreateDocuments = () => useMutation({
    mutationFn: async ({ title, parentId }: CreateDocumentProps): Promise<GetDocumentsResponse> => {
        const toastCreation = toast.loading("creating note...")
        try {
            const res = await axios.post('/api/notes/create-note', { title, parentId });
            toast.success("Note created", { id: toastCreation })
            return res.data.note as GetDocumentsResponse
        } catch (error) {
            console.log('Failed to create note', error);
            const message = axios.isAxiosError(error) ? error.response?.data.message : "Failed to create note"
            toast.error(message, { id: toastCreation });
            throw new Error(message)
        }
    },
    onMutate: async ({ title, parentId }: CreateDocumentProps) => {
        await queryClient.cancelQueries({ queryKey: ["documents"] });

        const previousDocuments = queryClient.getQueryData<GetDocumentsResponse[]>(["documents"])

        const initialDoc: GetDocumentsResponse = {
            id: `temp-${Date.now()}`,
            title,
            parentId: parentId || '',
            icon: ""
        }

        queryClient.setQueryData(["documents"], (oldDocs: GetDocumentsResponse[] | undefined) => {
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

        queryClient.setQueryData(["documents"], (oldDocs: GetDocumentsResponse[] | undefined) => {

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
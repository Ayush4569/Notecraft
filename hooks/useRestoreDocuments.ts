import { queryClient } from "@/helpers/tanstack";
import { DocNode } from "@/types/document";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useRestoreDocuments = () => useMutation({
    mutationFn: async (docId: string) => {
        try {
            await axios.patch(`/api/notes/${docId}/restore`);
            toast.success("Page restored");
        } catch (error) {
            console.log('Error restoring page', error);
            const msg = axios.isAxiosError(error) ? error.response?.data.message : "Failed to fetch docs"
            toast.error(msg)
        }
    },
    onMutate: async (docId: string) => {
        await queryClient.cancelQueries({ queryKey: ["documents", "trashed"] })

        const trashedDocs = queryClient.getQueryData<DocNode[]>(["documents", "trashed"])
        queryClient.setQueryData(["documents", "trashed"], (trashDocs: DocNode[] | undefined) => {
            if (!trashDocs) return;
            return trashDocs.filter(docs => docs.id !== docId)
        })

        return { trashedDocs }
    },
    onError: (err, docId, context) => {
        console.error("Error restoring page:", err);
        if (context?.trashedDocs) {
            queryClient.setQueryData(["documents", "trashed"], context.trashedDocs)
        }
    },
    onSettled: () => {
        // Refetch to ensure data is fresh
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ queryKey: ["documents", "trashed"] })
    }
})
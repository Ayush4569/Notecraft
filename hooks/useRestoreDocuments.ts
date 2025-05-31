import { queryClient } from "@/helpers/tanstack";
import { DocNode, Document } from "@/types/document";
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
        await queryClient.cancelQueries({ queryKey: ["documents", "trashed"] });

        const trashedDocs = queryClient.getQueryData<DocNode[]>(["documents", "trashed"]) || [];

        const recoveredDoc = trashedDocs.find(doc => doc.id === docId);

        if (!recoveredDoc) return { trashedDocs };
        queryClient.setQueryData(["documents", "trashed"], trashedDocs.filter(doc => doc.id !== docId));

        queryClient.setQueryData(["documents"], (oldState: DocNode[] = []) => {
            return [recoveredDoc, ...oldState];
        });
        queryClient.setQueryData(["document", docId], (oldDoc: Document | undefined) => {
            if (!oldDoc) return oldDoc;
            return { ...oldDoc, isTrashed: false };
        });

        return { trashedDocs };
    },
    onError: (err, docId, context) => {
        console.error("Error restoring page:", err);
        if (context?.trashedDocs) {
            queryClient.setQueryData(["documents", "trashed"], context.trashedDocs)
        }
    },
    onSettled: (data, err, docId, context) => {
        // Refetch to ensure data is fresh
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ queryKey: ["documents", "trashed"] })
        queryClient.invalidateQueries({ queryKey: ["document", docId] })
    }
})
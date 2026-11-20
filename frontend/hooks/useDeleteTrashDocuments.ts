import { queryClient } from "@/helpers/tanstack";
import { DocNode } from "@/types/document";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteDocumentApi } from "@/lib/api/documents";

export const useDeleteTrashDocuments = () =>
    useMutation({
        mutationFn: async (docId: string) => {
            try {
                const response = await deleteDocumentApi(docId);
                if (!response.success) {
                    throw new Error(response.message || "Failed to delete page");
                }
                toast.success("Document deleted successfully");
            } catch (error) {
                console.log("Error deleting page", error);
                toast.error(error instanceof Error ? error.message : "Failed to delete page");
                throw error;
            }
        },
        onMutate: async (docId: string) => {
            await queryClient.cancelQueries({ queryKey: ["documents", "trashed"] });
            const previousData = queryClient.getQueryData(["documents", "trashed"]);
            queryClient.setQueryData(["documents", "trashed"], (oldData: DocNode[] = []) => {
                return oldData.filter((doc) => doc.id !== docId);
            });
            return { previousData };
        },
        onError: (error, docId, context) => {
            queryClient.setQueryData(["documents", "trashed"], context?.previousData);
        },
        onSettled: (data, err, docId) => {
            queryClient.invalidateQueries({ queryKey: ["documents", "trashed"] });
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            queryClient.invalidateQueries({ queryKey: ["document", docId] });
        },
    });

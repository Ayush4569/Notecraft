import { queryClient } from "@/helpers/tanstack";
import { DocNode, Document } from "@/types/document";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { archiveDocumentApi } from "@/lib/api/documents";

interface DocPayload {
    title: string;
    parentId: string;
    icon: string;
}

type ArchiveProps = {
    docId: string;
    payload: Partial<DocPayload>;
};

export const useArchiveDocument = () =>
    useMutation({
        mutationFn: async ({ docId }: ArchiveProps) => {
            const response = await archiveDocumentApi(docId);
            if (!response.success) {
                throw new Error(response.message || "Failed to archive page");
            }
        },
        onMutate: async ({ docId, payload }: ArchiveProps) => {
            await queryClient.cancelQueries({ queryKey: ["documents"] });

            const previousDocuments = queryClient.getQueryData<DocNode[]>(["documents"]);
            const initalTrashedDoc: DocNode = {
                id: docId,
                title: payload.title || "untitled",
                parentId: payload.parentId ?? null,
                icon: payload.icon ?? "",
            };
            queryClient.setQueryData(["documents"], (old: DocNode[] = []) =>
                old.filter((doc) => doc.id !== docId)
            );
            queryClient.setQueryData(["documents", "trashed"], (trashDocs: DocNode[] = []) => {
                return [initalTrashedDoc, ...trashDocs];
            });
            queryClient.setQueryData(["document", docId], (oldDoc: Document | undefined) => {
                if (!oldDoc) return oldDoc;
                return { ...oldDoc, isTrashed: true };
            });

            return { previousDocuments };
        },
        onError: (err, docId, context) => {
            toast.error("Error archiving page");
            console.error("Error archiving page:", err);

            if (context?.previousDocuments) {
                queryClient.setQueryData(["documents"], context.previousDocuments);
            }
        },
        onSuccess: () => {
            toast.success("Page archived");
        },
        onSettled: (doc, err, { docId }) => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            queryClient.invalidateQueries({ queryKey: ["documents", "trashed"] });
            queryClient.invalidateQueries({ queryKey: ["document", docId] });
        },
    });

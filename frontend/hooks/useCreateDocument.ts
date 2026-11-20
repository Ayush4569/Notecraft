import { queryClient } from "@/helpers/tanstack";
import { DocNode } from "@/types/document";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createDocumentApi } from "@/lib/api/documents";

interface CreateDocumentProps {
    title: string;
    parentId?: string;
}

export const useCreateDocuments = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: async ({ title, parentId }: CreateDocumentProps): Promise<DocNode> => {
            const response = await createDocumentApi({ title, parentId });
            if (!response.success || !response.data) {
                throw new Error(response.message || "Failed to create document");
            }
            return response.data as unknown as DocNode;
        },
        onMutate: async ({ title, parentId }: CreateDocumentProps) => {
            await queryClient.cancelQueries({ queryKey: ["documents"] });

            const previousDocuments = queryClient.getQueryData<DocNode[]>(["documents"]);

            const initialDoc: DocNode = {
                id: `temp-${Date.now()}`,
                title,
                parentId: parentId || "",
                icon: "",
            };

            queryClient.setQueryData(["documents"], (oldDocs: DocNode[] = []) => {
                return [initialDoc, ...(oldDocs || [])];
            });

            return { previousDocuments };
        },
        onError: (error, title, context) => {
            console.log("Failed to create page", error);
            toast.error("Error creating page");
            if (context?.previousDocuments) {
                queryClient.setQueryData(["documents"], context.previousDocuments);
            }
        },
        onSuccess: (newDoc) => {
            toast.success("Page created");
            queryClient.setQueryData(["documents"], (oldDocs: DocNode[] = []) => {
                if (oldDocs.length === 0) return [newDoc];
                return oldDocs.map((doc) => (doc.id.startsWith("temp-") ? newDoc : doc));
            });
            router.replace(`/documents/${newDoc.id}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] }).catch((err) => {
                console.error("Failed to invalidate queries:", err);
            });
        },
    });
};

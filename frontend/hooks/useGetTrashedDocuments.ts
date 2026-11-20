import { DocNode } from "@/types/document";
import { useQuery } from "@tanstack/react-query";
import { getTrashedDocumentsApi } from "@/lib/api/documents";

const getTrash = async (): Promise<DocNode[]> => {
    const response = await getTrashedDocumentsApi();
    if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch trash docs");
    }
    return response.data as unknown as DocNode[];
};

export const useGetTrashedDocs = () =>
    useQuery({
        queryKey: ["documents", "trashed"],
        queryFn: () => getTrash(),
    });

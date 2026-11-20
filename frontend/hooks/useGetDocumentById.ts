import { Document } from "@/types/document";
import { useQuery } from "@tanstack/react-query";
import { getDocumentByIdApi } from "@/lib/api/documents";

async function getDocbyId(docId: string): Promise<Document | null> {
    const response = await getDocumentByIdApi(docId);
    if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch page");
    }
    return response.data;
}

export const usePage = (docId: string) => {
    return useQuery({
        queryKey: ["document", docId],
        queryFn: () => getDocbyId(docId!),
        enabled: !!docId,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchInterval: 1000 * 60 * 5, // 5 minutes
    });
};

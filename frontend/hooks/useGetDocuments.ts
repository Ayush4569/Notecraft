import { DocNode } from "@/types/document";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { getAllDocumentsApi } from "@/lib/api/documents";

export const getDocs = () => {
    const pathname = usePathname();
    
    return useQuery<DocNode[], Error>({
        queryKey: ["documents"],
        queryFn: async () => {
            const response = await getAllDocumentsApi();
            if (!response.success || !response.data) {
                throw new Error(response.message || "Failed to fetch docs");
            }
            return response.data as unknown as DocNode[];
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
        enabled: pathname.startsWith("/documents")
    });
};

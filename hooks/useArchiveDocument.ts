import { queryClient } from "@/helpers/tanstack";
import { DocNode } from "@/types/document";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useArchiveDocument = () => useMutation({
  mutationFn: async (docId: string) => {
    await axios.patch(`/api/notes/${docId}/toggle-trash`);
  },
  onMutate: async (docId: string) => {
    await queryClient.cancelQueries({ queryKey: ['documents'] });

    const previousDocuments = queryClient.getQueryData<DocNode[]>(['documents']);

    queryClient.setQueryData(['documents'], (old: DocNode[] | undefined) =>
      old?.filter(doc => doc.id !== docId)
    );

    return { previousDocuments };
  },
  onError: (err, docId, context) => {
    toast.error("Error archiving page");
    console.error("Error archiving page:", err);

    if (context?.previousDocuments) {
      queryClient.setQueryData(['documents'], context.previousDocuments);
    }
  },
  onSuccess: () => {
    toast.success("Page archived");
  },
  onSettled: () => {
    // Refetch to ensure data is fresh
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  }
});

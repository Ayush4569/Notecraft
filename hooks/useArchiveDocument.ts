import { queryClient } from "@/helpers/tanstack";
import { DocNode } from "@/types/document";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useArchiveDocument = () => useMutation({
  mutationFn: async (archivedDoc:DocNode) => {
    await axios.patch(`/api/notes/${archivedDoc.id}/archive`);
  },
  onMutate: async (archivedDoc:DocNode) => {
    await queryClient.cancelQueries({ queryKey: ['documents'] });

    const previousDocuments = queryClient.getQueryData<DocNode[]>(['documents']);
    const initalTrashedDoc: DocNode = {
      id: archivedDoc.id,
      title:archivedDoc.title,
      parentId:archivedDoc.parentId,
      icon: archivedDoc.icon ?? ""
  }
    queryClient.setQueryData(['documents'], (old: DocNode[] = []) =>
      old.filter(doc => doc.id !== archivedDoc.id)
    );
    queryClient.setQueryData(["documents", "trashed"],(trashDocs:DocNode[] = [])=>{
      return [initalTrashedDoc,...trashDocs]
    })

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
    queryClient.invalidateQueries({ queryKey: ['documents', 'trashed'] });
  }
});

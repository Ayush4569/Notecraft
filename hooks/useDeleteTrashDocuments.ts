import { queryClient } from "@/helpers/tanstack";
import { DocNode } from "@/types/document";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useDeleteTrashDocuments = () => useMutation({
    mutationFn: async (docId: string) => {
        try {
            await axios.delete(`/api/notes/${docId}/delete`)
            toast.success("Document deleted successfully");
        } catch (error) {
            console.log('Error deleting page', error);
            const msg = axios.isAxiosError(error) ? error.response?.data.message : "Failed to delete page"
            toast.error(msg)
        }
    },
    onMutate:async(docId:string)=>{
      await queryClient.cancelQueries({queryKey:["documents", "trashed"]});
        const previousData = queryClient.getQueryData(["documents", "trashed"]);
        queryClient.setQueryData(["documents", "trashed"], (oldData: DocNode[] = []) => {
            return oldData.filter((doc) => doc.id !== docId);
        });
        return { previousData };
    },
    onError: (error, docId, context) => {
        queryClient.setQueryData(["documents", "trashed"], context?.previousData);
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["documents", "trashed"] });
    }
})
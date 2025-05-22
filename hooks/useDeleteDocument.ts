import { queryClient } from "@/helpers/tanstack";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useDeleteDocument = () => useMutation<void, Error, string>({
    mutationFn: async (docId: string) => {
        const deleteToast = toast.loading("Deleting note...")
        try {
            await axios.delete(`/api/notes/delete/${docId}`,);
            toast.success("Note deleted", { id: deleteToast })
        } catch (error) {
            toast.success("Error deleting note", { id: deleteToast })
            console.log('error deleting doc', error);
            throw Error
        }
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
})
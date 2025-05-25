import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface mutationFnProps {
    docId:string
    action:"archive" | "restore" | "delete"
}
export const useDocumentAction =()=> useMutation({
    mutationFn:async({docId,action}:mutationFnProps)=>{
        await axios.post('')
    }
})
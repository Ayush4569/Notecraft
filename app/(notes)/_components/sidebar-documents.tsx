import Loading from "@/app/loading";
import { Skeleton } from "@/components/ui/skeleton";
import {getDocs} from "@/hooks/useGetDocuments"
import { toast } from "sonner";
export function SideBarDocuments() {
  const {error,data:documents,isLoading} = getDocs()
  if (error) {
    return toast.error("Error while fetching documents");
  } else if (isLoading) {
    return  <Skeleton className="rounded-sm mt-2 bg-gray-300 px-2 py-0.5 h-8 w-full" /> 
  } 
  
  if(!documents || documents.length === 0) return <p className="mt-2">No notes</p>
  return (
    <>
      {documents.length > 0 &&
        documents.map((doc) => (
          <p
            className="border border-red-600 rounded-sm px-2 py-1 mt-2"
            key={doc.id}
          >
            {doc.title}
          </p>
        ))}
    </>
  );
}

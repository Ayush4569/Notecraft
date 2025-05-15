import Loading from "@/app/loading";
import { useDocuments } from "@/hooks/useDocuments";
import { Document } from "@/types/document";
import { toast } from "sonner";

export function SideBarDocuments() {
  const { data: documents, isLoading, error } = useDocuments();
  if (error) {
    return toast.error("Error while fetching documents");
  } else if (isLoading) {
    return <Loading />;
  } 
  // else{
  //   console.log('documents',documents);
  // }
  if(!documents || documents.length === 0) return <p>No notes</p>
  return (
    <>
      {documents.length > 0 &&
        documents.map((doc: Document) => (
          <p
            className="border border-red-600 rounded-sm px-2 py-1"
            key={doc.id}
          >
            {doc.title}
          </p>
        ))}
    </>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { getDocs } from "@/hooks/useGetDocuments";

import { DocumentLists } from "./documents";

export function SideBarDocuments() {
  const { data: documents, isLoading } = getDocs();
 
  let fallbackSkeletion = documents?.length || 4;
  
  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-y-1 mt-2">
        {Array.from({ length: fallbackSkeletion }).map((_, idx) => {
          return (
            <Skeleton
              key={idx}
              className="mt-2 rounded-none bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 h-6 "
            />
          );
        })}
      </div>
    );
  }
  if (!documents || documents.length === 0)
    return <p className="mt-2 px-3">No notes</p>;
  console.log("docs", documents);

  return (
    <>
      {documents.map((doc) => (
       <DocumentLists key={doc.id} doc={doc} />
      ))}
    </>
  );
}

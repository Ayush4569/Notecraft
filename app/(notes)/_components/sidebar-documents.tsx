import { Skeleton } from "@/components/ui/skeleton";
import { getDocs } from "@/hooks/useGetDocuments";

import { DocumentLists } from "./documents";
import { DocNode } from "@/types/document";

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


  
  function buildTree(docs: DocNode[]):DocNode[]{
   const map = new Map<string, DocNode & {children :DocNode[]}>()
   const roots:(DocNode & {children : DocNode[]})[] = []

   docs.forEach(doc => map.set(doc.id,{...doc,children:[]}))

   docs.forEach(doc => {
    if(doc.parentId){
       const parent = map.get(doc.parentId);
       if(parent) parent.children.push(map.get(doc.id)!)
    } else{
      roots.push(map.get(doc.id)!)
    }
   })

   return roots
  }
  
  const tree = buildTree(documents);
  console.log('tree',tree);
  
  return (
    <>
      {tree
        .map((doc) => (
          <DocumentLists key={doc.id} doc={doc} children={doc.children} parentId={doc.parentId || ""} />
        ))}
    </>
  );
}

import Loading from "@/app/loading";
import { ConfirmModal } from "@/components/confirm-modal";
import { Input } from "@/components/ui/input";
import { useDeleteTrashDocuments } from "@/hooks/useDeleteTrashDocuments";
import { useGetTrashedDocs } from "@/hooks/useGetTrashedDocuments";
import { useRestoreDocuments } from "@/hooks/useRestoreDocuments";
import { DocNode } from "@/types/document";
import { Loader2, Search, Trash, Undo } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TrashBox() {
  const [title, setTitle] = useState<string>("");
  const { data: trashedDocs, isLoading } = useGetTrashedDocs();
  const { mutate: DeleteDoc } = useDeleteTrashDocuments();
  const router = useRouter();
  const { mutate: Restore } = useRestoreDocuments();
  const filteredDocuments = trashedDocs?.filter((doc) =>
    doc.title.includes(title)
  );
  const handleRestore = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    docId: string
  ) => {
    e.stopPropagation();
    Restore(docId);
  };
  const handleTrash = (
    docId: string
  ) => {
    DeleteDoc(docId);
  };
  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by title of page"
        />
      </div>
      <div className="mt-2 px-1 pb-1 w-full">
        {isLoading && (
          <div className="h-full w-full flex items-center justify-center">
            <Loader2
              className="animate-spin text-neutral-300 dark:text-neutral-600 "
              size={20}
            />
          </div>
        )}
        {!filteredDocuments ||
          (filteredDocuments.length === 0 && (
            <p className="hidden last:block text-xs text-center pb-2 text-muted-foreground mt-2">
              No documents found.
            </p>
          ))}
        {!isLoading &&
          filteredDocuments?.map((doc: DocNode) => (
            <div
              key={doc.id}
              onClick={() => router.replace(`/documents/${doc.id}`)}
              role="button"
              className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
            >
              <span className="truncate pl-2">{doc.title}</span>
              <div className="flex items-center gap-x-2">
                <div
                  role="button"
                  onClick={(e) => handleRestore(e, doc.id)}
                  className="rounded-sm cursor-pointer p-2 hover:bg-neutral-200
                   dark:hover:bg-neutral-600
                  "
                >
                  <Undo className="h-4 w-4 text-muted-foreground" />
                </div>
                <ConfirmModal onConfirm={()=> handleTrash(doc.id)}>
                  <div
                    role="button"
                    className="rounded-sm cursor-pointer p-2 hover:bg-neutral-200
                    dark:hover:bg-neutral-600
                    "
                  >
                    <Trash className="h-4 w-4 text-muted-foreground" />
                  </div>
                </ConfirmModal>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

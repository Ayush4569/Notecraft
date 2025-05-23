import Loading from "@/app/loading";
import { ConfirmModal } from "@/components/confirm-modal";
import { Input } from "@/components/ui/input";
import { useGetTrashedDocs } from "@/hooks/useGetTrashedDocuments";
import { DocNode } from "@/types/document";
import { Loader2, Search, Trash, Undo } from "lucide-react";
import { useState } from "react";

export function TrashBox() {
  const [title, setTitle] = useState<string>("");
  const { data: trashedDocs, isLoading } = useGetTrashedDocs();

  const filteredDocuments = trashedDocs?.filter((doc) =>
    doc.title.includes(title)
  );
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
              className="animate-spin text-purple-600 dark:text-fuchsia-400"
              size={20}
            />
          </div>
        )}
        <p className="hidden last:block text-xs text-center pb-2 text-muted-foreground mt-2">
          No documents found.
        </p>
        {!isLoading &&
          filteredDocuments?.map((doc: DocNode) => (
            <div
              key={doc.id}
              role="button"
              className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
            >
              <span className="truncate pl-2">{doc.title}</span>
              <div className="flex items-center gap-x-2">
                <div
                  role="button"
                  className="rounded-sm cursor-pointer p-2 hover:bg-neutral-200"
                >
                  <Undo className="h-4 w-4 text-muted-foreground" />
                </div>
                <ConfirmModal onConfirm={function () {}}>
                  <div
                    role="button"
                    className="rounded-sm cursor-pointer p-2 hover:bg-neutral-200"
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

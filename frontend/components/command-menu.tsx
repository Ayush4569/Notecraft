"use client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { getDocs } from "@/hooks/useGetDocuments";
import { onClose, toggle } from "@/redux/slices/searchmenu";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
export function CommandMenu() {
  const router = useRouter();
  const { data: documents, isLoading } = getDocs();
  const { isOpen } = useAppSelector((state) => state.search);
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        dispatch(toggle());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const filteredDocs = useMemo(() => {
    return documents?.filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, documents]);
  const onSelect = (docId:string)=> router.push(`/documents/${docId}`);
  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={(open: boolean) => dispatch(onClose())}
    >
      <CommandInput
        placeholder="Search by title"
        value={searchQuery}
        onValueChange={(value) => setSearchQuery(value)}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {isLoading && (
            <div className="flex flex-col w-full py-[2px] px-2 gap-y-2 mt-2">
              {Array.from({ length: 3 }).map((_, idx) => {
                return (
                  <Skeleton
                    key={idx}
                    className="min-h-[22px] text-sm w-full cursor-pointer rounded-xs bg-neutral-200 dark:bg-neutral-700"
                  />
                );
              })}
            </div>
          )}
          {filteredDocs?.map((doc) => (
            <CommandItem
              key={doc.id}
              value={doc.title}
              title={doc.title}
              onSelect={() => onSelect(doc.id)}
              className="cursor-pointer flex items-center gap-x-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xs"
            >
              {doc.icon ? (
                <p className="mr-2 text-[18px]">{doc.icon}</p>
              ) : (
                <File className="h-4 w-4 mr-2" />
              )}
              <span className="truncate">{doc.title}</span>
               
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

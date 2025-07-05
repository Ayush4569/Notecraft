"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePage } from "@/hooks/useGetDocumentById";
import { useEditDocument } from "@/hooks/useUpdateDocument";
import { Loader2, MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { queryClient } from "@/helpers/tanstack";
import { DocNode } from "@/types/document";
import { useDebounce } from "@/hooks/useDebounce";
import { Publish } from "./publish";

interface NavbarProps {
  isSidebarOpen: boolean;
  resetSidebar: () => void;
}
export function PageNavbar({ isSidebarOpen, resetSidebar }: NavbarProps) {
  const params = useParams();
  const docId = params.id;
  const { data: page, isLoading } = usePage(docId as string);
  const { mutate: EditDocument } = useEditDocument();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(page?.title || "untitled");
  const debouncedTitle = useDebounce(title, 1000);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!isEditing) return;
    EditDocument({
      docId: docId as string,
      data: { title: debouncedTitle as string },
    });
  }, [debouncedTitle]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    queryClient.setQueryData(
      ["document", docId],
      (oldData: Document | undefined) => {
        if (!oldData) return;
        return { ...oldData, title: e.target.value };
      }
    );
    queryClient.setQueryData(
      ["documents"],
      (oldData: DocNode[] | undefined) => {
        if (!oldData) return;
        return oldData.map((docNode) => {
          if (docNode.id === docId) {
            return { ...docNode, title: e.target.value };
          }
          return docNode;
        });
      }
    );
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const disableInput = () => setIsEditing(false);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2
          className="animate-spin text-purple-600 dark:text-fuchsia-400"
          size={50}
        />
      </div>
    );
  }
  if (page == null) return null;
  const enableInput = () => {
    setTitle(page.title);
    setIsEditing(true);
  };

  return (
    <>
      {page.isTrashed && <Banner docId={docId as string} />}
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 flex items-center justify-between gap-x-4 overflow-hidden w-full">
        {!isSidebarOpen && (
          <MenuIcon
            onClick={resetSidebar}
            role="button"
            className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground cursor-pointer shrink-0"
          />
        )}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-x-1 max-w-1/3 overflow-hidden">
            {page?.icon && <p className="shrink-0 text-xl">{page.icon}</p>}
            {isEditing ? (
              <Input
                autoFocus
                type="text"
                ref={inputRef}
                onClick={enableInput}
                onBlur={disableInput}
                onKeyDown={onKeyDown}
                value={title}
                onChange={handleChange}
                className="h-7 px-2 focus-visible:ring-transparent w-full truncate"
              />
            ) : (
              <Button
                onClick={enableInput}
                variant="ghost"
                size="sm"
                className="font-normal p-1  line-clamp-1"
              >
                {page.title}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-x-2">
            <Publish isPublished={page.isPublished} pageId={page.id} />
            <Menu docId={page.id} />
          </div>
        </div>
      </nav>
    </>
  );
}
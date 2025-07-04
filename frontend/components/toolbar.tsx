"use client";

import { DocNode, Document } from "@/types/document";
import { IconPicker } from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useEditDocument } from "@/hooks/useUpdateDocument";
import { useDebounce } from "@/hooks/useDebounce";
import { queryClient } from "@/helpers/tanstack";
import { CoverImageModal } from "@/components/cover-image-modal";
interface ToolbarProps {
  doc: Document;
  preview?: boolean;
}
export function Toolbar({ doc, preview = false }: ToolbarProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate } = useEditDocument();
  const [title, setTitle] = useState<string>(doc.title || "");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const debouncedTitle = useDebounce(title, 1000);
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>):void => {
    setTitle(e.target.value);
    queryClient.setQueryData(
      ["document", doc.id],
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
          if (docNode.id === doc.id) {
            return { ...docNode, title: e.target.value };
          }
          return docNode;
        });
      }
    );
  };
  const disableEditing = ():void => setIsEditing(false);
  const enableEditing = ():void => {
    if (preview) return;
    setIsEditing(true);
  };
  useEffect(() => {
    if (!isEditing) return;
    mutate({ docId: doc.id, data: { title: debouncedTitle as string } });
  }, [debouncedTitle]);

  const onkeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>):void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      disableEditing();
    }
  };

  const handleRemoveIcon = (docId: string, icon: null):void =>
    mutate({ docId, data: { icon } });
  const handleIconChange = (icon: string | null):void => {
    if (!icon) return;
    mutate({ docId: doc.id, data: { icon } });
  };
  return (
    <div className="group relative pl-[20px] md:pl-[56px]">
      {!!doc.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon">
          <p className="text-6xl hover:opacity-75 transition">{doc.icon}</p>
          <Button
            variant="outline"
            size="icon"
            className="text-muted-foreground text-xs rounded-full md:opacity-0 md:group-hover/icon:opacity-100 transition-all"
            onClick={() => handleRemoveIcon(doc.id, null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      {!!doc.icon && preview && (
        <div className="flex items-center gap-x-2 pt-6">
          <p className="text-6xl pt-6">{doc.icon}</p>
        </div>
      )}
      <div className="md:opacity-0 md:group-hover:opacity-100 transition-all flex items-center gap-x-1 my-2">
        {!doc.icon &&!preview && (
          <IconPicker onChange={handleIconChange} asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground text-xs"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add Icon
            </Button>
          </IconPicker>
        )}
        {!doc.coverImage &&!preview && (
          <CoverImageModal docId={doc.id}>
            <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground text-xs"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Cover
          </Button>
          </CoverImageModal>
        )}
      </div>
      {isEditing && !preview ? (
        <textarea
          ref={textAreaRef}
          value={doc.title}
          autoFocus
          onChange={handleTitleChange}
          onBlur={disableEditing}
          onKeyDown={onkeyDown}
          className="pb-3 text-5xl font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none w-full bg-transparent focus:ring-0 "
        />
      ) : (
        <div
          onClick={enableEditing}
          className="pb-3 text-5xl font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] "
        >
          {doc.title}
        </div>
      )}
    </div>
  );
}

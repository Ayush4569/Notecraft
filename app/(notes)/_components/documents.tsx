import { useCreateDocuments } from "@/hooks/useCreateDocument";
import { DocNode } from "@/types/document";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronDown,
  File,
  Plus,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";

interface DocumentListsProps {
  doc: DocNode;
  parentId?: string;
  children?: DocNode[];
}

export function DocumentLists({
  doc,
  parentId,
  children = [],
}: DocumentListsProps) {
  const pathname = usePathname();
  const {data,status} = useSession()
  const router = useRouter();
  const isActive = pathname.includes(doc.id);
  const [isExpanded, setIsExpanded] = useState(false);

  const { mutate: createDocument } = useCreateDocuments();
  const handleCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    createDocument({ title: "untitled", parentId: doc.id });
  };
  const handleRedirect = (id: string) => {
    router.push(`/documents/${id}`);
  };
  const handleTrash = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };
   
  return (
    <>
      <div
        role="button"
        onClick={() => handleRedirect(doc.id)}
        className={cn(
          "group relative min-h-[22px] text-sm py-[2px] px-2.5 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-semibold cursor-pointer",
          isActive && "bg-primary/5 text-primary"
        )}
      >
        <div className="flex items-center gap-x-0.5 ">
          {isExpanded ? (
            <ChevronDown
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="h-4 w-4 shrink-0 text-muted-foreground/50"
            />
          ) : (
            <ChevronRight
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="h-4 w-4 shrink-0 text-muted-foreground/50"
            />
          )}
          {doc.icon ? (
            <div className="shrink-0 text-[18px]">{doc.icon}</div>
          ) : (
            <File className="text-muted-foreground shrink-0 h-[18px]" />
          )}
          <span className="line-clamp-1 ">{doc.title}</span>
        </div>

        <div className="flex items-center absolute right-2 ">
          <DropdownMenu>
            <DropdownMenuTrigger>
            <div
            role="button"
            onClick={handleTrash}
            className="opacity-0 group-hover:opacity-100 h-full 
          rounded-sm hover:bg-primary/5 dark:hover:bg-neutral-600"
          >
            <MoreHorizontal
              aria-label="More options"
              className="h-5 w-5 shrink-0 text-muted-foreground"
            />
          </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="start" forceMount>   
              <DropdownMenuItem>
                <Trash className="h-4 w-4 mr-2"/>
                Delete
              </DropdownMenuItem> 
              <DropdownMenuSeparator/>
              <div className="text-xs capitalize text-muted-foreground p-2">Last edited by : {" "}{ data?.user.username} </div>
            </DropdownMenuContent>
          </DropdownMenu>
         
          <div
            role="button"
            onClick={handleCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto 
          rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 shrink-0 text-muted-foreground " />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "hidden text-sm py-[2px] ml-4 text-muted-foreground w-max font-semibold",
          children.length > 0 && "w-full",
          isExpanded && "block"
        )}
      >
        {isExpanded && children.length > 0 ? (
          <div className="flex flex-col gap-y-1 w-full">
            {children &&
              children.map((child) => (
                <DocumentLists
                  key={child.id}
                  doc={child}
                  children={child.children || []}
                  parentId={doc.id}
                />
              ))}
          </div>
        ) : (
          isExpanded && (
            <span className="ml-4 text-sm text-muted-foreground">
              No pages inside
            </span>
          )
        )}
      </div>
    </>
  );
}

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { useArchiveDocument } from "@/hooks/useArchiveDocument";

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
  const { data } = useSession();
  const router = useRouter();
  const isActive = pathname.includes(doc.id);
  const [isExpanded, setIsExpanded] = useState(false);

  const { mutate: createDocument } = useCreateDocuments();
  const { mutate: archiveDocument } = useArchiveDocument();

  const handleCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    createDocument({ title: "untitled", parentId: doc.id });
  };

  const handleRedirect = (id: string) => router.push(`/documents/${id}`);

  const handleTrash = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    archiveDocument({docId: doc.id, payload: {}});
  };

  return (
    <>
      <div
        role="button"
        onClick={() => handleRedirect(doc.id)}
        className={cn(
          "relative group min-h-[22px] text-sm py-[2px] px-2.5 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-semibold cursor-pointer",
          isActive && "bg-primary/5 text-primary"
        )}
      >
        <div className="flex items-center gap-x-0.5  max-w-[calc(100% - 40px)] md:max-w-[calc(100%-50px)]">
          {isExpanded ? (
            <ChevronDown
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="h-full w-4 shrink-0 text-muted-foreground/50 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm"
            />
          ) : (
            <ChevronRight
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="h-full w-4 shrink-0 text-muted-foreground/50 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm"
            />
          )}

          {doc.icon ? (
            <div className="shrink-0 text-[18px]">{doc.icon}</div>
          ) : (
            <File className="text-muted-foreground shrink-0 h-[18px]" />
          )}
          <span className="w-[70%] md:w-full truncate">{doc.title}</span>
        </div>

        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-x-1  md:opacity-0 md:group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                role="button"
                className="rounded-sm hover:bg-primary/5 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal
                  aria-label="More options"
                  className="h-5 w-5 shrink-0 text-muted-foreground"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="start" forceMount>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleTrash(e)}>
                <Trash className="h-4 w-4 mr-2 " />
                Move to trash
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs capitalize text-muted-foreground p-2">
                Last edited by: {data?.user.username}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={handleCreate}
            className="rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "hidden text-sm py-[2px] pl-4 text-muted-foreground font-semibold",
          children.length > 0 && "w-full",
          isExpanded && "block"
        )}
      >
        {isExpanded && children.length > 0 ? (
          <div className="flex flex-col gap-y-1 w-full">
            {children.map((child) => (
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

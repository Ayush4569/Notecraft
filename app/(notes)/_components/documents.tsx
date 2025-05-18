import { cn } from "@/lib/utils";
import { Document } from "@/types/document";
import { ChevronRight, ChevronDown, File, Dot, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface DocumentListsProps {
  doc: Document;
  children: Document[];
  parentId: string;
}

export function DocumentLists({ doc, children, parentId }: DocumentListsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname.includes(doc.id);
  const [isExpanded, setIsExpanded] = useState(false);
  const handleRedirect = (id: string) => router.push(`/documents/${id}`);

  return (
    <>
      <div
        role="button"
        onClick={() => handleRedirect(doc.id)}
        className={cn(
          "group min-h-[27px] text-sm py-[2px] px-2.5 w-full hover:bg-primary/5 flex items-center justify-between text-muted-foreground font-semibold gap-x-1 cursor-pointer",
          isActive && "bg-primary/5 text-primary"
        )}
      >
        <div className="flex items-center gap-x-0.5">
          {isExpanded ? (
            <ChevronDown
              onClick={() => setIsExpanded(false)}
              className="h-4 w-4 shrink-0 text-muted-foreground/50"
            />
          ) : (
            <ChevronRight
              onClick={() => setIsExpanded(true)}
              className="h-4 w-4 shrink-0 text-muted-foreground/50"
            />
          )}
          {doc.icon ? (
            <div className="shrink-0 text-[18px]">{doc.icon}</div>
          ) : (
            <File className="text-muted-foreground shrink-0 h-[18px]" />
          )}
          <span className="truncate text-start">{doc.title}</span>
        </div>

        <div className="flex items-center transition opacity-0 group-hover:opacity-100">
          <Dot className="h-4 w-4 shrink-0 text-muted-foreground/50" />
          <Plus className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      </div>
      <div
        
        className={cn(
          "min-h-[12px] hidden text-sm py-[2px] ml-4 text-muted-foreground w-max font-semibold",
          children && `flex flex-col gap-y-1`,
          isExpanded && "block"
        )}
      >
        {
          children ? (
            <div></div>
          ) : (
             <span className="">No pages inside</span>
          )
        }
      </div>
    </>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePage } from "@/hooks/useGetDocumentById";
import { useEditDocument } from "@/hooks/useUpdateDocument";
import { Loader2, MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { Banner } from "./banner";
import { Menu } from "./menu";

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
  const inputRef = useRef<HTMLInputElement>(null);
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
  console.log("page", page);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      EditDocument({ docId: docId as string, data: { title } });
    }
  };
  const enableInput = () => {
    setTitle(page.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  const disableInput = () => setIsEditing(false);
  return (
    <>
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
        {!isSidebarOpen ||
          (!docId && (
            <MenuIcon
              onClick={resetSidebar}
              role="button"
              className="h-6 w-6 text-muted-foreground cursor-pointer"
            />
          ))}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-x-1">
            {page?.icon && <p>{page.icon}</p>}
            {isEditing ? (
              <Input
                type="text"
                ref={inputRef}
                onClick={enableInput}
                onBlur={disableInput}
                onKeyDown={onKeyDown}
                value={title}
                onChange={handleChange}
                className="h-7 px-2 focus-visible:ring-transparent"
              />
            ) : (
              <Button
                onClick={enableInput}
                variant="ghost"
                size="sm"
                className="font-normal h-auto p-1"
              >
                {page.title}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-x-2">
           <Menu docId={page.id as string}/>
          </div>
        </div>
      </nav>
      {
        page.isTrashed && (
          <Banner docId={docId as string} />
        )
      }
    </>
  );
}

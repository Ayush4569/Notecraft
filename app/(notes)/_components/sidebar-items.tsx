
import { PlusCircle, Search } from "lucide-react";
import { SettingsDialog } from "./settings-dialog";
import { useCreateDocuments } from "@/hooks/useCreateDocument";

export function SidebarItems() {
  const {mutate} = useCreateDocuments()
  const handleCreate = ()=>{
    mutate('untitled');
  }
  return (
    <>
      <div
        className="group min-h-[27px] text-sm py-1 px-2 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-semibold gap-x-2 cursor-pointer"
      >
        <Search className="h-[18px] shrink-0 text-muted-foreground" />
        <span className="truncate">Search</span>
      </div>

      <SettingsDialog />
      <div onClick={handleCreate} className="group min-h-[27px] text-sm py-1 px-2 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-semibold gap-x-2 cursor-pointer">
        <PlusCircle  className="h-[18px] shrink-0 text-muted-foreground" />
        <span className="truncate">New page</span>
        <kbd className="ml-auto pointer-events-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </>
  );
}

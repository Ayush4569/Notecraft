import { PlusCircle, Search } from "lucide-react";
import { SettingsDialog } from "./settings-dialog";
import { useCreateDocuments } from "@/hooks/useCreateDocument";
import { useDispatch } from "react-redux";
import { onOpen } from "@/redux/slices/searchmenu";

export function SidebarItems() {
  const { mutate } = useCreateDocuments();
  const dispatch = useDispatch()
  const handleCreate = () => {
    mutate({ title: "untitled" }); 
  };
  return (
    <>
      <div onClick={()=> dispatch(onOpen())} className="group min-h-[27px]  py-1 px-2 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-semibold gap-x-2 cursor-pointer mb-0.5 mt-2 text-lg md:mb-0 md:mt-1 md:text-sm">
        <Search className="h-[22px] md:h-[18px] shrink-0 text-muted-foreground" />
        <span className="truncate">Search</span>
        <kbd className="ml-auto pointer-events-auto  h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 hidden md:inline-flex">
          <span className="text-xs ">⌘</span>K
        </kbd>
      </div>

      <SettingsDialog />
      <div
        onClick={handleCreate}
        className="group min-h-[27px] text-lg mt-0.5 py-1 px-2 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-semibold gap-x-2 cursor-pointer md:mb-0 md:mt-0 md:text-sm"
      >
        <PlusCircle className="h-[22px] md:h-[18px] shrink-0 text-muted-foreground " />
        <span className="truncate">New page</span>
      </div>
    </>
  );
}

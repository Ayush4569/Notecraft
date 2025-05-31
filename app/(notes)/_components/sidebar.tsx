import { cn } from "@/lib/utils";
import { MenuIcon, Trash } from "lucide-react";
import React, { useEffect } from "react";
import { SidebarHeader } from "./sidebar-header";
import { SideBarDocuments } from "./sidebar-documents";
import { SidebarItems } from "./sidebar-items";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useAppSelector } from "@/hooks/redux-hooks";
import { useSideBarResizable } from "@/hooks/useSidebarResizable";
import { TrashBox } from "./trash-box";
import { PageNavbar } from "./page-navbar";
import { useParams } from "next/navigation";
function Sidebar() {
  const params = useParams();
  const {
    isResetting,
    isMobile,
    collapseSidebar,
    onMouseDown,
    resetSidebar,
    navbarRef,
    sidebarRef,
  } = useSideBarResizable();
  const isSidebarOpen = useAppSelector((state) => state.sidebar.isOpen);
  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    }
  }, [isMobile]);
  useEffect(() => {
    if (!isSidebarOpen) {
      collapseSidebar();
    }
  }, [isSidebarOpen]);
  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          `h-full group/sidebar flex flex-col overflow-x-hidden overflow-y-auto bg-secondary relative w-60 z-[99999]`,
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <SidebarHeader isMobile={isMobile} collapseSideBar={collapseSidebar} />
        <SidebarItems />

        <div className="mt-4">
          <SideBarDocuments />
        </div>
        <div className="mt-4 py-1 px-2 w-full hover:bg-primary/5 text-muted-foreground font-semibold cursor-pointer">
          <Popover>
            <PopoverTrigger className="flex  items-center w-full gap-x-3">
              <Trash className="h-5 w-5 shrink-0 " />
              <p>Trash</p>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={onMouseDown}
          onClick={resetSidebar}
          className="opacity-0 hover:opacity-100 cursor-ew-resize transition absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.id ? (
          <PageNavbar
            isSidebarOpen={isSidebarOpen}
            resetSidebar={resetSidebar}
          />
        ) : (
          <nav className="px-3 py-4 bg-transparent w-full">
            {!isSidebarOpen && (
              <MenuIcon
                onClick={resetSidebar}
                role="button"
                className="h-6 w-6 text-muted-foreground cursor-pointer"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
}

export default Sidebar;

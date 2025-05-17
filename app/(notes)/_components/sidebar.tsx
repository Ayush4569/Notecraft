import { cn } from "@/lib/utils";
import { ChevronsRight, MenuIcon, PlusCircle, Search } from "lucide-react";
import React, { useEffect } from "react";
import { SidebarHeader } from "./sidebar-header";
import { SideBarDocuments } from "./sidebar-documents";
import { SidebarItems } from "./sidebar-items";
import { useCreateDocuments } from "@/hooks/useCreateDocument";
import { useAppSelector } from "@/hooks/redux-hooks";
import { useSideBarResizable } from "@/hooks/useSidebarResizable";
function Sidebar() {
  const {
    isResetting,
    isMobile,
    collapseSidebar,
    onMouseDown,
    resetSidebar,
    navbarRef,
    sidebarRef,
  } = useSideBarResizable();
  const { mutate: createDocument } = useCreateDocuments();
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
  const handleCreate = () => {
    createDocument("untitled");
  };
  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          `h-full group/sidebar flex flex-col overflow-y-auto bg-secondary relative w-60 z-[99999]`,
          isResetting && "transition-all ease-in-out duration-300"
        )}
      >
        <SidebarHeader isMobile={isMobile} collapseSideBar={collapseSidebar} />
        <SidebarItems
          label="New page"
          icon={PlusCircle}
          onClick={handleCreate}
        />
        <SidebarItems
          label="Search"
          icon={Search}
          isSearch
          onClick={() => {}}
        />

        <div className="mt-4 px-2">
          <SideBarDocuments />
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
          isResetting && "transition-all ease-in-out duration-300"
        )}
      >
        <nav className="px-3 py-4 bg-transparent w-full">
          {!isSidebarOpen && isMobile && (
            <MenuIcon
              onClick={resetSidebar}
              role="button"
              className="h-6 w-6 text-muted-foreground cursor-pointer"
            />
          )}
          {!isSidebarOpen && !isMobile && (
            <ChevronsRight
              onClick={resetSidebar}
              role="button"
              className="h-6 w-6 text-muted-foreground cursor-pointer"
            />
          )}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;

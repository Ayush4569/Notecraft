import { cn } from "@/lib/utils";
import { setSidebarState } from "@/redux/slices/sidebar";
import { AppDispatch, RootState } from "@/redux/store";
import { ChevronsRight, MenuIcon, PlusCircle, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "usehooks-ts";
import { SidebarHeader } from "./sidebar-header";
import { SideBarDocuments } from "./sidebar-documents";
import { SidebarItems } from "./sidebar-items";
import { useCreateDocuments } from "@/hooks/useCreateDocument";
function Sidebar() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const sidebarRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef<boolean>(false);
  const [isResetting, setIsResetting] = useState(false);
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: createDocument, isPending } = useCreateDocuments();
  function handleMouseMove(event: MouseEvent) {
    if (!isResizingRef.current) return;
    let variableWidth = event.clientX;
    if (variableWidth < 240) variableWidth = 240;
    if (variableWidth > 480) variableWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${variableWidth}px`;
      navbarRef.current.style.left = `${variableWidth}px`;
      navbarRef.current.style.width = `calc(100% - ${variableWidth}px)`;
    }
  }
  function handleMouseup() {
    isResizingRef.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseup);
  }
  function onMouseDown(event: React.MouseEvent<HTMLDivElement | MouseEvent>) {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseup);
  }
  function collapseSideBar() {
    dispatch(setSidebarState(false));
    setIsResetting(true);
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.left = "0";
      navbarRef.current.style.width = "100%";
    }
    setTimeout(() => setIsResetting(false), 300);
  }
  function resetSidebar() {
    dispatch(setSidebarState(true));
    setIsResetting(true);
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.width = isMobile ? "0" : `calc(100% - 240px)`;
      navbarRef.current.style.left = isMobile ? "100%" : "240px";
    }
    setTimeout(() => setIsResetting(false), 300);
  }
  function handleCreate() {
      createDocument("untitled");
  }
  useEffect(() => {
    if (isMobile) {
      collapseSideBar();
    } else {
      resetSidebar();
    }
  }, [isMobile]);
  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          `h-full group/sidebar flex flex-col overflow-y-auto bg-secondary relative w-60 z-[99999] `,
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <SidebarHeader isMobile={isMobile} collapseSideBar={collapseSideBar} />
        <SidebarItems label="New page" icon={PlusCircle} onClick={handleCreate} />
        <SidebarItems label="Search" icon={Search} isSearch onClick={()=>{}} />

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
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <nav className="px-3 py-2 bg-transparent w-full">
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

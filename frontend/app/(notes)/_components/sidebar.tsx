import { cn } from "@/lib/utils";
import { MenuIcon, Trash, Sparkles } from "lucide-react";
import React, { useEffect } from "react";
import { SidebarHeader } from "./sidebar-header";
import { SideBarDocuments } from "./sidebar-documents";
import { SidebarItems } from "./sidebar-items";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
  const user = useAppSelector((state) => state.user);
  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    }
  }, [isMobile, collapseSidebar]);
  useEffect(() => {
    if (!isSidebarOpen) {
      collapseSidebar();
    }
  }, [isSidebarOpen, collapseSidebar]);
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
        {user.isGuest && (
          <div className="mx-2 mb-3 p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs shrink-0">
            <div className="flex items-center justify-between font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Guest Mode
              </span>
              <span className="text-[11px] bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                {user.freeAiTrials ?? 3} AI left
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
              Sign up for free to preserve your notes permanently and unlock 10+ AI credits.
            </p>
            <Button
              asChild
              size="sm"
              className="w-full mt-2.5 h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer"
            >
              <Link href="/signup">Save to Free Account</Link>
            </Button>
          </div>
        )}
        <SidebarItems />

        <div className="mt-4 overflow-y-scroll max-h-96">
          <SideBarDocuments />
        </div>
        <div className="mt-4 py-1 px-2 w-full hover:bg-primary/5 text-muted-foreground font-semibold cursor-pointer">
          <Popover>
            <PopoverTrigger className="flex  items-center w-full gap-x-3">
              <Trash className="h-6 w-6 md:h-5 md:w-5 shrink-0 " />
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
          "absolute top-0 z-[9999] left-60 w-[calc(100%-240px)]",
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

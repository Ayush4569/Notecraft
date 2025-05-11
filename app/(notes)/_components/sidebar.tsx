"use client";
import {  useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SidebarHeader from "./sidebar-header";
import { SidebarMenu } from "./sidebar-menu";
import { SidebarCollapsed } from "./sidebar-collapsed";
import { useMobile } from "@/hooks/useMobile";
import { toggleSidebar } from "@/redux/slices/sidebar";

export function Sidebar() {
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const dispatch = useDispatch<AppDispatch>()
  const isMobile = useMobile()
  if(isMobile && isSidebarOpen){
    dispatch(toggleSidebar())
  }
  return (
    <>
      {isSidebarOpen ? (
        <aside
          className={`h-full group/sidebar bg-secondary overflow-y-auto relative py-4 md:px-2 px-4 z-10 `}
        >
          <SidebarHeader/>
         <SidebarMenu/>
          <div className="opacity-0 hover:opacity-100 cursor-ew-resize absolute top-0 right-0 transition bg-primary/10 h-full w-1" />
        </aside>
      ) : (
          <SidebarCollapsed/>
      )}
    </>
  );
}

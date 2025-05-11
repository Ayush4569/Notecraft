"use client";
import { toggleSidebar } from "@/redux/slices/sidebar";
import { AppDispatch } from "@/redux/store";
import { ChevronsRight, LockIcon } from "lucide-react";
import { useDispatch } from "react-redux";

export function SidebarCollapsed(){
    const dispatch = useDispatch<AppDispatch>();
    return (
        <div className="px-2 absolute top-4 left-2 text-muted-foreground h-max flex items-center gap-x-2 w-full md:w-max">
        <ChevronsRight
          onClick={() => dispatch(toggleSidebar())}
          className="h-5 w-5 hover:bg-neutral-100 rounded-md transition-all cursor-pointer "
        />
        <h3 className="hover:bg-neutral-100 rounded-md transition-all p-2 text-muted-foreground truncate dark:hover:text-black">
          Notecraft project
        </h3>{" "}
        {/* replace with the original file name ⬆️*/}
        <span className="bg-secondary flex items-center gap-x-1 hover:bg-neutral-100 rounded-md transition-all px-2 py-1">
          Private <LockIcon className="h-4 w-4" />
        </span>
      </div>
    )
}
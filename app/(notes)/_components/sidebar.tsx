"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  ChevronsRight,
  EditIcon,
  LockIcon,
  PlusCircle,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";

export function Sidebar() {
  const session = useSession();
  const [isSidebarOpen, setisSidebarOpen] = useState<boolean>(true);
  if (session.status === "loading") {
    return null;
  }
  if (session.status === "unauthenticated" || !session.data?.user.username) {
    return null;
  }

  return (
    <>
      {isSidebarOpen ? (
        <aside
          className={`h-full group/sidebar w-60 bg-secondary overflow-y-auto relative py-4 px-2 `}
        >
          <div
            className={`text-muted-foreground hover:bg-gray-300/90 dark:hover:bg-neutral-600 transition-all w-full flex gap-x-1 items-center justify-between px-1 py-0.5 rounded-sm`}
          >
            <div className="flex items-center gap-x-2">
              <img
                src={session.data.user.image || "/avatar.png"}
                className="h-7 w-7"
                alt="avatar"
              />
              <p className={`text-black w-2/3 truncate capitalize dark:invert`}>
                {session.data?.user.username}
                <span> workspace</span>
              </p>
            </div>

            <div className="flex items-center gap-x-2 opacity-0 group-hover/sidebar:opacity-100 transition ease-in">
              <ChevronsLeft
                onClick={() => setisSidebarOpen(false)}
                className="h-7 w-7 hover:bg-neutral-200 transition-all cursor-pointer"
              />
              <EditIcon className="h-5 w-5 hover:bg-neutral-200 transition-all cursor-pointer" />
            </div>
          </div>
          <div className="flex flex-col gap-y-2 my-4 text-muted-foreground w-full ">
            <div className="flex hover:bg-neutral-200 px-1 py-0.5 cursor-pointer items-center gap-x-3 w-full rounded-md">
              <SearchIcon className="h-5 w-5" />{" "}
              <span className="font-medium">Search</span>
            </div>
            <div className="flex hover:bg-neutral-200 px-1 py-0.5 cursor-pointer items-center gap-x-3 w-full rounded-md">
              <SettingsIcon className="h-5 w-5" />{" "}
              <span className="font-medium">Settings</span>
            </div>
            <div className="flex hover:bg-neutral-200 px-1 py-0.5 cursor-pointer items-center gap-x-3 w-full rounded-md">
              <PlusCircle className="h-5 w-5" />{" "}
              <span className="font-medium">New Page</span>
            </div>
          </div>
          <div className="opacity-0 hover:opacity-100 cursor-ew-resize absolute top-0 right-0 transition bg-primary/10 h-full w-1" />
        </aside>
      ) : (
        <div className="py-4 px-2 text-muted-foreground h-max w-1/3 flex items-center gap-x-3">
          <ChevronsRight
            onClick={() => setisSidebarOpen(true)}
            className="h-7 w-7 p-1 hover:bg-neutral-100 rounded-md transition-all cursor-pointer"
          />
          <h3 className="text-black hover:bg-neutral-100 rounded-md transition-all p-2">
            Notecraft project
          </h3>{" "}
          {/* replace with the original file name ⬆️*/}
          <span className="bg-secondary flex items-center gap-x-1 hover:bg-neutral-100 rounded-md transition-all px-2 py-1">
            Private <LockIcon className="h-4 w-4" />
          </span>
        </div>
      )}
    </>
  );
}

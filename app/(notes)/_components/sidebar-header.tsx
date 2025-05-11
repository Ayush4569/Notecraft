"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronsLeft, EditIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { toggleSidebar } from "@/redux/slices/sidebar";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
const SidebarHeader = () => {
  const session = useSession();
  const dispatch = useDispatch<AppDispatch>();
  if (session.status === "loading") {
    return null
  }
  const user = session?.data?.user;
  return (
    <div
      className={`text-muted-foreground hover:bg-gray-300/90 dark:hover:bg-neutral-600 w-full transition-all  flex items-center justify-between py-0.5 px-1 rounded-xs`}
    >
      <div className="flex items-center gap-x-2">
        <Avatar>
          <AvatarImage src={user?.image || "/avatar.png"} />
          <AvatarFallback>user_image</AvatarFallback>
        </Avatar>

        <p className="capitalize line-clamp-1">
          {user?.username} workspace
        </p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <ChevronDown className="text-muted-foreground h-6 w-6 hover:bg-primary/5 " />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-80"
            align="start"
            alignOffset={11}
            forceMount
          >
            <div className="flex flex-col space-y-4 p-4">
              <p className="font-medium text-muted-foreground leading-none">
                {user?.email}
              </p>
              <div className="flex items-center gap-x-2">
                <div className="rounded-md bg-secondary p-1">
                  <Avatar>
                    <AvatarImage
                      className="h-8 w-8"
                      src={user?.image || "/avatar.png"}
                    />
                  </Avatar>
                </div>
                <div className="space-y-1">
                  <p className="capitalize line-clamp-1">
                    {user?.username}&apos;s workspace
                  </p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="w-full p-2 cursor-pointer text-muted-foreground hover:border-none">
              <Button className="w-full" onClick={() => signOut()}>
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-x-2 opacity-0 group-hover/sidebar:opacity-100 transition ease-in ml-2">
        <ChevronsLeft
          onClick={() => dispatch(toggleSidebar())}
          className="h-5 w-5 hover:bg-neutral-200 transition-all cursor-pointer"
        />
        <EditIcon className="h-4 w-4 hover:bg-neutral-200 transition-all cursor-pointer" />
      </div>
    </div>
  );
};

export default SidebarHeader;

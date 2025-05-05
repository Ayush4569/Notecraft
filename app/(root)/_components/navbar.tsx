"use client";
import React from "react";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/useScroll";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { logout } from "@/redux/slices/auth";
const navbar = () => {
  const scrolled = useScroll();
  const session = useSession();
  function handlelogOut (){
    signOut();
    logout()
  }
  return (
    <div
      className={cn(
        "w-full z-50 bg-background p-4 flex items-center justify-between fixed top-0 dark:bg-[#1f1f1f]",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="flex items-center gap-x-2 justify-between ">
        {session && session?.data?.user && (
          <>
            <Button onClick={()=>handlelogOut()} className="cursor-pointer">Logout</Button>
            <Button variant="ghost" >{session.data.user.name}</Button>
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default navbar;

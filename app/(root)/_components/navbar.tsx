"use client";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/useScroll";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
const navbar = () => {
  const scrolled = useScroll();
  const { data: session, status } = useSession();
  function handlelogOut() {
    signOut();
  }
  return (
    <div
      className={cn(
        "w-full z-50 bg-background p-4 flex items-center justify-end fixed top-0 dark:bg-[#1f1f1f]",
        scrolled && "border-b  shadow-xl"
      )}
    >
      <div className="flex items-center gap-x-3  ">
        {status === "loading" && (
          <div className="flex gap-2 animate-out">
            <Skeleton className="h-9 w-24 rounded-sm bg-neutral-200 dark:bg-neutral-700" />
            <Skeleton className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          </div>
        )}
        {status !== "loading" && status === "unauthenticated" && (
          <Button variant="secondary" asChild className="cursor-pointer">
            <Link href="/login">Login</Link>
          </Button>
        )}
        {status === "authenticated" && session?.user && (
          <>
            <Button onClick={handlelogOut}>Logout</Button>
            <img
              src={session.user.image || "/avatar.png"}
              className="h-10 w-10 rounded-full"
              alt="avatar"
            />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default navbar;

"use client";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/useScroll";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const navbar = () => {
  const scrolled = useScroll();
  const router = useRouter()
  const { data: session, status } = useSession();
  function handlelogOut() {
    signOut();
  }
  if (status === "loading") return null;
  
  return (
    <div
      className={cn(
        "w-full z-50 bg-background p-4 flex items-center justify-between fixed top-0 dark:bg-[#1f1f1f]",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="flex items-center gap-x-2 justify-between ">
        {session && session?.user && (
          <>
            <Button size='lg' onClick={() => handlelogOut()} className="cursor-pointer">
              Logout
            </Button>
            <Button variant="ghost">{session.user.username}</Button>
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default navbar;

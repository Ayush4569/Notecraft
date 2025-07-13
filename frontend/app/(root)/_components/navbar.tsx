"use client";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/useScroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {  useAppSelector } from "@/hooks/redux-hooks";
import { Crown, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserDropDown } from "@/app/(notes)/_components/user-dropdown";
const navbar = ({ isSubscriptionPage }: { isSubscriptionPage?: boolean }) => {
  const scrolled = useScroll();
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  return (
    <>
      {isSubscriptionPage ? (
        <div
          className={cn(
            "w-full z-50 bg-background p-4 flex items-center justify-between fixed top-0 dark:bg-[#1f1f1f]",
            scrolled && "border-b  shadow-xl"
          )}
        >
          <div className="flex items-center gap-x-3">
            <span>
              <Home
                onClick={() => router.push("/")}
                className="h-6 w-6 text-gray-500 cursor-pointer"
              />
            </span>
            <Logo />
          </div>

          <div className="flex items-center gap-x-3">
            <Button variant="outline">
              <span className="text-gray-700 dark:invert">{user.email}</span>
            </Button>
            <Image
              src={user.profileImage || "/avatar.png"}
              className="h-10 w-10 rounded-full"
              alt="avatar"
              height={40}
              width={40}
            />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "w-full z-50 bg-background p-4 flex items-center justify-end fixed top-0 dark:bg-[#1f1f1f]",
            scrolled && "border-b  shadow-xl"
          )}
        >
          <div className="flex items-center gap-x-3">
            {user.status === "loading" && (
              <div className="flex gap-2 animate-out">
                <Skeleton className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              </div>
            )}
            {user.status !== "loading" && user.status === "unauthenticated" && (
              <Button asChild className="cursor-pointer">
                <Link href="/login">Login</Link>
              </Button>
            )}
            {user.status === "authenticated" && user.id && (
              <UserDropDown isHomePage />
            )}

            <ModeToggle />
          </div>
        </div>
      )}
    </>
  );
};

export default navbar;

"use client";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/useScroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {  useAppSelector } from "@/hooks/redux-hooks";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserDropDown } from "@/app/(notes)/_components/user-dropdown";
export default function Navbar({ isSubscriptionPage }: { isSubscriptionPage?: boolean })  {
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
            "w-full z-50 bg-background/95 backdrop-blur p-4 flex items-center justify-between fixed top-0 dark:bg-[#1f1f1f]/95 transition-all",
            scrolled && "border-b shadow-sm"
          )}
        >
          <div className="flex items-center gap-x-6">
            <Logo />
            <div className="hidden md:flex items-center gap-x-4 text-sm font-medium text-muted-foreground">
              <Link href="#features" className="hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#demo" className="hover:text-foreground transition-colors">
                Demo
              </Link>
              <Link href="#how-it-works" className="hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#faq" className="hover:text-foreground transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-x-3">
            {user.status === "loading" && (
              <div className="flex gap-2 animate-out">
                <Skeleton className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              </div>
            )}
            {user.status !== "loading" && user.status === "unauthenticated" && (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link href="/guest">Try Guest Mode</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="cursor-pointer">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="cursor-pointer bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                  <Link href="/signup">Get Free</Link>
                </Button>
              </>
            )}
            {user.status === "authenticated" && user.id && (
              <div className="flex items-center gap-x-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/documents">Dashboard</Link>
                </Button>
                <UserDropDown isHomePage />
              </div>
            )}

            <ModeToggle />
          </div>
        </div>
      )}
    </>
  );
};


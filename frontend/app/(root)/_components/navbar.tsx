"use client";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/useScroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {  useAppSelector } from "@/hooks/redux-hooks";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
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
            "w-full z-50 bg-background/95 backdrop-blur px-4 sm:px-8 py-3.5 flex items-center justify-between fixed top-0 dark:bg-[#1F1F1F]/95 transition-all border-b border-border/40",
            scrolled && "shadow-md"
          )}
        >
          <div className="flex items-center gap-x-3 sm:gap-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/documents")}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Notes</span>
            </Button>
            <div className="h-4 w-px bg-border/60 hidden sm:block" />
            <Logo />
          </div>

          <div className="flex items-center gap-x-3">
            <ModeToggle />
            <div className="flex items-center gap-2 pl-2 border-l border-border/60">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {user.isGuest ? "Guest Workspace" : `${user.name}'s workspace`}
              </span>
              <UserDropDown isHomePage={true} />
            </div>
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


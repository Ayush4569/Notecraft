"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/hooks/redux-hooks";
import { ArrowRight, PenLine, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Heading() {
  const { status } = useAppSelector((state) => state.user);

  return (
    <div className="max-w-4xl space-y-6 pt-20 md:pt-28 text-center flex flex-col items-center">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-neutral-100 dark:bg-neutral-800/80 text-foreground border border-border shadow-xs">
        <Sparkles className="h-4 w-4 text-emerald-500" />
        <span>Try our instant Guest Workspace — No sign up required</span>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-3xl leading-[1.1]">
        Your Ideas, Documents & Plans.{" "}
        <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent underline decoration-emerald-500/30">
          Unified.
        </span>
      </h1>

      <p className="text-base sm:text-xl text-muted-foreground font-normal max-w-2xl leading-relaxed">
        Notecraft gives you a distraction-free, block-based workspace with nested pages, AI-powered reformatting, and instant web publishing.
      </p>

      {status === "loading" && (
        <div className="flex w-full justify-center pt-2">
          <Skeleton className="h-11 w-52 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded-xl" />
        </div>
      )}

      {status === "authenticated" && (
        <div className="pt-2">
          <Button asChild size="lg" className="rounded-xl text-base px-8 py-6 font-semibold shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/documents">
              Go to Workspace
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      )}

      {status !== "loading" && status === "unauthenticated" && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild size="lg" className="rounded-xl text-base px-6 py-6 font-semibold shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/guest">
              <PenLine className="h-4 w-4 mr-2" />
              Start Writing (Guest Mode)
              <ArrowRight className="h-5 w-5 ml-1.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl text-base px-6 py-6 font-semibold">
            <Link href="/signup">
              Create Free Account
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

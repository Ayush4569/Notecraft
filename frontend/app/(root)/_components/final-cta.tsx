"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux-hooks";

export function FinalCTA() {
  const { status } = useAppSelector((state) => state.user);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-20">
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900/60 dark:to-neutral-900/30 p-8 sm:p-14 text-center space-y-6 shadow-xl">
        {/* Ambient glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Zero Setup Required</span>
          </div>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Give Your Ideas a Better Home?
          </h3>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Join students, researchers, and creators crafting docs with Notecraft. Start typing in seconds.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
          {status === "authenticated" ? (
            <Button asChild size="lg" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 font-semibold">
              <Link href="/documents">
                Go to Workspace
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 font-semibold shadow-md">
                <Link href="/guest">
                  <PenLine className="h-4 w-4 mr-2" />
                  Start Writing (Guest Mode)
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl px-8 font-semibold">
                <Link href="/signup">
                  Create Free Account
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}


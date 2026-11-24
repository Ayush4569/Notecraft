"use client";

import React from "react";
import { PenLine, Wand2, Share2 } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: PenLine,
    title: "Capture Thoughts Instantly",
    description: "Jump straight into a document in Guest Mode or your personal library. Format effortlessly with markdown shortcuts and fluid blocks.",
  },
  {
    step: "02",
    icon: Wand2,
    title: "Organize & Enhance with AI",
    description: "Nest pages under parents to build structured wikis. Let AI polish your prose, summarize transcripts, or fix complex formatting.",
  },
  {
    step: "03",
    icon: Share2,
    title: "Publish to the World",
    description: "Hit Publish to generate a lightning-fast public link. Anyone can read your formatted document without creating an account.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full max-w-5xl mx-auto px-4 py-16 scroll-mt-20">
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
          Simple Workflow
        </h2>
        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
          How Notecraft Works
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          From a stray thought to a published knowledge base in three simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STEPS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="relative p-6 rounded-2xl border border-border/80 bg-card/60 dark:bg-card/40 flex flex-col items-start space-y-4"
            >
              <div className="flex items-center justify-between w-full">
                <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-2xl font-bold text-muted-foreground/30">
                  {item.step}
                </span>
              </div>
              <h4 className="text-lg font-semibold tracking-tight">
                {item.title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}


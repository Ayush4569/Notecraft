"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { PartialBlock } from "@blocknote/core";
import { Sparkles, Terminal, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full flex items-center justify-center text-muted-foreground animate-pulse text-sm">
      Loading interactive editor preview...
    </div>
  ),
});

const DEMO_INITIAL_BLOCKS: PartialBlock[] = [
  {
    type: "heading",
    props: { level: 2 },
    content: "✨ Experience Notecraft's Block Canvas",
  },
  {
    type: "paragraph",
    content: "Click anywhere here to type, edit, or test formatting. This live preview lets you experience how fast and intuitive writing feels.",
  },
  {
    type: "bulletListItem",
    content: "Use '/' for slash commands like headings, code blocks, tables, and lists",
  },
  {
    type: "bulletListItem",
    content: "Built-in AI writing partner to rewrite, condense, and reformat",
  },
  {
    type: "bulletListItem",
    content: "Nested sub-pages for deeply organized personal knowledge bases",
  },
];

export function DemoEditor() {
  const initialBlocks = useMemo(() => DEMO_INITIAL_BLOCKS, []);

  return (
    <section id="demo" className="w-full max-w-5xl mx-auto px-4 py-16 scroll-mt-20">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Preview</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
          Try the Editor Right Here
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          No signup or setup needed. Click below to experience Notecraft&apos;s fluid block-based canvas.
        </p>
      </div>

      {/* Editor Mockup Container */}
      <div className="w-full rounded-2xl border border-border/80 shadow-2xl bg-card overflow-hidden transition-all dark:border-neutral-800">
        {/* Window Chrome Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40 dark:bg-neutral-900/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-green-400/80 inline-block" />
            <span className="ml-2 font-mono text-[11px] text-neutral-500 hidden sm:inline">
              notecraft-preview.md
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              <Terminal className="h-3 w-3" />
              Live Interactive Sandbox
            </span>
            <Button asChild size="sm" variant="ghost" className="h-7 text-xs px-2 hidden sm:inline-flex">
              <Link href="/guest">
                Open Fullscreen
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Live BlockNote Editor View */}
        <div className="p-4 sm:p-8 min-h-[320px] bg-background dark:bg-[#1F1F1F]">
          <Editor
            docId="demo-doc"
            initialContent={initialBlocks}
            editable={true}
            isGuest={true}
          />
        </div>
      </div>
    </section>
  );
}


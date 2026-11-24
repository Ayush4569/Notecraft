"use client";

import React from "react";
import {
  Layers,
  Sparkles,
  FolderTree,
  Globe,
  Moon,
  Trash2,
} from "lucide-react";

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: Layers,
    title: "Block-Based Dynamic Canvas",
    description: "Write without friction. Organize paragraphs, headings, checklists, code blocks, and tables using effortless slash commands.",
  },
  {
    icon: Sparkles,
    title: "Integrated AI Writing Assistant",
    description: "Format messy thoughts, summarize long research, correct grammar, and adjust tones with one-click integrated AI.",
    badge: "Smart",
  },
  {
    icon: FolderTree,
    title: "Infinite Nested Hierarchy",
    description: "Create sub-pages within sub-pages. Build interconnected wikis, technical documentation, or modular task trackers.",
  },
  {
    icon: Globe,
    title: "One-Click Web Publishing",
    description: "Publish your documents directly to the public web with read-only shareable links accessible in any browser.",
  },
  {
    icon: Moon,
    title: "Carefully Tuned Dark Mode",
    description: "Designed with a bespoke #1F1F1F dark theme that eliminates harsh glare and keeps your eyes relaxed during late hours.",
  },
  {
    icon: Trash2,
    title: "Trash & Safe Restoration",
    description: "Accidentally removed a note? Recover any deleted document and its sub-pages instantly with built-in trash retention.",
  },
];

export function Features() {
  return (
    <section id="features" className="w-full max-w-5xl mx-auto px-4 py-16 scroll-mt-20">
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
          Platform Capabilities
        </h2>
        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Everything You Need to Capture and Organize
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Thoughtfully crafted features designed for speed, visual clarity, and seamless organization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="group relative p-6 rounded-2xl border border-border/80 bg-card hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-200 hover:shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  {feature.badge && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-semibold tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


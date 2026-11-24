"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Can I use Notecraft without creating an account?",
    answer: "Yes! With our new Guest Mode, you can immediately begin creating, writing, and organizing documents directly in your browser with zero registration required. Your work is saved locally and can be transferred to a free account whenever you are ready.",
  },
  {
    question: "How does the AI writing assistant work?",
    answer: "Our integrated AI assistant allows you to highlight text or command the editor to rewrite, summarize, rephrase, expand, or fix grammar. Every free account includes 10 free AI trials, and upgrading to Pro grants unlimited AI credits.",
  },
  {
    question: "How does document web publishing work?",
    answer: "Every document in Notecraft has an instant 'Publish' toggle. When enabled, Notecraft generates a public shareable URL that renders a clean, read-only view of your note with matching light/dark styling for anyone on the internet.",
  },
  {
    question: "Is there a limit on how many notes I can create?",
    answer: "No. You can create unlimited documents, sub-pages, and nested hierarchies on both the Free and Pro plans without restrictions on notebook count.",
  },
  {
    question: "What happens if I accidentally delete a document?",
    answer: "Deleted notes are moved to your personal Trash drawer where they are safely retained. You can browse, inspect, and restore any document and its sub-pages back to your workspace at any time.",
  },
  {
    question: "Will my guest document be saved when I register?",
    answer: "Yes! When you transition from Guest Mode to creating a free account, Notecraft automatically detects your draft and atomically transfers it to your new registered account so no ideas are ever lost.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto px-4 py-16 scroll-mt-20">
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
          Got Questions?
        </h2>
        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Frequently Asked Questions
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Here are clear answers to the most common questions about Notecraft.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
              >
                <span className="font-semibold text-base sm:text-lg">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}


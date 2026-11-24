"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, UserPlus, LogIn, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/toolbar";
import Editor from "@/components/editor";
import {
  getGuestDocument,
  saveGuestDocument,
  createDefaultGuestDocument,
  GuestDocument,
} from "@/lib/guest-session";
import { Document } from "@/types/document";
import { PartialBlock } from "@blocknote/core";
import { useAppSelector } from "@/hooks/redux-hooks";

export default function GuestPage() {
  const router = useRouter();
  const { status } = useAppSelector((state) => state.user);
  const [doc, setDoc] = useState<GuestDocument | null>(null);

  // If user is already authenticated, redirect to /documents
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/documents");
    }
  }, [status, router]);

  // Load or initialize guest document
  useEffect(() => {
    const existing = getGuestDocument();
    if (existing) {
      setDoc(existing);
    } else {
      const newDoc = createDefaultGuestDocument();
      saveGuestDocument(newDoc);
      setDoc(newDoc);
    }
  }, []);

  const handleUpdateGuest = useCallback((data: Partial<Document>) => {
    setDoc((prev) => {
      if (!prev) return null;
      const updated = saveGuestDocument({
        ...prev,
        title: data.title !== undefined ? data.title : prev.title,
        icon: data.icon !== undefined ? (data.icon || null) : prev.icon,
        coverImage: data.coverImage !== undefined ? (data.coverImage || null) : prev.coverImage,
      });
      return updated;
    });
  }, []);

  const handleSaveBlocks = useCallback((blocks: PartialBlock[]) => {
    setDoc((prev) => {
      if (!prev) return null;
      const updated = saveGuestDocument({
        ...prev,
        content: {
          version: "1",
          blocks,
        },
      });
      return updated;
    });
  }, []);

  const handleReset = () => {
    if (window.confirm("Start a new guest document? Your current unsaved edits will be replaced.")) {
      const fresh = createDefaultGuestDocument();
      saveGuestDocument(fresh);
      setDoc(fresh);
    }
  };

  if (!doc) return null;

  // Adapt guest doc to Document interface for Toolbar
  const documentAdapter: Document = {
    id: doc.id,
    title: doc.title,
    content: doc.content,
    icon: doc.icon || undefined,
    coverImage: doc.coverImage || undefined,
    userId: "guest",
    parentId: null,
    isPublished: false,
    isTrashed: false,
    createdAt: new Date(doc.createdAt),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : null,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#1F1F1F]">
      {/* Top Guest Notice Bar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur dark:bg-[#1F1F1F]/90 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Guest Workspace
            </span>
            <span className="hidden sm:inline text-neutral-500 dark:text-neutral-400">
              — Your document is saved locally in this browser
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground"
              title="Reset to fresh guest document"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/login">
                <LogIn className="h-3.5 w-3.5 mr-1" />
                Sign in
              </Link>
            </Button>
            <Button asChild size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
              <Link href="/signup">
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                Save to Free Account
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Guest Document Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-8">
        <Toolbar
          doc={documentAdapter}
          isGuest={true}
          onUpdateGuest={handleUpdateGuest}
        />
        <div className="mt-4">
          <Editor
            docId={doc.id}
            initialContent={doc.content?.blocks as PartialBlock[]}
            editable={true}
            isGuest={true}
            onSaveGuest={handleSaveBlocks}
          />
        </div>
      </main>

      {/* Floating Bottom Reminder */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[calc(100%-2rem)] bg-neutral-900/90 text-neutral-100 dark:bg-neutral-800/90 dark:text-neutral-100 px-4 py-3 rounded-full shadow-lg border border-neutral-700/50 backdrop-blur flex items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="truncate">Want cloud sync, AI formatting & public publishing?</span>
        </div>
        <Button asChild size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1 h-7 shrink-0">
          <Link href="/signup">
            Sign Up Free
          </Link>
        </Button>
      </footer>
    </div>
  );
}

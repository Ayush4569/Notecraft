"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-context";
import { useAppSelector } from "@/hooks/redux-hooks";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export default function GuestPage() {
  const router = useRouter();
  const { status } = useAppSelector((state) => state.user);
  const { startGuestSession } = useAuthContext();
  const [initError, setInitError] = useState<string | null>(null);
  const initializingRef = useRef(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/documents");
      return;
    }

    if (status === "unauthenticated" && !initializingRef.current) {
      initializingRef.current = true;
      startGuestSession()
        .then((docId) => {
          toast.success("Guest workspace initialized! 3 AI trials available.");
          if (docId) {
            router.replace(`/documents/${docId}`);
          } else {
            router.replace("/documents");
          }
        })
        .catch((err) => {
          console.error("Failed to start guest session:", err);
          setInitError(getApiErrorMessage(err));
          initializingRef.current = false;
        });
    }
  }, [status, startGuestSession, router]);

  const handleRetry = () => {
    setInitError(null);
    initializingRef.current = true;
    startGuestSession()
      .then((docId) => {
        toast.success("Guest workspace initialized!");
        if (docId) {
          router.replace(`/documents/${docId}`);
        } else {
          router.replace("/documents");
        }
      })
      .catch((err) => {
        setInitError(getApiErrorMessage(err));
        initializingRef.current = false;
      });
  };

  if (initError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background dark:bg-[#1F1F1F] text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive animate-pulse" />
        <h2 className="text-xl font-bold tracking-tight">Could Not Start Guest Mode</h2>
        <p className="text-sm text-muted-foreground max-w-md">{initError}</p>
        <Button onClick={handleRetry} className="gap-2 cursor-pointer">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-[#1F1F1F] p-4 text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Setting Up Your Guest Workspace</h2>
        <p className="text-xs text-muted-foreground">
          Preparing notes canvas, sidebar navigation, and 3 AI formatting trials...
        </p>
      </div>
    </div>
  );
}

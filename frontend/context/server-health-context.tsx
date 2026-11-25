"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { registerServerStatusListener, checkServerHealth } from "@/lib/api/client";
import { queryClient } from "@/helpers/tanstack";
import { CloudLightning, CheckCircle2, RefreshCw } from "lucide-react";

interface ServerHealthContextValue {
  isWakingUp: boolean;
  statusMessage: string | null;
  retryConnection: () => Promise<void>;
}

const ServerHealthContext = createContext<ServerHealthContextValue>({
  isWakingUp: false,
  statusMessage: null,
  retryConnection: async () => {},
});

export const ServerHealthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef(0);
  const isWakingUpRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    attemptsRef.current = 0;
  }, []);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const markServerOnline = useCallback(() => {
    stopPolling();
    if (!isWakingUpRef.current) return;

    clearDismissTimer();
    setIsOnline(true);
    setStatusMessage("Server is ready! Resuming your session...");
    void queryClient.invalidateQueries();

    dismissTimerRef.current = setTimeout(() => {
      isWakingUpRef.current = false;
      setIsWakingUp(false);
      setIsOnline(false);
      setStatusMessage(null);
      dismissTimerRef.current = null;
    }, 2000);
  }, [stopPolling, clearDismissTimer]);

  const triggerWakeUpPolling = useCallback(() => {
    if (pollingRef.current) return; // Already polling

    clearDismissTimer();
    isWakingUpRef.current = true;
    setIsWakingUp(true);
    setIsOnline(false);
    setStatusMessage("Server is waking up (Render cold start). Please hold on...");

    attemptsRef.current = 0;
    pollingRef.current = setInterval(async () => {
      attemptsRef.current += 1;
      const healthy = await checkServerHealth();

      if (healthy) {
        markServerOnline();
      } else if (attemptsRef.current >= 15) {
        // Stop after ~45 seconds
        stopPolling();
        setStatusMessage("Server is taking longer than expected. Please check your connection.");
        dismissTimerRef.current = setTimeout(() => {
          isWakingUpRef.current = false;
          setIsWakingUp(false);
          setStatusMessage(null);
          dismissTimerRef.current = null;
        }, 5000);
      } else {
        setStatusMessage(`Server is waking up (attempt ${attemptsRef.current}/15)...`);
      }
    }, 3000);
  }, [stopPolling, clearDismissTimer, markServerOnline]);

  useEffect(() => {
    let isMounted = true;

    // Immediate server availability check on application initialization / visit
    checkServerHealth()
      .then((healthy) => {
        if (!isMounted) return;
        if (!healthy) {
          triggerWakeUpPolling();
        } else if (isWakingUpRef.current) {
          markServerOnline();
        }
      })
      .catch(() => {
        if (isMounted) {
          triggerWakeUpPolling();
        }
      });

    const unregister = registerServerStatusListener((status) => {
      if (!isMounted) return;
      if (status === "waking" || status === "offline") {
        triggerWakeUpPolling();
      } else if (status === "online") {
        markServerOnline();
      }
    });

    return () => {
      isMounted = false;
      unregister();
      stopPolling();
      clearDismissTimer();
    };
  }, [triggerWakeUpPolling, stopPolling, clearDismissTimer, markServerOnline]);

  const retryConnection = async () => {
    triggerWakeUpPolling();
  };

  return (
    <ServerHealthContext.Provider value={{ isWakingUp, statusMessage, retryConnection }}>
      {children}
      {/* Floating Ambient Wake-up Indicator */}
      {isWakingUp && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 bg-background/95 dark:bg-[#252525]/95 border-amber-500/30 text-foreground backdrop-blur-md"
        >
          {isOnline ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 animate-bounce" />
          ) : (
            <CloudLightning className="h-5 w-5 text-amber-500 shrink-0 animate-pulse" />
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-xs tracking-wide uppercase text-muted-foreground">
              {isOnline ? "Connected" : "Backend Starting Up"}
            </span>
            <span className="text-xs md:text-sm font-medium">{statusMessage}</span>
          </div>
          {!isOnline && (
            <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin ml-2 shrink-0" />
          )}
        </div>
      )}
    </ServerHealthContext.Provider>
  );
};

export const useServerHealth = () => useContext(ServerHealthContext);

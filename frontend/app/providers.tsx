"use client";
import { persistor, store } from "@/redux/store";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/helpers/tanstack";
import { CommandMenu } from "@/components/command-menu";
import axios from "axios";
import { useEffect } from "react";
import AppInit from "./app-init";

export default function Providers({
  children,
  tokenStatus,
}: {
  children: React.ReactNode;
  tokenStatus: { hasAccessToken: boolean; hasRefreshToken: boolean };
}) {
  useEffect(() => {
    if (!tokenStatus.hasAccessToken && tokenStatus.hasRefreshToken) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/refresh-token`,
          null,
          { withCredentials: true }
        )
        .catch((err) => console.error("Refresh failed:", err));
    }
  }, [tokenStatus.hasAccessToken, tokenStatus.hasRefreshToken]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CommandMenu />
            <Toaster position="bottom-center" />
            <AppInit hasAccessToken={tokenStatus.hasAccessToken} />
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}


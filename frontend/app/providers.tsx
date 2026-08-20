"use client";
import { persistor, store } from "@/redux/store";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/helpers/tanstack";
import { CommandMenu } from "@/components/command-menu";
import AppInit from "./app-init";

export default function Providers({
  children,
  tokenStatus,
}: {
  children: React.ReactNode;
  tokenStatus: { hasAccessToken: boolean; hasRefreshToken: boolean };
}) {
  
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
            <Toaster position="bottom-center" visibleToasts={2} />
            <AppInit hasRefreshToken={tokenStatus.hasRefreshToken} hasAccessToken={tokenStatus.hasAccessToken} />
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}


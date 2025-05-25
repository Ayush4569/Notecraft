"use client";
import { persistor, store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/helpers/tanstack";
import { CommandMenu } from "@/components/command-menu";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <CommandMenu/>
              <Toaster position="bottom-center" />

              {children}
            </ThemeProvider>
          </SessionProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

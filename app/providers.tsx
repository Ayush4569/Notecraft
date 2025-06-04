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
import { EdgeStoreProvider } from "@/lib/edgestore";
import { CoverImageModal } from "@/components/cover-image-modal";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <CommandMenu/>
              <CoverImageModal/>
              <Toaster position="bottom-center" />

              {children}
            </ThemeProvider>
            </EdgeStoreProvider>
          </SessionProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

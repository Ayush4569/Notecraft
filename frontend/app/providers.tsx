"use client";

import { persistor, store } from "@/redux/store";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/helpers/tanstack";
import { CommandMenu } from "@/components/command-menu";
import { AuthProvider } from "@/context/auth-context";
import { ServerHealthProvider } from "@/context/server-health-context";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
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
            <AuthProvider>
              <ServerHealthProvider>
                <CommandMenu />
                <Toaster position="bottom-center" visibleToasts={2} />
                {children}
              </ServerHealthProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

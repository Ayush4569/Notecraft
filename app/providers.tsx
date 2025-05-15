"use client";
import { store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/helpers/tanstack";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
{/* <PersistGate persistor={persistor} loading={null}> */}
<SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster
              position="bottom-center"
              />

            {children}
          </ThemeProvider>
        </SessionProvider>
      {/* </PersistGate> */}
      </QueryClientProvider>
      
    </Provider>
  );
}

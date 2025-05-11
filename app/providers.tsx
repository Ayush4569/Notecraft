"use client";
import { persistor, store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#1f1f1f",
                  padding: "12px 16px",
                  color: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "1.5",
                },
                success: {
                  style: {
                    background: "#22c55e",
                    color: "#fff",
                  },
                },
                error: {
                  style: {
                    background: "#ef4444",
                    color: "#fff",
                  },
                },
              }}
            />

            {children}
          </ThemeProvider>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}

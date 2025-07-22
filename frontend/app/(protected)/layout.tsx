import React from "react";
import Navbar from "@/app/(root)/_components/navbar";
export default function ProtectedPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <Navbar isSubscriptionPage />
      {children}
    </div>
  );
}

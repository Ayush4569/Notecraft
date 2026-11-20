import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background dark:bg-[#1F1F1F]">
      {children}
    </div>
  );
}

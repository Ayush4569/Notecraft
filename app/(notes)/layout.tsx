'use client'
import { useSession } from "next-auth/react";
import Loading from "../loading";
import Sidebar from "./_components/sidebar";

export default function ({ children }: { children: React.ReactNode }) {
  const session = useSession();
  if (session.status === "loading") {
    return <Loading/>
  }
  return (
    <div className="flex h-full w-full dark:bg-[#1F1F1F]">
      <Sidebar/>
      <main className="flex-1 h-full overflow-y-auto">
      {children}
      </main>
    </div>
  );
}

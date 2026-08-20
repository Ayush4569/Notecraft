'use client'
import { useAppSelector } from "@/hooks/redux-hooks";
import Loading from "../loading";
import Sidebar from "./_components/sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DocumnentLayout({ children }: { children: React.ReactNode }) {
  const {status} = useAppSelector(state=>state.user);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);
  
  if(status === "unauthenticated") {
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

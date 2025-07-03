'use client'
import { useAppSelector } from "@/hooks/redux-hooks";
import Loading from "../loading";
import Sidebar from "./_components/sidebar";

export default function ({ children }: { children: React.ReactNode }) {
  const {status,name} = useAppSelector(state=>state.user);
  console.log("User Name:", name,status);
  
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

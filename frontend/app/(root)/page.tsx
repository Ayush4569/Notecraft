'use client'
import { useEffect } from "react";
import Footer from "./_components/footer";
import Heading from "./_components/heading";
import { Hero } from "./_components/hero";
import { useAppSelector } from "@/hooks/redux-hooks";
import { queryClient } from "@/helpers/tanstack";
import { usePathname } from "next/navigation";
export default function Home() {
  const user = useAppSelector((state) => state.user);
  const pathname = usePathname()
  useEffect(() => {
    if (!user.isPro && pathname.startsWith("/subscriptions")) {
      const interval = setInterval(() => {
        queryClient.refetchQueries({ queryKey: ["user"] });
      }, 3000)
      return () => clearInterval(interval);
    }

  }, [user.isPro, pathname]);
  useEffect(() => {
    if (user.isPro) {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  }, [user.isPro]);

  return (
    <div className="min-h-full flex flex-col dark:bg-[#1f1f1f]">
      <div className="flex flex-col justify-center items-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <Heading />
        <Hero />
      </div>
      <Footer />
    </div>
  );
}


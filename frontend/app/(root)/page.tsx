// 'use client'
import { useEffect } from "react";
import Footer from "./_components/footer";
import Heading from "./_components/heading";
import { Hero } from "./_components/hero";
export default function Home() {

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


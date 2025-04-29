import React from "react";
import Navbar from "./_components/navbar";
export default function ({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full dark:bg-[#1f1f1f]">
            <Navbar/>
            <main className="h-full pt-28">
                {children}
            </main>
        </div>
    )
}

"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/hooks/redux-hooks";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const heading = () => {
  const {status,name} = useAppSelector((state) => state.user);
  console.log("User name:", name,status);
  
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <span className="underline">Notecraft</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Notecraft is the connected workspace for your ideas, documents, and
        plans.
      </h3>
      {status === "loading" && (
        <div className="flex w-full justify-center">
           <Skeleton className="h-9 w-44 bg-neutral-200 dark:bg-neutral-700 animate-out rounded-sm" />
        </div>
      )}
      {status === "authenticated" && (
        <Button asChild className="text-lg">
          <Link href='/documents'>
          use notecraft
          <ArrowRight className="h-6 w-6 ml-2" />
          </Link>
        </Button>
      )}
      {
        status !== 'loading' && status === 'unauthenticated' && (
          <Button asChild className="text-lg">
          <Link href='/login'>
          Login to start
          <ArrowRight className="h-6 w-6 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default heading;

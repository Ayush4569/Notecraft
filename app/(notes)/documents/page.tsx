import Image from "next/image";
import React from "react";
import { DialogComponent } from "./_components/dialog";

export default function Documents() {

  return (
    <div className="h-full flex flex-col justify-center items-center gap-y-4 ">
      <Image
        src="/unboxing.svg"
        alt="unboxing"
        width={300}
        className="dark:hidden"
        height={300}
      />
      <Image
        src="/unboxing-dark.svg"
        alt="unboxing"
        width={300}
        className="hidden dark:block"
        height={300}
      />

      <h2 className="text-xl font-medium">Welcome to your workspace</h2>
      <DialogComponent/>
    </div>
  );
}

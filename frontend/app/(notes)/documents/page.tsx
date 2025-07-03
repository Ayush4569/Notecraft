import Image from "next/image";
import React from "react";
import { DialogComponent } from "./_components/dialog";

export default function Documents() {
  const unboxingStyles = {
    width: "300px",
    height: "250px",
  };
  return (
    <div className="h-full flex flex-col justify-center items-center gap-y-4 ">
      <Image
        src="/unboxing.svg"
        alt="unboxing"
        priority
        width={300}
        className="dark:hidden"
        height={250}
        style={unboxingStyles}
      />
      <Image
        src="/unboxing-dark.svg"
        alt="unboxing"
        width={300}
        priority
        className="hidden dark:block"
        height={250}
        style={unboxingStyles}
      />

      <h2 className="text-xl font-medium">Welcome to your workspace</h2>
      <DialogComponent />
    </div>
  );
}

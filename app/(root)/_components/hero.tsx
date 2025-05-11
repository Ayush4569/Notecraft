import Image from "next/image";
import React from "react";

export const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center gap-x-4">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
          <Image
            src="/document.svg"
            alt="document"
            fill
            className="object-contain dark:invert "
          />
        </div>
        <div className="relative w-[400px] h-[400px] hidden md:block">
          <Image
            src="/reading-l.webp"
            alt="reading"
            fill
            className="object-contain dark:invert"
          />
        </div>
      </div>
    </div>
  );
};

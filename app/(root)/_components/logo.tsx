import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function () {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image src="/logo.jpg" alt="Logo" width="40" height='40' />
      <p className={cn("font-semibold",font.className)}>Notecraft</p>
    </div>
  );
}

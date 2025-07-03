import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function () {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <p className={cn("font-semibold",font.className)}>Notecraft</p>
    </div>
  );
}

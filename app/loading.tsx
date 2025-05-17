import { Loader2 } from "lucide-react";

export default function () {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader2
        className="animate-spin text-purple-600 dark:text-fuchsia-400"
        size={70}
      />
    </div>
  );
}

import { Loader2 } from "lucide-react";

 export default function (){
  return (
    <div className="h-screen w-screen flex items-center justify-center">
    <Loader2 className="animate-spin text-cyan-700 dark:invert" size={80} />
  </div>
  )
 }
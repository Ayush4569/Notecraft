import { Button } from "@/components/ui/button";
import Logo from "./logo";

export default function (){
    return (
        <div className="flex items-center w-full p-3 bg-background z-50 dark:bg-[#1f1f1f]">
          <Logo/>
          <div className="flex w-full items-center md:justify-end justify-between md:ml-auto gap-x-2 text-muted-foreground">
            <Button variant='ghost'>
              Privacy Policy 
            </Button>
            <Button variant='ghost'>
              Terms & Conditions
            </Button>
          </div>
        </div>
    )
}
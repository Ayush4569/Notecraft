import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Sidebar } from "./sidebar";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden z-20 h-max absolute top-6 left-6  transition bg-none">
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle className="sr-only">menu</SheetTitle>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}

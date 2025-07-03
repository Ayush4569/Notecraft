import { ModeToggle } from "@/components/mode-toggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle,DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Settings } from "lucide-react";

export function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger >
      <div className="group min-h-[27px] text-sm py-1 px-2 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-semibold gap-x-2 cursor-pointer">
        <Settings className="h-[18px] shrink-0 text-muted-foreground" />
        <span className="truncate">Settings</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>
        </DialogTitle>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-muted-foreground text-[0.8rem]">
             <DialogDescription> customize how you workspace looks like</DialogDescription>
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
}

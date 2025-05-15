"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateDocuments } from "@/hooks/useCreateDocument";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";

export function DialogComponent() {
  const [title, setTitle] = useState<string>("");
  const { mutate: createDocument, isPending } = useCreateDocuments();

  const handleCreate = () => {
    createDocument(title); 
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button >
          <PlusCircleIcon className="h-4 w-4" />
          Create a note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create note</DialogTitle>
          <DialogDescription>
            Create your note and start editing now.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="note" className="sr-only">
              Note
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="note"
              placeholder="Enter your note title"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button disabled={isPending} type="button" onClick={handleCreate}>
             {
                isPending ? "creating..." : "create"
             }
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

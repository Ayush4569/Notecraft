import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { onClose } from "@/redux/slices/imagemodal";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import axios from "axios";
import { useRef } from "react";
import { toast } from "sonner";

export function CoverImageModal() {
  const { isOpen } = useAppSelector((state) => state.imageModal);
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (fileRef.current?.files?.[0]) {
      return;
    }
    formData.append("file", fileRef.current?.files?.[0] !);
    const response = await axios.post("/api/upload", formData)
    const result = response.data
    console.log(result);
  }
  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(onClose())}>
      <DialogContent>
        <DialogTitle>
          <DialogHeader>
            <h2 className="text-center text-lg font-bold">Cover Image</h2>
          </DialogHeader>
        </DialogTitle>

            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
              <label className="flex flex-col ">
                <span>Upload a file</span>
                <input ref={fileRef} type="file" name="file" />
              </label>
              <Button  type="submit">Submit</Button>
            </form>
      </DialogContent>
    </Dialog>
  );
}

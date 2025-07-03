import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileRejection, useDropzone } from "react-dropzone";
import React, { useCallback, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEditDocument } from "@/hooks/useUpdateDocument";

interface CoverImageModalProps {
  docId: string;
  children: React.ReactNode;
}

export function CoverImageModal({
  children,
  docId,
}: CoverImageModalProps) {
  const { mutate } = useEditDocument();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onDrop = useCallback(async (files: File[]) => {
    const uploadedFile = files[0];
    if (!uploadedFile) {
      toast.error("No file selected");
      return;
    }
    try {
      setIsUploading(true);
      const getSignedUrlWithKey = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/cover-image`, {
        fileName: uploadedFile.name,
        fileType: uploadedFile.type,
        docId,
      },{
        withCredentials:true
      });
      if (getSignedUrlWithKey.data.success) {
        const { url, key } = getSignedUrlWithKey.data;
        await axios.put(url, uploadedFile);
        mutate({ docId, data: { coverImage: key } });
        toast.success("Image uploaded");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload image");
    } finally {
      setIsOpen(false);
      setIsUploading(false);
    }
  }, []);
  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      const file = rejectedFiles[0];
      if (file.errors[0].code === "too-many-files") {
        toast.error("Only one cover image is allowed");
      }
      if (file.errors[0].code === "file-too-large") {
        toast.error("File size must not exceed 15MB");
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 15,
    accept: {
      "image/*": [],
    },
  });
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload cover image</DialogTitle>
          <DialogDescription>
            Upload cover image for you document
          </DialogDescription>
          <Card
            className={cn(
              "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full md:h-52",
              isDragActive
                ? "border-primary bg-primary/10 border-solid"
                : "border-border hover:border-primary"
            )}
            {...getRootProps()}
          >
            <CardContent className="flex flex-col items-center justify-center h-full w-full">
              {isUploading ? (
                <>
                <Loader2
                  className="animate-spin text-purple-600 dark:text-fuchsia-400"
                  size={50}
                />
                <p className="text-muted-foreground">Uploading..</p>
                </>
                
              ) : (
                <>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-center">Drop the files here</p>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full w-full gap-y-3">
                      <p>
                        Drag n drop some files here, or click to select files
                      </p>
                      <Button disabled={isUploading}>Select files</Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

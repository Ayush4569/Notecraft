import { cn } from "@/lib/utils";
import Image from "next/image";
import { CoverImageModal } from "@/components/cover-image-modal";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { useEditDocument } from "@/hooks/useUpdateDocument";
import axios from "axios";
import { toast } from "sonner";
export function CoverImage({
  coverImage,
  imageKey,
  preview,
  docId,
}: {
  coverImage: string;
  preview?: boolean;
  docId: string;
  imageKey?: string;
}) {
  const { mutate } = useEditDocument();
  
  const deleteCoverImage = async () => {
    if(!imageKey) return;
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/delete?url=${imageKey}`;
    try {
      const response = await axios.delete(url, {
        withCredentials: true,
      });

      if (!response.data.success) {
      toast.error("Failed to delete cover image");
      }
      mutate({ docId, data: { coverImage: null } });
    } catch (error) {
      console.error("Error deleting cover image:", error);
    }
   
  };

  return (
    <div
      className={cn(
        "relative w-full h-[38vh] group",
        !coverImage && "h-[12vh]",
        coverImage && "bg-muted"
      )}
    >
      {coverImage && (
        <Image
          fill
          src={coverImage}
          alt="cover-image"
          className="object-cover"
          priority
        />
      )}
      {!preview && coverImage && (
        <div className="flex items-center gap-x-2 absolute bottom-5 right-3.5 md:right-5 md:opacity-0 md:group-hover:opacity-100 transition-all">
          <CoverImageModal docId={docId}>
            <Button className="flex items-center cursor-pointer gap-x-0.5">
              <ImageIcon className="h-4 w-4" />
              Replace image
            </Button>
          </CoverImageModal>
          <Button
            onClick={deleteCoverImage}
            className="flex items-center cursor-pointer gap-x-0.5"
          >
            <X className="h-4 w-4" />
            Remove image
          </Button>
        </div>
      )}
    </div>
  );
}

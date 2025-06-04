import { cn } from "@/lib/utils";
import Image from "next/image";
import { ImageUpload } from "./image-upload";
export function CoverImage({
  imageUrl,
  preview,
}: {
  imageUrl: string;
  preview?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full h-[38vh] group",
        !imageUrl && "h-[12vh]",
        imageUrl && "bg-muted"
      )}
    >
      {imageUrl && (
        <Image fill src={imageUrl} alt="cover-image" className="object-cover" />
      )}
      {imageUrl && (
        <ImageUpload/>
      )}
    </div>
  );
}

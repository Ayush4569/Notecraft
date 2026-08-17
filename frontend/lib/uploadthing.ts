import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "../../server/src/lib/uploadthing";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>({
  url: "/api/uploadthing", // Relative to backend proxied url
});

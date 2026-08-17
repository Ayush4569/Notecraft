/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing, uploadFiles } = generateReactHelpers<any>({
  url: "/api/uploadthing", // Relative to backend proxied url
});

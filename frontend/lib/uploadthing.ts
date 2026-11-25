/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateReactHelpers } from "@uploadthing/react";
import { getAccessToken } from "@/lib/api/client";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";

const UPLOADTHING_URL = `${BASE_URL}/uploadthing`;

const uploadthingFetch: typeof fetch = (input, init) => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
      ? input.toString()
      : input.url;

  if (url.startsWith(UPLOADTHING_URL)) {
    const token = getAccessToken();
    const headers = new Headers(init?.headers);
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(input, {
      ...init,
      headers,
      credentials: "include",
    });
  }

  return fetch(input, init);
};

export const { useUploadThing, uploadFiles } = generateReactHelpers<any>({
  url: UPLOADTHING_URL,
  fetch: uploadthingFetch,
});

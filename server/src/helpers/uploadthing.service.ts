import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const generateSignedUrl = async (key: string, expiry?: number): Promise<string> => {
  // Uploadthing URLs are already public and permanent, so we return the key/URL directly.
  return key;
};

export const deleteObject = async (key: string): Promise<boolean> => {
  try {
    // If key is a full URL, extract the key portion after '/f/'
    let uploadthingKey = key;
    if (key.includes("/f/")) {
      uploadthingKey = key.split("/f/")[1];
    }
    await utapi.deleteFiles(uploadthingKey);
    return true;
  } catch (error) {
    console.error("Error deleting object from Uploadthing:", error);
    return false;
  }
};

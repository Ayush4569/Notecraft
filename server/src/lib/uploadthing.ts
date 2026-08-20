import { createUploadthing, type FileRouter } from "uploadthing/express";
import jwt from "jsonwebtoken";

const f = createUploadthing();

export const uploadRouter = {
  coverImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(({ req }) => {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new Error("Unauthorized");
      }

      try {
        const decoded = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as { id: string };
        if (decoded && decoded.id) {
          return { userId: decoded.id };
        }
      } catch (err) {
        throw new Error("Invalid token");
      }
      throw new Error("Unauthorized");
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Cover image upload complete for userId:", metadata.userId);
      console.log("file url:", file.ufsUrl);
    }),

  documentImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(({ req }) => {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new Error("Unauthorized");
      }

      try {
        const decoded = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as { id: string };
        if (decoded && decoded.id) {
          return { userId: decoded.id };
        }
      } catch (err) {
        throw new Error("Invalid token");
      }
      throw new Error("Unauthorized");
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Document image upload complete for userId:", metadata.userId);
      console.log("file url:", file.ufsUrl);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

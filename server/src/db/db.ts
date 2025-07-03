import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient()
export async function dbConnect() {
  try {
    await prisma.$connect();
    console.log("connected db")
  } catch (error) {
    console.log('error connecting db', error);
  }
}
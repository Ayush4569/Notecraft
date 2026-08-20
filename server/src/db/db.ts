import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient()
export async function dbConnect() {
  try {
    await prisma.$connect();
    console.log("DB CONNECTED !!")
  } catch (error) {
    console.log('error connecting db', error);
    process.exit(1)
  }
}
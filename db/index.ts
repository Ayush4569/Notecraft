import { PrismaClient } from "@/lib/generated/prisma";

const generatePrismaSingleTon =()=> new PrismaClient();

type PrismaClientSingleton = ReturnType<typeof generatePrismaSingleTon>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? generatePrismaSingleTon();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
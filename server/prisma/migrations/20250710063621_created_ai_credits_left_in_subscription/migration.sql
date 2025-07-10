-- AlterEnum
ALTER TYPE "subscriptionStatus" ADD VALUE 'created';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "aiCreditsLeft" INTEGER NOT NULL DEFAULT 0;

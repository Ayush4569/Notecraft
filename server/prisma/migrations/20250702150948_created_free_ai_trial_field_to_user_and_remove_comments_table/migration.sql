/*
  Warnings:

  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_documentId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "freeAiTrials" INTEGER NOT NULL DEFAULT 10;

-- DropTable
DROP TABLE "Comments";

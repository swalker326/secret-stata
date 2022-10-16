/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `List` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "List" DROP COLUMN "updatedAt",
ADD COLUMN     "gifts" TEXT[];

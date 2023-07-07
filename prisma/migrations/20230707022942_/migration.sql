/*
  Warnings:

  - You are about to drop the column `type` on the `Metadata` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Metadata" DROP COLUMN "type",
ADD COLUMN     "types" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

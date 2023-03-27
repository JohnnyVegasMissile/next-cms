/*
  Warnings:

  - You are about to drop the column `LinkedContainerId` on the `Metadata` table. All the data in the column will be lost.
  - You are about to drop the column `LinkedContentId` on the `Metadata` table. All the data in the column will be lost.
  - You are about to drop the column `LinkedPageId` on the `Metadata` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[containerId]` on the table `Slug` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_LinkedContainerId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_LinkedContentId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_LinkedPageId_fkey";

-- AlterTable
ALTER TABLE "Metadata" DROP COLUMN "LinkedContainerId",
DROP COLUMN "LinkedContentId",
DROP COLUMN "LinkedPageId",
ADD COLUMN     "linkedContainerId" INTEGER,
ADD COLUMN     "linkedContentId" INTEGER,
ADD COLUMN     "linkedPageId" INTEGER;

-- AlterTable
ALTER TABLE "Slug" ADD COLUMN     "containerId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Slug_containerId_key" ON "Slug"("containerId");

-- AddForeignKey
ALTER TABLE "Slug" ADD CONSTRAINT "Slug_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_linkedPageId_fkey" FOREIGN KEY ("linkedPageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_linkedContainerId_fkey" FOREIGN KEY ("linkedContainerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_linkedContentId_fkey" FOREIGN KEY ("linkedContentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

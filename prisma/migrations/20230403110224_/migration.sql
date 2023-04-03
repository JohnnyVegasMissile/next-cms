/*
  Warnings:

  - A unique constraint covering the columns `[contentId]` on the table `Slug` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Slug" ADD COLUMN     "contentId" TEXT,
ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Slug_contentId_key" ON "Slug"("contentId");

-- AddForeignKey
ALTER TABLE "Slug" ADD CONSTRAINT "Slug_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Slug"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slug" ADD CONSTRAINT "Slug_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

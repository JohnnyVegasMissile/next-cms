/*
  Warnings:

  - You are about to drop the column `mediaId` on the `Metadata` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_mediaId_fkey";

-- AlterTable
ALTER TABLE "Metadata" DROP COLUMN "mediaId";

-- AlterTable
ALTER TABLE "MetadataValue" ADD COLUMN     "mediaId" TEXT;

-- AddForeignKey
ALTER TABLE "MetadataValue" ADD CONSTRAINT "MetadataValue_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

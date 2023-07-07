/*
  Warnings:

  - The values [PO] on the enum `CodeLanguage` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `content` on the `Metadata` table. All the data in the column will be lost.
  - You are about to drop the column `linkedContainerId` on the `Metadata` table. All the data in the column will be lost.
  - You are about to drop the column `linkedContentId` on the `Metadata` table. All the data in the column will be lost.
  - You are about to drop the column `linkedPageId` on the `Metadata` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Metadata` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Section` table. All the data in the column will be lost.
  - Added the required column `value` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CodeLanguage_new" AS ENUM ('AF', 'SQ', 'AR', 'EU', 'BE', 'BG', 'CA', 'ZH', 'HR', 'CS', 'DA', 'NL', 'EN', 'ET', 'FO', 'FA', 'FI', 'FR', 'GD', 'DE', 'EL', 'HE', 'HI', 'HU', 'IS', 'ID', 'GA', 'IT', 'JA', 'KO', 'KU', 'LV', 'LT', 'MK', 'ML', 'MS', 'MT', 'NO', 'NB', 'NN', 'PL', 'PT', 'PA', 'RM', 'RO', 'RU', 'SR', 'SK', 'SL', 'SB', 'ES', 'SV', 'TH', 'TS', 'TN', 'TR', 'UA', 'UR', 'VE', 'VI', 'CY', 'XH', 'JI', 'ZU');
ALTER TABLE "Section" ALTER COLUMN "language" DROP DEFAULT;
ALTER TABLE "Section" ALTER COLUMN "language" TYPE "CodeLanguage_new" USING ("language"::text::"CodeLanguage_new");
ALTER TYPE "CodeLanguage" RENAME TO "CodeLanguage_old";
ALTER TYPE "CodeLanguage_new" RENAME TO "CodeLanguage";
DROP TYPE "CodeLanguage_old";
ALTER TABLE "Section" ALTER COLUMN "language" SET DEFAULT 'EN';
COMMIT;

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_linkedContainerId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_linkedContentId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_linkedPageId_fkey";

-- AlterTable
ALTER TABLE "Metadata" DROP COLUMN "content",
DROP COLUMN "linkedContainerId",
DROP COLUMN "linkedContentId",
DROP COLUMN "linkedPageId",
DROP COLUMN "name",
ADD COLUMN     "containerId" TEXT,
ADD COLUMN     "contentId" TEXT,
ADD COLUMN     "mediaId" TEXT,
ADD COLUMN     "pageId" TEXT,
ADD COLUMN     "type" TEXT[];

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "content",
ADD COLUMN     "value" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "MetadataValue" (
    "id" TEXT NOT NULL,
    "metadataId" TEXT NOT NULL,
    "number" DOUBLE PRECISION,
    "string" TEXT,
    "boolean" BOOLEAN,
    "linkId" TEXT,

    CONSTRAINT "MetadataValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetadataValue" ADD CONSTRAINT "MetadataValue_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "Metadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetadataValue" ADD CONSTRAINT "MetadataValue_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

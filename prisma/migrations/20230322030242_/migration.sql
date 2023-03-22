/*
  Warnings:

  - You are about to drop the column `pageId` on the `Metadata` table. All the data in the column will be lost.
  - Added the required column `containerId` to the `ContainerField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `multiple` to the `ContainerField` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LinkedToSection" DROP CONSTRAINT "LinkedToSection_formId_fkey";

-- DropForeignKey
ALTER TABLE "LinkedToSection" DROP CONSTRAINT "LinkedToSection_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "LinkedToSection" DROP CONSTRAINT "LinkedToSection_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_pageId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_pageId_fkey";

-- DropForeignKey
ALTER TABLE "Slug" DROP CONSTRAINT "Slug_pageId_fkey";

-- AlterTable
ALTER TABLE "ContainerField" ADD COLUMN     "containerId" INTEGER NOT NULL,
ADD COLUMN     "defaultDateValue" TIMESTAMP(3),
ADD COLUMN     "defaultMultipleDateValue" TIMESTAMP(3)[],
ADD COLUMN     "defaultMultipleNumberValue" DOUBLE PRECISION[],
ADD COLUMN     "defaultMultipleTextValue" TEXT[],
ADD COLUMN     "defaultNumberValue" DOUBLE PRECISION,
ADD COLUMN     "defaultTextValue" TEXT,
ADD COLUMN     "multiple" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Metadata" DROP COLUMN "pageId",
ADD COLUMN     "LinkedContainerId" INTEGER,
ADD COLUMN     "LinkedContentId" INTEGER,
ADD COLUMN     "LinkedPageId" INTEGER;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "sidePageId" INTEGER;

-- CreateTable
CREATE TABLE "Container" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "containerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentField" (
    "id" SERIAL NOT NULL,
    "contentId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "type" "ContainerFieldType" NOT NULL,
    "multiple" BOOLEAN NOT NULL,
    "releatedFieldId" INTEGER NOT NULL,
    "textValue" TEXT,
    "multipleTextValue" TEXT[],
    "numberValue" DOUBLE PRECISION,
    "multipleNumberValue" DOUBLE PRECISION[],
    "dateValue" TIMESTAMP(3),
    "multipleDateValue" TIMESTAMP(3)[],

    CONSTRAINT "ContentField_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Slug" ADD CONSTRAINT "Slug_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_LinkedPageId_fkey" FOREIGN KEY ("LinkedPageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_LinkedContainerId_fkey" FOREIGN KEY ("LinkedContainerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_LinkedContentId_fkey" FOREIGN KEY ("LinkedContentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_sidePageId_fkey" FOREIGN KEY ("sidePageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedToSection" ADD CONSTRAINT "LinkedToSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedToSection" ADD CONSTRAINT "LinkedToSection_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedToSection" ADD CONSTRAINT "LinkedToSection_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContainerField" ADD CONSTRAINT "ContainerField_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentField" ADD CONSTRAINT "ContentField_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentField" ADD CONSTRAINT "ContentField_releatedFieldId_fkey" FOREIGN KEY ("releatedFieldId") REFERENCES "ContainerField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

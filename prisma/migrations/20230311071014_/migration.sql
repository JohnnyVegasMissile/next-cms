/*
  Warnings:

  - You are about to drop the column `sectionId` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Media` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LinkedToSectionType" AS ENUM ('MEDIA', 'FORM');

-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_sectionId_fkey";

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "sectionId";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "sectionId";

-- CreateTable
CREATE TABLE "LinkedToSection" (
    "id" SERIAL NOT NULL,
    "type" "LinkedToSectionType" NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "mediaId" INTEGER,
    "formId" INTEGER,

    CONSTRAINT "LinkedToSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkedToSection_sectionId_mediaId_key" ON "LinkedToSection"("sectionId", "mediaId");

-- AddForeignKey
ALTER TABLE "LinkedToSection" ADD CONSTRAINT "LinkedToSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedToSection" ADD CONSTRAINT "LinkedToSection_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedToSection" ADD CONSTRAINT "LinkedToSection_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

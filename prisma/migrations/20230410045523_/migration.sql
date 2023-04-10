/*
  Warnings:

  - A unique constraint covering the columns `[contentId,releatedFieldId]` on the table `ContentField` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `language` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CodeLanguage" AS ENUM ('AR', 'ZH', 'EN', 'FR', 'DE', 'HI', 'IT', 'JA', 'KO', 'PO', 'RU', 'ES', 'TR');

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "language" "CodeLanguage" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ContentField_contentId_releatedFieldId_key" ON "ContentField"("contentId", "releatedFieldId");

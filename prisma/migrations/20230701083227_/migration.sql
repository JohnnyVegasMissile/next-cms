/*
  Warnings:

  - A unique constraint covering the columns `[sectionId,mediaId,formId,linkId,menuId]` on the table `LinkedToSection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LinkedToSection_sectionId_mediaId_formId_linkId_key";

-- CreateIndex
CREATE UNIQUE INDEX "LinkedToSection_sectionId_mediaId_formId_linkId_menuId_key" ON "LinkedToSection"("sectionId", "mediaId", "formId", "linkId", "menuId");

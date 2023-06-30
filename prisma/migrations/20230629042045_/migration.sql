/*
  Warnings:

  - A unique constraint covering the columns `[sectionId,mediaId,formId,linkId]` on the table `LinkedToSection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "FormField" DROP CONSTRAINT "FormField_containerId_fkey";

-- DropForeignKey
ALTER TABLE "FormField" DROP CONSTRAINT "FormField_formId_fkey";

-- DropForeignKey
ALTER TABLE "MessageField" DROP CONSTRAINT "MessageField_formFieldId_fkey";

-- DropForeignKey
ALTER TABLE "MessageField" DROP CONSTRAINT "MessageField_messageId_fkey";

-- DropIndex
DROP INDEX "LinkedToSection_sectionId_mediaId_key";

-- AlterTable
ALTER TABLE "LinkedToSection" ADD COLUMN     "linkId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "LinkedToSection_sectionId_mediaId_formId_linkId_key" ON "LinkedToSection"("sectionId", "mediaId", "formId", "linkId");

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageField" ADD CONSTRAINT "MessageField_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageField" ADD CONSTRAINT "MessageField_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedToSection" ADD CONSTRAINT "LinkedToSection_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

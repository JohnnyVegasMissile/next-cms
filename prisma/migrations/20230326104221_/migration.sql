-- AlterTable
ALTER TABLE "Metadata" ADD COLUMN     "containerTemplateId" INTEGER;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_containerTemplateId_fkey" FOREIGN KEY ("containerTemplateId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

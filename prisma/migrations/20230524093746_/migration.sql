-- AlterEnum
ALTER TYPE "FormFieldType" ADD VALUE 'CONTENT';

-- AlterTable
ALTER TABLE "FormField" ADD COLUMN     "containerId" TEXT;

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE SET NULL ON UPDATE CASCADE;

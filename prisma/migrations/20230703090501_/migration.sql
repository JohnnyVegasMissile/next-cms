-- DropForeignKey
ALTER TABLE "MessageField" DROP CONSTRAINT "MessageField_formFieldId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "readById" TEXT;

-- AlterTable
ALTER TABLE "MessageField" ADD COLUMN     "valueMultiple" JSONB;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_readById_fkey" FOREIGN KEY ("readById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageField" ADD CONSTRAINT "MessageField_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

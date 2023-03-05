/*
  Warnings:

  - The `valueNumber` column on the `MessageField` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `formFieldId` to the `MessageField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessageField" ADD COLUMN     "formFieldId" INTEGER NOT NULL,
ADD COLUMN     "valueBoolean" BOOLEAN,
DROP COLUMN "valueNumber",
ADD COLUMN     "valueNumber" INTEGER;

-- AddForeignKey
ALTER TABLE "MessageField" ADD CONSTRAINT "MessageField_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

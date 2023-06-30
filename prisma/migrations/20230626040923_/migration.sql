-- CreateEnum
CREATE TYPE "FormButtonType" AS ENUM ('SUBMIT', 'RESET', 'LINK');

-- AlterTable
ALTER TABLE "FormField" ADD COLUMN     "buttonType" "FormButtonType";

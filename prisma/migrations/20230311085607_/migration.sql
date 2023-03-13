/*
  Warnings:

  - You are about to drop the column `type` on the `LinkedToSection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LinkedToSection" DROP COLUMN "type";

-- DropEnum
DROP TYPE "LinkedToSectionType";

/*
  Warnings:

  - You are about to drop the column `limitFileUpload` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `limitImageUpload` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `limitVideoUpload` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "limitFileUpload",
DROP COLUMN "limitImageUpload",
DROP COLUMN "limitVideoUpload",
ADD COLUMN     "limitUpload" INTEGER;

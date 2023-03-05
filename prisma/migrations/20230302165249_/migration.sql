/*
  Warnings:

  - You are about to drop the `Right` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Right" DROP CONSTRAINT "Right_roleId_fkey";

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "limitFileUpload" INTEGER,
ADD COLUMN     "limitImageUpload" INTEGER,
ADD COLUMN     "limitVideoUpload" INTEGER,
ADD COLUMN     "rights" "RightType"[];

-- DropTable
DROP TABLE "Right";

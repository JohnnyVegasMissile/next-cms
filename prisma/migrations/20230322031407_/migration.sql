/*
  Warnings:

  - You are about to drop the column `sidePageId` on the `Section` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_sidePageId_fkey";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "sidePageId";

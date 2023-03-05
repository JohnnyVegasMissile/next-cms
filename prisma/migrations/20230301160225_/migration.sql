/*
  Warnings:

  - Made the column `updatedAt` on table `Page` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "updatedAt" SET NOT NULL;

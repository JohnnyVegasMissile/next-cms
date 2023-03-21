/*
  Warnings:

  - Added the required column `position` to the `ContainerField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContainerField" ADD COLUMN     "position" INTEGER NOT NULL;

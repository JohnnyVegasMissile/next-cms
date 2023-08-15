/*
  Warnings:

  - Added the required column `name` to the `MenuChild` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuChild" ADD COLUMN     "name" TEXT NOT NULL;

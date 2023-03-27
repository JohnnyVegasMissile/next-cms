/*
  Warnings:

  - You are about to drop the column `metadata` on the `ContainerField` table. All the data in the column will be lost.
  - Added the required column `name` to the `ContainerField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `required` to the `ContainerField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContainerField" DROP COLUMN "metadata",
ADD COLUMN     "metadatas" TEXT[],
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "required" BOOLEAN NOT NULL;

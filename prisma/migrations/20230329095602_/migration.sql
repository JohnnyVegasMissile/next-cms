/*
  Warnings:

  - You are about to drop the column `defaultJSONValue` on the `ContainerField` table. All the data in the column will be lost.
  - You are about to drop the column `defaultMultipleJSONValue` on the `ContainerField` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `ContentField` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContainerField" DROP COLUMN "defaultJSONValue",
DROP COLUMN "defaultMultipleJSONValue",
ADD COLUMN     "defaultJsonValue" JSONB,
ADD COLUMN     "defaultMultipleJsonValue" JSONB[];

-- AlterTable
ALTER TABLE "ContentField" DROP COLUMN "position",
ADD COLUMN     "jsonValue" JSONB,
ADD COLUMN     "multipleJsonValue" JSONB[];

/*
  Warnings:

  - The values [BOOLEAN] on the enum `ContainerFieldType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `defaultJSON` on the `ContainerField` table. All the data in the column will be lost.
  - You are about to drop the column `defaultMultipleJSON` on the `ContainerField` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContainerFieldType_new" AS ENUM ('STRING', 'NUMBER', 'DATE', 'LINK', 'PARAGRAPH', 'IMAGE', 'FILE', 'VIDEO', 'CONTENT', 'OPTION', 'RICHTEXT', 'COLOR', 'LOCATION');
ALTER TABLE "ContainerField" ALTER COLUMN "type" TYPE "ContainerFieldType_new" USING ("type"::text::"ContainerFieldType_new");
ALTER TABLE "ContentField" ALTER COLUMN "type" TYPE "ContainerFieldType_new" USING ("type"::text::"ContainerFieldType_new");
ALTER TYPE "ContainerFieldType" RENAME TO "ContainerFieldType_old";
ALTER TYPE "ContainerFieldType_new" RENAME TO "ContainerFieldType";
DROP TYPE "ContainerFieldType_old";
COMMIT;

-- AlterTable
ALTER TABLE "ContainerField" DROP COLUMN "defaultJSON",
DROP COLUMN "defaultMultipleJSON",
ADD COLUMN     "defaultJSONValue" JSONB,
ADD COLUMN     "defaultMultipleJSONValue" JSONB[];

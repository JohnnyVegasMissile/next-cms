/*
  Warnings:

  - The values [TEMPLATE,TEMPLATE_SIDEBAR] on the enum `SectionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `containerBottomId` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `containerTopId` on the `Section` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SectionType_new" AS ENUM ('PAGE', 'PAGE_SIDEBAR', 'CONTAINER', 'CONTAINER_SIDEBAR', 'TEMPLATE_TOP', 'TEMPLATE_BOTTOM', 'TEMPLATE_SIDEBAR_TOP', 'TEMPLATE_SIDEBAR_BOTTOM', 'CONTENT', 'CONTENT_SIDEBAR', 'LAYOUT_HEADER', 'LAYOUT_FOOTER', 'LAYOUT_CONTENT_TOP', 'LAYOUT_CONTENT_BOTTOM', 'LAYOUT_SIDEBAR_TOP', 'LAYOUT_SIDEBAR_BOTTOM');
ALTER TABLE "Section" ALTER COLUMN "type" TYPE "SectionType_new" USING ("type"::text::"SectionType_new");
ALTER TYPE "SectionType" RENAME TO "SectionType_old";
ALTER TYPE "SectionType_new" RENAME TO "SectionType";
DROP TYPE "SectionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_containerBottomId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_containerTopId_fkey";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "containerBottomId",
DROP COLUMN "containerTopId",
ADD COLUMN     "containerId" TEXT;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

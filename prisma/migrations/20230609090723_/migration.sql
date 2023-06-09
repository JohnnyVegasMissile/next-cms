/*
  Warnings:

  - The values [CONTAINER,CONTAINER_SIDEBAR] on the enum `SectionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SectionType_new" AS ENUM ('PAGE', 'PAGE_SIDEBAR', 'TEMPLATE_TOP', 'TEMPLATE_BOTTOM', 'TEMPLATE_SIDEBAR_TOP', 'TEMPLATE_SIDEBAR_BOTTOM', 'CONTENT', 'CONTENT_SIDEBAR', 'LAYOUT_HEADER', 'LAYOUT_FOOTER', 'LAYOUT_CONTENT_TOP', 'LAYOUT_CONTENT_BOTTOM', 'LAYOUT_SIDEBAR_TOP', 'LAYOUT_SIDEBAR_BOTTOM');
ALTER TABLE "Section" ALTER COLUMN "type" TYPE "SectionType_new" USING ("type"::text::"SectionType_new");
ALTER TYPE "SectionType" RENAME TO "SectionType_old";
ALTER TYPE "SectionType_new" RENAME TO "SectionType";
DROP TYPE "SectionType_old";
COMMIT;

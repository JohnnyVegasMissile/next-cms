/*
  Warnings:

  - The values [SIGNIN] on the enum `PageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PageType_new" AS ENUM ('PAGE', 'HOMEPAGE', 'NOTFOUND', 'ERROR', 'MAINTENANCE');
ALTER TABLE "Page" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Page" ALTER COLUMN "type" TYPE "PageType_new" USING ("type"::text::"PageType_new");
ALTER TYPE "PageType" RENAME TO "PageType_old";
ALTER TYPE "PageType_new" RENAME TO "PageType";
DROP TYPE "PageType_old";
ALTER TABLE "Page" ALTER COLUMN "type" SET DEFAULT 'PAGE';
COMMIT;

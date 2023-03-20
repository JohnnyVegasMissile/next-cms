-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SectionType" ADD VALUE 'TEMPLATE_TOP';
ALTER TYPE "SectionType" ADD VALUE 'TEMPLATE_BOTTOM';
ALTER TYPE "SectionType" ADD VALUE 'CONTENT';
ALTER TYPE "SectionType" ADD VALUE 'CONTENT_SIDEBAR';

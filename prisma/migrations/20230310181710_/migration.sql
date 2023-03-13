-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('PAGE', 'PAGE_SIDEBAR', 'CONTAINER', 'CONTAINER_SIDEBAR', 'TEMPLATE', 'TEMPLATE_SIDEBAR', 'LAYOUT_HEADER', 'LAYOUT_FOOTER', 'LAYOUT_CONTENT_TOP', 'LAYOUT_CONTENT_BOTTOM', 'LAYOUT_SIDEBAR_TOP', 'LAYOUT_SIDEBAR_BOTTOM');

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "sectionId" INTEGER;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "sectionId" INTEGER;

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "type" "SectionType" NOT NULL,
    "block" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "pageId" INTEGER,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

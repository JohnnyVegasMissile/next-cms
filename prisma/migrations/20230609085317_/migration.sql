-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "containerBottomId" TEXT,
ADD COLUMN     "containerTopId" TEXT,
ADD COLUMN     "contentId" TEXT;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_containerTopId_fkey" FOREIGN KEY ("containerTopId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_containerBottomId_fkey" FOREIGN KEY ("containerBottomId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

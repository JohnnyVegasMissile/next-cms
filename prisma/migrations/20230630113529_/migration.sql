-- AlterTable
ALTER TABLE "LinkedToSection" ADD COLUMN     "menuId" TEXT;

-- AddForeignKey
ALTER TABLE "LinkedToSection" ADD CONSTRAINT "LinkedToSection_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

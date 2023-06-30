/*
  Warnings:

  - Added the required column `menuId` to the `MenuChild` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuChild" ADD COLUMN     "menuId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MenuChild" ADD CONSTRAINT "MenuChild_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

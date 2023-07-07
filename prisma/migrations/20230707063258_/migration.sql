/*
  Warnings:

  - A unique constraint covering the columns `[slugId]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Link_slugId_key" ON "Link"("slugId");

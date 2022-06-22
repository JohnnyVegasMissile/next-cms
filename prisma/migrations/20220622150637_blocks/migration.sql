/*
  Warnings:

  - You are about to drop the column `block` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `elementId` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Element` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Block" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT NOT NULL,
    "sectionId" INTEGER,
    "elementId" INTEGER,
    CONSTRAINT "Block_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Block_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pageId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "content" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Section" ("content", "id", "pageId", "position", "updatedAt") SELECT "content", "id", "pageId", "position", "updatedAt" FROM "Section";
DROP TABLE "Section";
ALTER TABLE "new_Section" RENAME TO "Section";
CREATE TABLE "new_Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'page',
    "slug" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Page" ("id", "published", "slug", "title", "type", "updatedAt") SELECT "id", "published", "slug", "title", "type", "updatedAt" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
CREATE TABLE "new_Field" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "blockId" INTEGER,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "value" TEXT,
    CONSTRAINT "Field_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Field" ("id", "label", "name", "required", "type", "value") SELECT "id", "label", "name", "required", "type", "value" FROM "Field";
DROP TABLE "Field";
ALTER TABLE "new_Field" RENAME TO "Field";
CREATE TABLE "new_Element" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Element" ("content", "id", "updatedAt") SELECT "content", "id", "updatedAt" FROM "Element";
DROP TABLE "Element";
ALTER TABLE "new_Element" RENAME TO "Element";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

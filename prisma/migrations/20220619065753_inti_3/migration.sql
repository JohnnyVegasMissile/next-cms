-- CreateTable
CREATE TABLE "Field" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "elementId" INTEGER,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "value" TEXT,
    CONSTRAINT "Field_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Element" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "sectionId" INTEGER,
    "content" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Element_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Element" ("content", "id", "sectionId", "type", "updatedAt") SELECT "content", "id", "sectionId", "type", "updatedAt" FROM "Element";
DROP TABLE "Element";
ALTER TABLE "new_Element" RENAME TO "Element";
CREATE TABLE "new_Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "block" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "content" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Section" ("block", "content", "id", "pageId", "position", "updatedAt") SELECT "block", "content", "id", "pageId", "position", "updatedAt" FROM "Section";
DROP TABLE "Section";
ALTER TABLE "new_Section" RENAME TO "Section";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

/*
  Warnings:

  - Added the required column `footerId` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headerId` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Element" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "headerId" TEXT NOT NULL,
    "footerId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL,
    "homepage" BOOLEAN NOT NULL
);
INSERT INTO "new_Page" ("homepage", "id", "published", "slug", "title") SELECT "homepage", "id", "published", "slug", "title" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

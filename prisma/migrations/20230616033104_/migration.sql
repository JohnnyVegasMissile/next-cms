-- CreateEnum
CREATE TYPE "MenuChildType" AS ENUM ('TITLE', 'LINK', 'CONTENT');

-- CreateEnum
CREATE TYPE "OrderBy" AS ENUM ('ASC', 'DESC');

-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "LinkProtocol" AS ENUM ('HTTP', 'HTTPS');

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuChild" (
    "id" TEXT NOT NULL,
    "type" "MenuChildType" NOT NULL,
    "parentId" TEXT,
    "containerId" TEXT,
    "filters" JSONB,
    "orderByFieldId" TEXT,
    "orderBy" "OrderBy",
    "linkId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuChild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "type" "LinkType" NOT NULL,
    "slugId" TEXT,
    "link" TEXT,
    "prototol" "LinkProtocol",

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MenuChild" ADD CONSTRAINT "MenuChild_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MenuChild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuChild" ADD CONSTRAINT "MenuChild_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuChild" ADD CONSTRAINT "MenuChild_orderByFieldId_fkey" FOREIGN KEY ("orderByFieldId") REFERENCES "ContainerField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuChild" ADD CONSTRAINT "MenuChild_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_slugId_fkey" FOREIGN KEY ("slugId") REFERENCES "Slug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

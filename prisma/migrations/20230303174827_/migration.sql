/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Login` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Setting` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type]` on the table `Setting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `FormField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SettingType" AS ENUM ('REVALIDATE_DELAY', 'APP_NAME', 'BACKGROUND_COLOR', 'PRIMARY_COLOR', 'SECONDARY_COLOR', 'MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS', 'SIDEBAR_IS_ACTIVE', 'SIDEBAR_WIDTH', 'SIDEBAR_UNIT', 'MAINTENANCE_MODE');

-- AlterEnum
ALTER TYPE "PageType" ADD VALUE 'MAINTENANCE';

-- DropIndex
DROP INDEX "Setting_name_key";

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "FormField" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Login" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "name",
ADD COLUMN     "type" "SettingType" NOT NULL,
ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Setting_type_key" ON "Setting"("type");

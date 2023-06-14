/*
  Warnings:

  - The values [LANGUAGE] on the enum `SettingType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SettingType_new" AS ENUM ('APP_NAME', 'BACKGROUND_COLOR', 'PRIMARY_COLOR', 'SECONDARY_COLOR', 'PRIMARY_TEXT_COLOR', 'SECONDARY_TEXT_COLOR', 'DARK_COLOR', 'LIGHT_COLOR', 'EXTRA_COLOR', 'MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS', 'SIDEBAR_IS_ACTIVE', 'SIDEBAR_WIDTH', 'SIDEBAR_UNIT', 'SIDEBAR_POSITION', 'SIDEBAR_COLOR', 'SIDEBAR_BREAKPOINT_SIZE', 'MAINTENANCE_MODE', 'SITE_URL', 'INDEXED', 'LANGUAGE_LOCALES', 'LANGUAGE_PREFERRED');
ALTER TABLE "Setting" ALTER COLUMN "type" TYPE "SettingType_new" USING ("type"::text::"SettingType_new");
ALTER TYPE "SettingType" RENAME TO "SettingType_old";
ALTER TYPE "SettingType_new" RENAME TO "SettingType";
DROP TYPE "SettingType_old";
COMMIT;

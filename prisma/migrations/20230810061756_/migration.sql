/*
  Warnings:

  - The values [NB,NN,SB,UA,VE,JI] on the enum `CodeLanguage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CodeLanguage_new" AS ENUM ('AB', 'AA', 'AF', 'SQ', 'AM', 'AR', 'AN', 'HY', 'AS', 'AY', 'AZ', 'BA', 'EU', 'BN', 'DZ', 'BH', 'BI', 'BR', 'BG', 'MY', 'BE', 'KM', 'CA', 'ZH', 'CO', 'HR', 'CS', 'DA', 'NL', 'EN', 'EO', 'ET', 'FO', 'FA', 'FJ', 'FI', 'FR', 'FY', 'GD', 'GV', 'GL', 'KA', 'DE', 'EL', 'KL', 'GN', 'GU', 'HT', 'HA', 'HE', 'HI', 'HU', 'IS', 'IO', 'ID', 'IA', 'IE', 'IU', 'IK', 'GA', 'IT', 'JA', 'JV', 'KN', 'KS', 'KK', 'RW', 'KY', 'RN', 'KO', 'KU', 'LO', 'LA', 'LV', 'LI', 'LN', 'LT', 'MK', 'MG', 'MS', 'ML', 'MT', 'MI', 'MR', 'MO', 'MN', 'NA', 'NE', 'NO', 'OC', 'OR', 'OM', 'PS', 'PL', 'PT', 'PA', 'QU', 'RM', 'RO', 'RU', 'SM', 'SG', 'SA', 'SR', 'SH', 'ST', 'TN', 'SN', 'II', 'SD', 'SI', 'SS', 'SK', 'SL', 'SO', 'ES', 'SU', 'SW', 'SV', 'TL', 'TG', 'TA', 'TT', 'TE', 'TH', 'BO', 'TI', 'TO', 'TS', 'TR', 'TK', 'TW', 'UG', 'UK', 'UR', 'UZ', 'VI', 'VO', 'WA', 'CY', 'WO', 'XH', 'YI', 'YO', 'ZU');
ALTER TABLE "Section" ALTER COLUMN "language" DROP DEFAULT;
ALTER TABLE "Metadata" ALTER COLUMN "language" TYPE "CodeLanguage_new" USING ("language"::text::"CodeLanguage_new");
ALTER TABLE "Section" ALTER COLUMN "language" TYPE "CodeLanguage_new" USING ("language"::text::"CodeLanguage_new");
ALTER TABLE "Metric" ALTER COLUMN "language" TYPE "CodeLanguage_new" USING ("language"::text::"CodeLanguage_new");
ALTER TYPE "CodeLanguage" RENAME TO "CodeLanguage_old";
ALTER TYPE "CodeLanguage_new" RENAME TO "CodeLanguage";
DROP TYPE "CodeLanguage_old";
ALTER TABLE "Section" ALTER COLUMN "language" SET DEFAULT 'EN';
COMMIT;

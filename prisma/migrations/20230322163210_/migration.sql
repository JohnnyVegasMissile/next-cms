-- AlterTable
ALTER TABLE "ContainerField" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "max" INTEGER,
ADD COLUMN     "metadata" TEXT[],
ADD COLUMN     "min" INTEGER,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "valueMax" DOUBLE PRECISION,
ADD COLUMN     "valueMin" DOUBLE PRECISION;

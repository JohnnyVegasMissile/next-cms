-- CreateEnum
CREATE TYPE "MetricName" AS ENUM ('TTFB', 'FCP', 'LCP', 'FID', 'CLS', 'INP');

-- CreateTable
CREATE TABLE "Metric" (
    "id" TEXT NOT NULL,
    "name" "MetricName" NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,
    "slugId" TEXT NOT NULL,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metric_name_day_slugId_key" ON "Metric"("name", "day", "slugId");

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_slugId_fkey" FOREIGN KEY ("slugId") REFERENCES "Slug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

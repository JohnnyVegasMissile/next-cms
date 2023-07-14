-- DropForeignKey
ALTER TABLE "MetadataValue" DROP CONSTRAINT "MetadataValue_linkId_fkey";

-- DropForeignKey
ALTER TABLE "MetadataValue" DROP CONSTRAINT "MetadataValue_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "MetadataValue" DROP CONSTRAINT "MetadataValue_metadataId_fkey";

-- AddForeignKey
ALTER TABLE "MetadataValue" ADD CONSTRAINT "MetadataValue_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "Metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetadataValue" ADD CONSTRAINT "MetadataValue_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetadataValue" ADD CONSTRAINT "MetadataValue_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - The primary key for the `Container` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ContainerField` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Content` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ContentField` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Form` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormField` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LinkedToSection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Login` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Media` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MessageField` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Metadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Page` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Section` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Setting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Slug` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "ContainerField" DROP CONSTRAINT "ContainerField_containerId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_containerId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "ContentField" DROP CONSTRAINT "ContentField_contentId_fkey";

-- DropForeignKey
ALTER TABLE "ContentField" DROP CONSTRAINT "ContentField_releatedFieldId_fkey";

-- DropForeignKey
ALTER TABLE "FormField" DROP CONSTRAINT "FormField_formId_fkey";

-- DropForeignKey
ALTER TABLE "LinkedToSection" DROP CONSTRAINT "LinkedToSection_formId_fkey";

-- DropForeignKey
ALTER TABLE "LinkedToSection" DROP CONSTRAINT "LinkedToSection_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "LinkedToSection" DROP CONSTRAINT "LinkedToSection_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Login" DROP CONSTRAINT "Login_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Login" DROP CONSTRAINT "Login_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_formId_fkey";

-- DropForeignKey
ALTER TABLE "MessageField" DROP CONSTRAINT "MessageField_formFieldId_fkey";

-- DropForeignKey
ALTER TABLE "MessageField" DROP CONSTRAINT "MessageField_messageId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_containerTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_linkedContainerId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_linkedContentId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_linkedPageId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_pageId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_loginId_fkey";

-- DropForeignKey
ALTER TABLE "Slug" DROP CONSTRAINT "Slug_containerId_fkey";

-- DropForeignKey
ALTER TABLE "Slug" DROP CONSTRAINT "Slug_pageId_fkey";

-- AlterTable
ALTER TABLE "Container" DROP CONSTRAINT "Container_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdByUserId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Container_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Container_id_seq";

-- AlterTable
ALTER TABLE "ContainerField" DROP CONSTRAINT "ContainerField_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "containerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ContainerField_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ContainerField_id_seq";

-- AlterTable
ALTER TABLE "Content" DROP CONSTRAINT "Content_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "containerId" SET DATA TYPE TEXT,
ALTER COLUMN "createdByUserId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Content_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Content_id_seq";

-- AlterTable
ALTER TABLE "ContentField" DROP CONSTRAINT "ContentField_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "contentId" SET DATA TYPE TEXT,
ALTER COLUMN "releatedFieldId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ContentField_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ContentField_id_seq";

-- AlterTable
ALTER TABLE "Form" DROP CONSTRAINT "Form_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Form_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Form_id_seq";

-- AlterTable
ALTER TABLE "FormField" DROP CONSTRAINT "FormField_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "formId" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormField_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormField_id_seq";

-- AlterTable
ALTER TABLE "LinkedToSection" DROP CONSTRAINT "LinkedToSection_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "sectionId" SET DATA TYPE TEXT,
ALTER COLUMN "mediaId" SET DATA TYPE TEXT,
ALTER COLUMN "formId" SET DATA TYPE TEXT,
ADD CONSTRAINT "LinkedToSection_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LinkedToSection_id_seq";

-- AlterTable
ALTER TABLE "Login" DROP CONSTRAINT "Login_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "roleId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Login_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Login_id_seq";

-- AlterTable
ALTER TABLE "Media" DROP CONSTRAINT "Media_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Media_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Media_id_seq";

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "formId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Message_id_seq";

-- AlterTable
ALTER TABLE "MessageField" DROP CONSTRAINT "MessageField_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "messageId" SET DATA TYPE TEXT,
ALTER COLUMN "formFieldId" SET DATA TYPE TEXT,
ADD CONSTRAINT "MessageField_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MessageField_id_seq";

-- AlterTable
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "linkedContainerId" SET DATA TYPE TEXT,
ALTER COLUMN "linkedContentId" SET DATA TYPE TEXT,
ALTER COLUMN "linkedPageId" SET DATA TYPE TEXT,
ALTER COLUMN "containerTemplateId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Metadata_id_seq";

-- AlterTable
ALTER TABLE "Page" DROP CONSTRAINT "Page_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdByUserId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Page_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Page_id_seq";

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Role_id_seq";

-- AlterTable
ALTER TABLE "Section" DROP CONSTRAINT "Section_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "pageId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Section_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Section_id_seq";

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "loginId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Session_id_seq";

-- AlterTable
ALTER TABLE "Setting" DROP CONSTRAINT "Setting_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Setting_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Setting_id_seq";

-- AlterTable
ALTER TABLE "Slug" DROP CONSTRAINT "Slug_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "pageId" SET DATA TYPE TEXT,
ALTER COLUMN "containerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Slug_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Slug_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_loginId_fkey" FOREIGN KEY ("loginId") REFERENCES "Login"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageField" ADD CONSTRAINT "MessageField_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageField" ADD CONSTRAINT "MessageField_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slug" ADD CONSTRAINT "Slug_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slug" ADD CONSTRAINT "Slug_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_linkedPageId_fkey" FOREIGN KEY ("linkedPageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_linkedContainerId_fkey" FOREIGN KEY ("linkedContainerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_linkedContentId_fkey" FOREIGN KEY ("linkedContentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_containerTemplateId_fkey" FOREIGN KEY ("containerTemplateId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedToSection" ADD CONSTRAINT "LinkedToSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedToSection" ADD CONSTRAINT "LinkedToSection_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedToSection" ADD CONSTRAINT "LinkedToSection_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContainerField" ADD CONSTRAINT "ContainerField_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentField" ADD CONSTRAINT "ContentField_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentField" ADD CONSTRAINT "ContentField_releatedFieldId_fkey" FOREIGN KEY ("releatedFieldId") REFERENCES "ContainerField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "RightType" AS ENUM ('VIEW_PAGE', 'CREATE_PAGE', 'UPDATE_PAGE', 'DELETE_PAGE', 'UPDATE_PAGE_SECTION', 'VIEW_CONTAINER', 'CREATE_CONTAINER', 'UPDATE_CONTAINER', 'DELETE_CONTAINER', 'UPDATE_CONTAINER_SECTION', 'UPDATE_CONTAINER_TEMPLATE_SECTION', 'VIEW_CONTENT', 'CREATE_CONTENT', 'UPDATE_CONTENT', 'DELETE_CONTENT', 'UPDATE_CONTENT_SECTION', 'VIEW_MEDIA', 'UPLOAD_MEDIA', 'UPDATE_MEDIA', 'DELETE_MEDIA', 'VIEW_FORM', 'CREATE_FORM', 'UPDATE_FORM', 'DELETE_FORM', 'VIEW_MESSAGE', 'READ_MESSAGE', 'DELETE_MESSAGE', 'VIEW_USER', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'VIEW_ROLE', 'CREATE_ROLE', 'UPDATE_ROLE', 'DELETE_ROLE', 'VIEW_LAYOUT', 'UPDATE_LAYOUT', 'VIEW_SETTING', 'UPDATE_GENERAL', 'UPDATE_THEME', 'UPDATE_SMTP', 'REVALIDATE');

-- CreateEnum
CREATE TYPE "FormFieldType" AS ENUM ('TEXT', 'NUMBER', 'EMAIL', 'PASSWORD', 'PARAGRAPH', 'OPTION', 'CHECKBOX', 'RADIO', 'BUTTON', 'TITLE');

-- CreateEnum
CREATE TYPE "SettingType" AS ENUM ('REVALIDATE_DELAY', 'APP_NAME', 'BACKGROUND_COLOR', 'PRIMARY_COLOR', 'SECONDARY_COLOR', 'PRIMARY_TEXT_COLOR', 'SECONDARY_TEXT_COLOR', 'DARK_COLOR', 'LIGHT_COLOR', 'EXTRA_COLOR', 'MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS', 'SIDEBAR_IS_ACTIVE', 'SIDEBAR_WIDTH', 'SIDEBAR_UNIT', 'SIDEBAR_POSITION', 'SIDEBAR_COLOR', 'SIDEBAR_BREAKPOINT_SIZE', 'MAINTENANCE_MODE');

-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('PAGE', 'HOMEPAGE', 'SIGNIN', 'NOTFOUND', 'ERROR', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "ContainerFieldType" AS ENUM ('STRING', 'NUMBER', 'DATE', 'BOOLEAN', 'LINK', 'PARAGRAPH', 'IMAGE', 'FILE', 'VIDEO', 'CONTENT', 'OPTION', 'RICHTEXT', 'COLOR', 'LOCATION');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Login" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "loginId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rights" "RightType"[],
    "limitImageUpload" INTEGER,
    "limitFileUpload" INTEGER,
    "limitVideoUpload" INTEGER,
    "superUser" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "redirectMail" BOOLEAN NOT NULL DEFAULT false,
    "mailToRedirect" TEXT,
    "successMessage" TEXT,
    "errorMessage" TEXT,
    "extraData" JSONB NOT NULL,
    "discontinued" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormField" (
    "id" SERIAL NOT NULL,
    "formId" INTEGER NOT NULL,
    "name" TEXT,
    "type" "FormFieldType" NOT NULL,
    "label" TEXT NOT NULL,
    "placeholder" TEXT,
    "position" INTEGER NOT NULL,
    "line" INTEGER NOT NULL,
    "options" JSONB,
    "min" DOUBLE PRECISION,
    "max" DOUBLE PRECISION,
    "defaultText" TEXT,
    "defaultNumber" DOUBLE PRECISION,
    "defaultMultiple" JSONB,
    "required" BOOLEAN DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "marked" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "formId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageField" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "formFieldId" INTEGER NOT NULL,
    "valueText" TEXT,
    "valueNumber" INTEGER,
    "valueBoolean" BOOLEAN,

    CONSTRAINT "MessageField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "type" "SettingType" NOT NULL,
    "value" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slug" (
    "id" SERIAL NOT NULL,
    "full" TEXT NOT NULL,
    "basic" TEXT NOT NULL,
    "pageId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metadata" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pageId" INTEGER,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PageType" NOT NULL DEFAULT 'PAGE',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContainerField" (
    "id" SERIAL NOT NULL,
    "type" "ContainerFieldType" NOT NULL,

    CONSTRAINT "ContainerField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Login_userId_key" ON "Login"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Login_email_key" ON "Login"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Form_name_key" ON "Form"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_type_key" ON "Setting"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Slug_full_key" ON "Slug"("full");

-- CreateIndex
CREATE UNIQUE INDEX "Slug_pageId_key" ON "Slug"("pageId");

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "Slug" ADD CONSTRAINT "Slug_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

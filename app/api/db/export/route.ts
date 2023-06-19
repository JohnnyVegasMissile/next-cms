// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'
import { prisma } from '~/utilities/prisma'

export async function POST() {
    const users = await prisma.user.findMany({ where: { login: { root: false } } })
    const logins = await prisma.login.findMany({ where: { root: false } })
    // const sessions = await prisma.session.findMany()
    const roles = await prisma.role.findMany()
    const forms = await prisma.form.findMany()
    const formFields = await prisma.formField.findMany()
    const messages = await prisma.message.findMany()
    const messageFields = await prisma.messageField.findMany()
    const settings = await prisma.setting.findMany()
    const slugs = await prisma.slug.findMany()
    const metadatas = await prisma.metadata.findMany()
    const sections = await prisma.section.findMany()
    const linkedToSections = await prisma.linkedToSection.findMany()
    const pages = await prisma.page.findMany()
    const containers = await prisma.container.findMany()
    const containerFields = await prisma.containerField.findMany()
    const contents = await prisma.content.findMany()
    const contentFields = await prisma.contentField.findMany()
    const medias = await prisma.media.findMany()

    // NextResponse extends the Web Response API
    return NextResponse.json({
        users,
        logins,
        // sessions,
        roles,
        forms,
        formFields,
        messages,
        messageFields,
        settings,
        slugs,
        metadatas,
        sections,
        linkedToSections,
        pages,
        containers,
        containerFields,
        contents,
        contentFields,
        medias,
    })
}

//

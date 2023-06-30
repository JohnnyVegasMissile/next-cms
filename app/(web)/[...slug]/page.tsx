import { prisma } from '~/utilities/prisma'
import { notFound } from 'next/navigation'
import { SectionType } from '@prisma/client'
import DisplaySection from '~/components/DisplaySection'
import { Suspense } from 'react'

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const full = Array.isArray(params.slug) ? params.slug.join('/') : params.slug
    const page = await prisma.page.findFirst({
        where: { slug: { full } },
        include: { metadatas: true },
    })

    if (!!page) {
        let metadata: any = {}
        page.metadatas.forEach((element) => (metadata[element.name] = element.content))

        return { title: page.name, ...metadata }
    }

    const content = await prisma.container.findFirst({
        where: { slug: { full } },
    })

    if (!!content) return { title: content.name }

    const container = await prisma.container.findFirst({
        where: { slug: { full } },
    })

    if (!!container) return { title: container.name }

    return {}

    //       openGraph: {
    //     title: 'Next.js',
    //     description: 'The React Framework for the Web',
    //     url: 'https://nextjs.org',
    //     siteName: 'Next.js',
    //     images: [
    //       {
    //         url: 'https://nextjs.org/og.png',
    //         width: 800,
    //         height: 600,
    //       },
    //       {
    //         url: 'https://nextjs.org/og-alt.png',
    //         width: 1800,
    //         height: 1600,
    //         alt: 'My custom alt',
    //       },
    //     ],
    //     locale: 'en_US',
    //     type: 'website',
    //   },
}

const getSections = async (slug: string) => {
    const exist = await prisma.slug.findFirst({
        where: { full: slug },
        include: {
            page: { select: { published: true } },
            container: { select: { published: true } },
            content: { select: { containerId: true, published: true } },
        },
    })

    if (!exist) return null

    if (!!exist.pageId && exist.page?.published) {
        const pageSections = await prisma.section.findMany({
            where: { pageId: exist.pageId, type: SectionType.PAGE },
            include: {
                medias: {
                    include: {
                        media: true,
                        form: { include: { fields: true } },
                        link: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        })

        return pageSections
    } else if (!!exist.containerId && exist.container?.published) {
        const containerSections = await prisma.section.findMany({
            where: { containerId: exist.containerId, type: SectionType.CONTAINER },
            include: {
                medias: {
                    include: {
                        media: true,
                        form: { include: { fields: true } },
                        link: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        })

        return containerSections
    } else if (!!exist.contentId && exist.content?.published) {
        const contentSections = await prisma.section.findMany({
            where: { contentId: exist.contentId, type: SectionType.CONTENT },
            include: {
                medias: {
                    include: {
                        media: true,
                        form: { include: { fields: true } },
                        link: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        })

        const containerTopSections = await prisma.section.findMany({
            where: { containerId: exist.content.containerId, type: SectionType.TEMPLATE_TOP },
            include: {
                medias: {
                    include: {
                        media: true,
                        form: { include: { fields: true } },
                        link: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        })

        const containerBottomSections = await prisma.section.findMany({
            where: { containerId: exist.content.containerId, type: SectionType.TEMPLATE_BOTTOM },
            include: {
                medias: {
                    include: {
                        media: true,
                        form: { include: { fields: true } },
                        link: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        })

        return [...containerTopSections, ...contentSections, ...containerBottomSections]
    }

    return null
}

const Content = async ({ params }: { params: { slug: string } }) => {
    const sections = await getSections(Array.isArray(params.slug) ? params.slug.join('/') : params.slug)

    if (sections === null) notFound()

    return (
        <>
            {sections.map((section) => (
                <Suspense key={section.id}>
                    {/* @ts-expect-error Server Component */}
                    <DisplaySection section={section} />
                </Suspense>
            ))}
        </>
    )
}

export const revalidate = 'force-cache'

export default Content

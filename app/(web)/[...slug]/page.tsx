import { prisma } from '~/utilities/prisma'
import { notFound } from 'next/navigation'
import { SectionType } from '@prisma/client'
import DisplaySection from '~/components/DisplaySection'

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

    return undefined
}

const getSections = async (slug: string) => {
    const existingSlug = await prisma.slug.findFirst({ where: { full: slug } })

    if (!existingSlug) return null

    const pageSections = await prisma.section.findMany({
        where: { page: { slug: { full: slug } }, type: SectionType.PAGE },
        orderBy: { position: 'asc' },
    })

    const contentSections = await prisma.section.findMany({
        where: { linkedContent: { slug: { full: slug } }, type: SectionType.CONTENT },
        orderBy: { position: 'asc' },
    })

    const containerTopSections = await prisma.section.findMany({
        where: { container: { slug: { full: slug } }, type: SectionType.TEMPLATE_TOP },
        orderBy: { position: 'asc' },
    })

    const containerBottomSections = await prisma.section.findMany({
        where: { container: { slug: { full: slug } }, type: SectionType.TEMPLATE_BOTTOM },
        orderBy: { position: 'asc' },
    })

    return [...containerTopSections, ...pageSections, ...contentSections, ...containerBottomSections]
}

const Content = async ({ params }: { params: { slug: string } }) => {
    const sections = await getSections(Array.isArray(params.slug) ? params.slug.join('/') : params.slug)

    if (sections === null) notFound()

    return (
        <>
            {sections.map((section) => (
                <DisplaySection key={section.id} section={section} />
            ))}
        </>
    )
}

export const revalidate = 'force-cache'
export default Content

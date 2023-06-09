import { prisma } from '~/utilities/prisma'
import { notFound } from 'next/navigation'
import { SectionType } from '@prisma/client'
import DisplaySection from '~/components/DisplaySection'

// export async function generateMetadata({ params }: { params: { slug: string } }) {
//     const page = await getProps(Array.isArray(params.slug) ? params.slug.join('/') : params.slug)

//     return {
//         title: page?.name,
//     }
// }

const getSections = async (slug: string) => {
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

    if (!sections.length) notFound()

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

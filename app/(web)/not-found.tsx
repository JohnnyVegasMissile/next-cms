import { PageType, SectionType } from '@prisma/client'
import DefaultSection from '~/components/DefaultSection'
import DisplaySection from '~/components/DisplaySection'
import { prisma } from '~/utilities/prisma'

const getProps = async () => {
    const sections = await prisma.section.findMany({
        where: { page: { type: PageType.NOTFOUND }, type: SectionType.PAGE },
        orderBy: { position: 'asc' },
    })

    return sections
}

const NotFound = async () => {
    const sections = await getProps()

    if (!sections.length) return <DefaultSection.NotFound />

    return (
        <>
            {sections.map((section) => (
                <DisplaySection key={section.id} section={section} />
            ))}
        </>
    )
}

export const revalidate = 'force-cache'

export default NotFound

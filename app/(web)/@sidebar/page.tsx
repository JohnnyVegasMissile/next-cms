import { PageType, SectionType } from '@prisma/client'
import { Suspense } from 'react'
import DisplaySection from '~/components/DisplaySection'
import { prisma } from '~/utilities/prisma'

const getProps = async () => {
    const sections = await prisma.section.findMany({
        where: { page: { type: PageType.HOMEPAGE }, type: SectionType.PAGE_SIDEBAR },
        include: {
            linkedData: {
                include: {
                    media: true,
                    form: { include: { fields: true } },
                    link: true,
                },
            },
        },
        orderBy: { position: 'asc' },
    })

    return sections
}

const HomeSidebar = async () => {
    const sections = await getProps()

    return (
        <>
            {sections.map((section) => (
                <Suspense key={section.id}>
                    <DisplaySection section={section} />
                </Suspense>
            ))}
        </>
    )
}

export const revalidate = 'force-cache'

export default HomeSidebar

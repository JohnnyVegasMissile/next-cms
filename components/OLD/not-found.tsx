import { PageType, SectionType } from '@prisma/client'
import { Suspense } from 'react'
import DefaultSection from '~/components/DefaultSection'
import DisplaySection from '~/components/DisplaySection'
import { prisma } from '~/utilities/prisma'

const getProps = async () => {
    const sections = await prisma.section.findMany({
        where: { page: { type: PageType.NOTFOUND }, type: SectionType.PAGE },
        include: {
            linkedData: {
                include: {
                    media: true,
                    form: { include: { fields: true } },
                    link: true,
                    menu: {
                        include: {
                            childs: {
                                include: {
                                    childs: {
                                        include: {
                                            childs: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
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
                <Suspense key={section.id}>
                    <DisplaySection section={section} />
                </Suspense>
            ))}
        </>
    )
}

export const revalidate = Infinity

export default NotFound

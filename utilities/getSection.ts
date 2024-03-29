import { Form, FormField, Link, Media, Menu, MenuChild, Prisma, Section } from '@prisma/client'
import { ObjectId } from '~/types'
import { prisma } from './prisma'

export type SectionResponse = Section & {
    linkedData: {
        media: Media | null
        form:
            | (Form & {
                  fields: (FormField & {
                      container: {
                          id: ObjectId
                          name: string
                          contents: { id: ObjectId; name: string }[]
                      } | null
                  })[]
              })
            | null
        link: Link | null
        menu: (Menu & { childs: MenuChild & { childs: MenuChild & { childs: MenuChild[] } }[] }) | null
    }[]
}

const getSection = async (where: Prisma.SectionWhereInput | undefined): Promise<SectionResponse[]> => {
    const sections = await prisma.section.findMany({
        where,
        include: {
            linkedData: {
                include: {
                    media: true,
                    form: {
                        include: {
                            fields: {
                                include: {
                                    container: {
                                        select: {
                                            id: true,
                                            name: true,
                                            contents: {
                                                where: { published: true },
                                                select: { id: true, name: true },
                                            },
                                        },
                                    },
                                },
                                orderBy: [{ position: 'asc' }, { line: 'asc' }],
                            },
                        },
                    },
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

    return sections as SectionResponse[]
}

export default getSection

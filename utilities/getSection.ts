import { Form, FormField, Link, Media, Prisma, Section } from '@prisma/client'
import { ObjectId } from '~/types'
import { prisma } from './prisma'

export type SectionResponse = Section & {
    medias: {
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
    }[]
}

const getSection = async (where: Prisma.SectionWhereInput | undefined): Promise<SectionResponse[]> =>
    await prisma.section.findMany({
        where,
        include: {
            medias: {
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
                                orderBy: [{ position: 'desc' }, { line: 'desc' }],
                            },
                        },
                    },
                    link: true,
                },
            },
        },
        orderBy: { position: 'asc' },
    })

export default getSection

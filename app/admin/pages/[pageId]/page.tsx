import { Link, LinkType, Metadata, MetadataValue, Page, PageType, Slug, Media } from '@prisma/client'
import { Metadata as NextMetadata } from 'next'
import { LinkValue } from '~/components/LinkSelect'
import { notFound } from 'next/navigation'
import PageCreation from '~/types/pageCreation'
import { prisma } from '~/utilities/prisma'
import { ObjectId } from '~/types'
import Form from './Form'

export const generateMetadata = async ({ params }: any): Promise<NextMetadata> => ({
    title: `${params.pageId === 'create' ? 'Create' : 'Edit'} page`,
})

const initialValues: PageCreation = {
    name: '',
    published: true,
    slug: [''],
    metadatas: [],
    type: PageType.PAGE,
}

type PageRes = Page & {
    slug: Slug | null
    metadatas: (Metadata & { values: (MetadataValue & { link: Link; media: Media })[] })[]
}

const linkToLinkValue = (link: Link): LinkValue => {
    if (link.type === LinkType.IN) {
        return {
            type: link.type,
            slugId: link.slugId as ObjectId,
        }
    } else {
        return {
            type: link.type,
            link: link.link!,
            prototol: link.prototol!,
        }
    }
}

const pageToPageCreation = (page: PageRes | null): PageCreation => ({
    name: page?.name || '',
    type: page?.type || PageType.PAGE,
    published: !!page?.published,
    slug: page?.slug?.basic.split('/') || [''],
    metadatas:
        page?.metadatas?.map((metadata) => ({
            id: metadata.id,
            types: metadata.types,
            values: metadata.values.map(
                (e) =>
                    (e.string === null ? undefined : e.string) ||
                    (e.number === null ? undefined : e.number) ||
                    (e.boolean === null ? undefined : e.boolean) ||
                    (e.link === null ? undefined : linkToLinkValue(e.link)) ||
                    (e.mediaId === null ? undefined : e.media) ||
                    ''
            ),
        })) || [],
})

const getPage = async (pageId: string) => {
    if (pageId === 'create') return { isUpdate: false }

    const page = await prisma.page.findUnique({
        where: { id: pageId },
        include: {
            slug: true,
            metadatas: {
                include: {
                    values: {
                        include: { link: true, media: true },
                        orderBy: { createdAt: 'asc' },
                    },
                },
            },
        },
    })

    if (!page) return { isUpdate: true }

    return {
        isUpdate: true,
        page: pageToPageCreation(page as PageRes),
        type: page.type,
    }
}

const CreatePage = async ({ params }: any) => {
    const { isUpdate, page, type } = await getPage(params.pageId)

    if (!page && isUpdate) notFound()

    return <Form pageId={params.pageId} isUpdate={isUpdate} page={page || initialValues} type={type} />
}

export const dynamic = 'force-dynamic'

export default CreatePage

import {
    Link,
    LinkType,
    Metadata,
    MetadataValue,
    Page,
    PageType,
    Slug,
    Media,
    SettingType,
    CodeLanguage,
} from '@prisma/client'
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
    metadatas: {
        ALL: [] as any[],
    },
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

const pageToPageCreation = (page: PageRes | null): PageCreation => {
    const metadatas: PageCreation['metadatas'] = {}

    page?.metadatas?.forEach((metadata) => {
        const key: CodeLanguage | 'ALL' = !!metadata.language ? metadata.language : 'ALL'

        const previous = metadatas[key] || []

        previous.push({
            id: metadata.id,
            types: metadata.types,
            values: metadata.values.map(
                (e) =>
                    (e.string === null ? undefined : e.string) ||
                    (e.number === null ? undefined : e.number) ||
                    (e.boolean === null ? undefined : e.boolean) ||
                    (e.link === null ? undefined : linkToLinkValue(e.link)) ||
                    (e.mediaId === null ? undefined : e.media) ||
                    undefined
            ),
        })

        metadatas[key] = previous
    })

    return {
        name: page?.name || '',
        type: page?.type || PageType.PAGE,
        published: !!page?.published,
        slug: page?.slug?.basic.split('/') || [''],
        metadatas,
    }
}

const getPage = async (pageId: string) => {
    const preferred = await prisma.setting.findFirst({
        where: { type: SettingType.LANGUAGE_PREFERRED },
    })

    const locales = await prisma.setting.findFirst({
        where: { type: SettingType.LANGUAGE_LOCALES },
    })

    if (pageId === 'create')
        return {
            isUpdate: false,
            locales: locales?.value.split(', ') as CodeLanguage[],
            preferred: preferred?.value as CodeLanguage,
        }

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

    if (!page)
        return {
            isUpdate: true,
            locales: locales?.value.split(', ') as CodeLanguage[],
            preferred: preferred?.value as CodeLanguage,
        }

    return {
        isUpdate: true,
        page: pageToPageCreation(page as PageRes),
        type: page.type,
        locales: locales?.value.split(', ') as CodeLanguage[],
        preferred: preferred?.value as CodeLanguage,
    }
}

const CreatePage = async ({ params }: any) => {
    const { isUpdate, page, type, locales, preferred } = await getPage(params.pageId)

    if (!page && isUpdate) notFound()

    return (
        <Form
            pageId={params.pageId}
            isUpdate={isUpdate}
            page={page || initialValues}
            type={type}
            locales={locales}
            preferred={preferred}
        />
    )
}

export const dynamic = 'force-dynamic'

export default CreatePage

import { Metadata, Page, Slug } from '@prisma/client'
import { notFound } from 'next/navigation'
import PageCreation from '~/types/pageCreation'
import { prisma } from '~/utilities/prisma'
import Form from './Form'

const initialValues: PageCreation = {
    name: '',
    published: true,
    slug: [''],
    metadatas: [],
}

const pageToPageCreation = (
    page:
        | (Page & {
              slug: Slug | null
              metadatas: Metadata[]
          })
        | null
): PageCreation => {
    return {
        name: page?.name || '',
        published: !!page?.published,
        slug: page?.slug?.basic.split('/') || [''],
        metadatas:
            page?.metadatas?.map((metadata) => ({
                id: metadata.id,
                name: metadata.name,
                content: metadata.name === 'keywords' ? metadata.content.split(', ') : metadata.content,
            })) || [],
    }
}

const getPage = async (pageId: string) => {
    if (pageId === 'create') return { isUpdate: false }

    const page = await prisma.page.findUnique({
        where: { id: pageId },
        include: { slug: true, metadatas: true },
    })

    if (!page) return { isUpdate: true }

    return {
        isUpdate: true,
        page: pageToPageCreation(page),
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

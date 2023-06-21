import { notFound } from 'next/navigation'
import { prisma } from '~/utilities/prisma'
import Form, { FullContainer } from './Form'

const initialValues: FullContainer = {
    name: '',
    published: true,
    slug: null,
    metadatas: [],
    contentsMetadatas: [],
    fields: [],
}

const getContainer = async (containerId: string) => {
    if (containerId === 'create') return { isUpdate: false }

    const container = (await prisma.container.findUnique({
        where: { id: containerId },
        include: { slug: true, fields: true, metadatas: true, contentsMetadatas: true },
    })) as FullContainer | null

    if (!container) return { isUpdate: true }

    return {
        isUpdate: true,
        container,
    }
}

const CreateContainer = async ({ params }: any) => {
    const { isUpdate, container } = await getContainer(params.containerId)

    if (!container && isUpdate) notFound()

    return (
        <Form containerId={params.containerId} isUpdate={isUpdate} container={container || initialValues} />
    )
}

export default CreateContainer

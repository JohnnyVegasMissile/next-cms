import { RightType, Role } from '@prisma/client'
import { notFound } from 'next/navigation'
import { prisma } from '~/utilities/prisma'
import Form from './Form'

const initialValues = {
    name: '',
    limitUpload: null,
    rights: [
        RightType.VIEW_ALL_PAGE,
        RightType.VIEW_ALL_CONTAINER,
        RightType.VIEW_ALL_CONTENT,
        RightType.VIEW_ALL_MEDIA,
        RightType.VIEW_ALL_FORM,
        RightType.VIEW_MESSAGE,
        RightType.VIEW_USER,
        RightType.VIEW_ALL_ROLE,
        RightType.VIEW_LAYOUT,
        RightType.VIEW_SETTING,
        RightType.REVALIDATE,
    ],
} as Role

const getRole = async (roleId: string) => {
    if (roleId === 'create') return { isUpdate: false }

    const role = await prisma.role.findUnique({ where: { id: roleId } })

    if (!role) return { isUpdate: true }

    return {
        isUpdate: true,
        role,
    }
}

const CreateRole = async ({ params }: any) => {
    const { isUpdate, role } = await getRole(params.roleId)

    if (!role && isUpdate) notFound()

    return <Form roleId={params.roleId} isUpdate={isUpdate} role={role || initialValues} />
}

export const dynamic = 'force-dynamic'

export default CreateRole

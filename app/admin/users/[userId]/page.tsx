import { User } from '@prisma/client'
import { notFound } from 'next/navigation'
import UserCreation from '~/types/userCreation'
import { prisma } from '~/utilities/prisma'
import Form from './Form'

const initialValues = {
    name: '',
    role: undefined,
    email: '',
    password: '',
} as any

const userToUserCreation = (
    user: User & {
        login: {
            roleId: string | null
            email: string
        } | null
    }
): UserCreation => {
    return {
        name: user.name || '',
        role: user.login?.roleId || '',
        email: user.login?.email || '',
        password: '',
    }
}

const getUser = async (userId: string) => {
    if (userId === 'create') return { isUpdate: false }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            login: { select: { email: true, roleId: true } },
        },
    })

    if (!user) return { isUpdate: true }

    return {
        isUpdate: true,
        user: userToUserCreation(user),
    }
}

const CreateUser = async ({ params }: any) => {
    const { isUpdate, user } = await getUser(params.userId)

    if (!user && isUpdate) notFound()

    return <Form userId={params.userId} isUpdate={isUpdate} user={user || initialValues} />
}

export const dynamic = 'force-dynamic'

export default CreateUser

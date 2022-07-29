import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import type { Login, Role } from '@prisma/client'

import { prisma } from '../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const defaultContainer = await prisma.container.findUnique({
        where: { id: 'page' },
    })

    if (!defaultContainer) {
        await prisma.container.create({
            data: {
                id: 'page',
                title: 'Default Page',
                slug: '',
                contentHasSections: false,
                published: true,
            },
        })
    }

    const home = await prisma.content.findUnique({
        where: { id: 'home' },
    })

    if (!home) {
        await prisma.content.create({
            data: {
                id: 'home',
                title: 'Home',
                slug: '',
                containerId: 'page',
                published: true,
            },
        })
    }

    const notfound = await prisma.content.findUnique({
        where: { id: 'notfound' },
    })

    if (!notfound) {
        await prisma.content.create({
            data: {
                id: 'notfound',
                title: 'Not Found',
                slug: 'not-found',
                containerId: 'page',
                published: true,
            },
        })
    }

    const signin = await prisma.content.findUnique({
        where: { id: 'signin' },
    })

    if (!signin) {
        await prisma.content.create({
            data: {
                id: 'signin',
                title: 'Sign In',
                slug: 'signin',
                containerId: 'page',
                published: true,
            },
        })
    }

    const superAdminType: Role[] = await prisma.role.findMany({
        where: { id: 'super-admin' },
    })

    if (!superAdminType.length) {
        await prisma.role.create({
            data: {
                id: 'super-admin',
                name: 'Super Admin',
            },
        })
    }

    const adminType: Role[] = await prisma.role.findMany({
        where: { id: 'admin' },
    })

    if (!adminType.length) {
        await prisma.role.create({
            data: {
                id: 'admin',
                name: 'Admin',
            },
        })
    }

    const userType: Role[] = await prisma.role.findMany({
        where: { id: 'user' },
    })

    if (!userType.length) {
        await prisma.role.create({
            data: {
                id: 'user',
                name: 'User',
            },
        })
    }

    const admins: Login[] = await prisma.login.findMany({
        where: { roleId: 'super-admin' },
    })

    if (!admins.length) {
        const hash = await bcrypt.hash('root', 10)

        await prisma.user.create({
            data: {
                name: 'root',
                login: {
                    create: {
                        roleId: 'super-admin',
                        email: 'root',
                        password: hash,
                    },
                },
            },
        })
    }

    const revalidate = await prisma.setting.findUnique({
        where: { name: 'revalidate' },
    })

    if (!revalidate) {
        await prisma.setting.create({
            data: {
                name: 'revalidate',
                value: '86400',
            },
        })
    }

    await prisma.setting.upsert({
        where: {
            name: 'installed',
        },
        update: {
            value: 'true',
        },
        create: {
            name: 'installed',
            value: 'true',
        },
    })

    return res.status(200).json({ message: 'all set up' })
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const init = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET': {
            return await GET(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default init

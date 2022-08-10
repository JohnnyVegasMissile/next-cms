import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import type { Login, Role } from '@prisma/client'

import { prisma } from '../../utils/prisma'
import get from 'lodash.get'
import checkAuth from '@utils/checkAuth'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const defaultContainer = await prisma.container.findUnique({
        where: { id: 'page' },
        include: { slug: true },
    })

    let parentId = get(defaultContainer, 'slug.0.id', undefined)

    if (!defaultContainer) {
        const newDefaultContainer = await prisma.container.create({
            data: {
                id: 'page',
                title: 'Default Page',
                contentHasSections: false,
                published: true,
                slug: {
                    create: {
                        fullSlug: '',
                        slug: '',
                    },
                },
            },
            include: { slug: true },
        })

        parentId = get(newDefaultContainer, 'slug.0.id', undefined)
    }

    const notfound = await prisma.content.findUnique({
        where: { id: 'notfound' },
    })

    if (!notfound) {
        await prisma.content.create({
            data: {
                id: 'notfound',
                title: 'Not Found',
                containerId: 'page',
                published: true,
                slug: {
                    create: {
                        fullSlug: 'not-found',
                        slug: 'not-found',
                        parentId,
                    },
                },
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
                containerId: 'page',
                published: true,
                slug: {
                    create: {
                        fullSlug: 'sign-in',
                        slug: 'sign-in',
                        parentId,
                    },
                },
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

    const appname = await prisma.setting.findUnique({
        where: { name: 'app_name' },
    })

    if (!appname) {
        await prisma.setting.create({
            data: {
                name: 'app_name',
                value: '',
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

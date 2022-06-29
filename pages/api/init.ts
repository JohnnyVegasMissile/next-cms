import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import type { Page, Login, Setting } from '@prisma/client'

import { prisma } from '../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const homes: Page[] = await prisma.page.findMany({
        where: { type: 'home' },
    })

    if (!homes.length) {
        await prisma.page.create({
            data: {
                type: 'home',
                title: 'Home',
                slug: '',
            },
        })
    }

    const errors: Page[] = await prisma.page.findMany({
        where: { type: 'error' },
    })

    if (!errors.length) {
        await prisma.page.create({
            data: {
                type: 'error',
                title: 'Not Found',
                slug: 'not-found',
            },
        })
    }

    const admins: Login[] = await prisma.login.findMany({
        where: { type: 'super-admin' },
    })

    if (!admins.length) {
        const hash = await bcrypt.hash('root', 10)

        await prisma.user.create({
            data: {
                name: 'root',
                login: {
                    create: {
                        type: 'super-admin',
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
                value: '60',
            },
        })
    }

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

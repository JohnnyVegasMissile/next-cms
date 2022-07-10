import type { NextApiRequest, NextApiResponse } from 'next'
import type { User } from '@prisma/client'
// import get from 'lodash.get'
import bcrypt from 'bcryptjs'

import { prisma } from '../../../utils/prisma'
import { UserRoleTypes } from '../../../types'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const typeId = req.query.typeId as string | undefined
    const q = req.query.q as string | undefined

    let search: any = { where: {} }

    if (!!typeId) {
        if (typeId === 'admin' || typeId === 'super-admin') {
            search.where.login = {
                OR: [{ typeId: 'admin' }, { typeId: 'super-admin' }],
            }
        } else {
            search.where.login = {
                typeId,
            }
        }
    }

    if (!!q) {
        const sliptedQ = q.split(' ')

        if (sliptedQ.length === 1) {
            search.where.name = {
                contains: q,
            }
        } else {
            let OR = sliptedQ.map((word) => ({
                name: {
                    contains: word,
                },
            }))

            search.where.OR = OR
        }
    }

    const users: User[] = await prisma.user.findMany({
        ...search,
        include: {
            login: {
                select: {
                    type: true,
                    email: true,
                },
            },
        },
    })

    return res.status(200).json(users)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const { type, name, email, password } = req.body

    const hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            login: {
                create: {
                    type,
                    email,
                    password: hash,
                },
            },
        },
        include: { login: true },
    })

    return res.status(200).json({ ...user, type: user.login?.typeId, login: undefined })
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const users = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET': {
            return await GET(req, res)
        }

        case 'POST': {
            return await POST(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default users

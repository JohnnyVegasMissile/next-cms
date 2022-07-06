import type { NextApiRequest, NextApiResponse } from 'next'
// import type { User, Login } from '@prisma/client'
// import get from 'lodash.get'
import bcrypt from 'bcryptjs'
// import { LoginOutlined } from '@ant-design/icons'

import { prisma } from '../../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const user = await prisma.user.findUnique({
        where: { id },
        // include: { login: true },
        include: {
            login: {
                select: {
                    type: true,
                    email: true,
                },
            },
        },
    })

    return res.status(200).json({
        ...user,
    })
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const { type, name, password } = req.body

    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            name,
        },
    })

    let hash = undefined
    if (password) {
        hash = await bcrypt.hash(password, 10)
    }

    const updatedLogin = await prisma.login.update({
        where: { userId: id },
        data: {
            password: hash,
            type,
        },
    })

    return res.status(200).json({ ...updatedUser, type: updatedLogin.type })
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    await prisma.login.delete({
        where: { userId: id },
    })

    await prisma.user.delete({
        where: { id },
    })

    return res.status(200).json('User deleted')
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const pages = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET': {
            return await GET(req, res)
        }

        case 'PUT': {
            return await PUT(req, res)
        }

        case 'DELETE': {
            return await DELETE(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default pages

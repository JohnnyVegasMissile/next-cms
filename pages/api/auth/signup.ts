import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import type { Login, /* Session,*/ User } from '@prisma/client'

import { isEmail, initSession } from '../../../utils'

const prisma = new PrismaClient()

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { email, password, name } = req.body

        if (!isEmail(email)) {
            throw new Error('Email must be a valid email address.')
        }

        if (typeof password !== 'string') {
            throw new Error('Password must be a string.')
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                login: {
                    create: {
                        email,
                        password: hash,
                    },
                },
            },
            include: { login: true },
        })

        if (!user.login) {
            throw new Error('Email already exist.')
        }

        const session = await initSession(user.login.id)

        return res.status(201).json({
            title: 'Login Successful',
            detail: 'Successfully validated login credentials',
            token: session.token,
            expiresAt: session.expiresAt,
            // type: login.type,
            user: { ...user, type: user.login.type, login: null },
        })
    } catch (err) {
        res.status(400).json({ errors: err })
    }
    //
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const pages = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST': {
            return await POST(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default pages

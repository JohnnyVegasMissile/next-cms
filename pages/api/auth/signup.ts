import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

import { isEmail, initSession } from '../../../utils'
import { prisma } from '../../../utils/prisma'

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { email, password, name } = req.body

        if (!isEmail(email) && typeof email !== 'string') {
            throw new Error('Email must be a valid email address.')
        }

        if (typeof password !== 'string') {
            throw new Error('Password must be a string.')
        }

        if (typeof name !== 'string') {
            throw new Error('Name must be a string.')
        }

        const hash = await bcrypt.hash(password, 10)

        const login = await prisma.login.create({
            data: {
                email: email as string,
                password: hash as string,
                user: {
                    create: {
                        name: name as string,
                    },
                },
            },
            include: { user: true },
        })

        if (!login) {
            throw new Error('Email already exist.')
        }

        const session = await initSession(login.id)

        return res.status(201).json({
            title: 'Login Successful',
            detail: 'Successfully validated login credentials',
            token: session.token,
            expiresAt: session.expiresAt,
            user: { ...login.user, role: login.roleId, email: login.email },
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

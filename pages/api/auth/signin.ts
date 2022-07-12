import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
// import type { Login, Session, User } from '@prisma/client'

import { initSession } from '../../../utils'
import { prisma } from '../../../utils/prisma'

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { email, password } = req.body
        if (!email /* || !isEmail(email)*/) {
            return res.status(400).json({
                errors: [
                    {
                        title: 'Bad Request',
                        detail: 'Email must be a valid email address',
                    },
                ],
            })
        }

        if (typeof password !== 'string') {
            return res.status(400).json({
                errors: [
                    {
                        title: 'Bad Request',
                        detail: 'Password must be a string',
                    },
                ],
            })
        }

        const login = await prisma.login.findUnique({
            where: { email },
            include: { user: true },
        })

        if (!login) {
            throw new Error('No login found')
        }

        const passwordValidated = await bcrypt.compare(password, login.password)
        if (!passwordValidated) {
            throw new Error('Wrong password')
        }

        const session = await initSession(login.id)

        // const user = await prisma.login.findUnique({
        //     where: { id: login.userId },
        // })

        return res.status(201).json({
            title: 'Login Successful',
            detail: 'Successfully validated login credentials',
            token: session.token,
            expiresAt: session.expiresAt,
            user: { ...login.user, role: login.roleId, email: login.email },
        })
    } catch (err) {
        res.status(401).json({ errors: err })
    }
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

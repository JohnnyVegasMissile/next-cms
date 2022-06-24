import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import type { Login, Session, User } from '@prisma/client'

import { isEmail, initSession } from '../../../utils'

const prisma = new PrismaClient()

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        console.log(1)
        const { email, password } = req.body
        if (!isEmail(email)) {
            return res.status(400).json({
                errors: [
                    {
                        title: 'Bad Request',
                        detail: 'Email must be a valid email address',
                    },
                ],
            })
        }

        console.log(2)
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
        console.log(2.5, email)

        const login = await prisma.login.findUnique({ where: { email } })
        console.log(3, login)
        if (!login) {
            throw new Error('No login found')
        }

        console.log(4)
        const passwordValidated = await bcrypt.compare(password, login.password)
        if (!passwordValidated) {
            throw new Error('Wrong password')
        }

        console.log(5)
        const session = await initSession(login.id)

        console.log(6)
        const user = await prisma.login.findUnique({
            where: { id: login.userId },
        })

        console.log(7)
        return res.status(201).json({
            title: 'Login Successful',
            detail: 'Successfully validated login credentials',
            token: session.token,
            expiresAt: session.expiresAt,
            type: login.type,
            user,
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

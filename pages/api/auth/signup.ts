import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import type { Login, /* Session,*/ User } from '@prisma/client'

import { isEmail, initSession } from '../../../utils'

const prisma = new PrismaClient()

interface FullUser extends User {
    login: Login
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        console.log(1)
        const { email, password, name } = req.body

        if (!isEmail(email)) {
            throw new Error('Email must be a valid email address.')
        }

        if (typeof password !== 'string') {
            throw new Error('Password must be a string.')
        }

        console.log(2)
        const hash = await bcrypt.hash(password, 10)

        console.log(3, hash)

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

        // const login = prisma.login.findUnique({ where: { userId: user.id } })

        console.log('user', user.login)
        if (!user.login) {
            throw new Error('Email already exist.')
        }

        const session = await initSession(user.login.id)

        // const login = prisma.login.create({
        //     data: {
        //         userId: user.id,
        //     },
        // })

        // const page: Page = await prisma.page.create({
        //     data: { ...newPageContent, metadatas: { create: metadatas } },
        // })

        // const user = new Users()
        // const newUser = await user.save()
        // const copyUser = newUser.toJSON()

        // console.log('6')
        // let params = {
        //     e_mail,
        //     password: hash,
        //     user_id: newUser._id,
        //     validation_hash,
        //     validated: false,
        // }

        // const login = new Login(params)

        // const persistedLogin = await login.save()
        // const login_id = persistedLogin._id

        // const session = await initSession(login_id)

        return res.status(201).json({
            title: 'Login Successful',
            detail: 'Successfully validated login credentials',
            token: session.token,
            expiresAt: session.expiresAt,
            type: user.login.type,
            user,
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

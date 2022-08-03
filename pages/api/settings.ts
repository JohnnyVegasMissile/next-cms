import checkAuth from '@utils/checkAuth'
import type { NextApiRequest, NextApiResponse } from 'next'
// import get from 'lodash.get'

import { prisma } from '../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const settings = await prisma.setting.findMany()
    return res.status(200).json(settings)
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, value } = req.body

    const updatedSetting = await prisma.setting.update({
        where: { name },
        data: {
            value,
        },
    })

    return res.status(200).json(updatedSetting)
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const users = async (req: NextApiRequest, res: NextApiResponse) => {
    const isAuth = await checkAuth(req.headers)

    if (!isAuth) {
        return res.status(403).json({ error: 'Forbidden' })
    }

    switch (req.method) {
        case 'GET': {
            return await GET(req, res)
        }

        case 'PUT': {
            return await PUT(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default users

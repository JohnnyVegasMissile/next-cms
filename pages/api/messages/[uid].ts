import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../utils/prisma'

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const message = await prisma.message.update({ where: { id }, data: { read: true } })

    return res.status(200).json(message)
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const users = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'PUT': {
            return await PUT(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default users

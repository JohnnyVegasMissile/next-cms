import type { NextApiRequest, NextApiResponse } from 'next'
// import type { Page, Metadata, Section, Article } from '@prisma/client'
// import get from 'lodash.get'

import { prisma } from '../../../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const userType = await prisma.userType.findUnique({
        where: { id },
    })

    if (!userType) return res.status(500).json({ error: 'User type not found' })

    return res.status(200).json(userType)
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const article = await prisma.userType.update({
        where: { id },
        data: req.body,
    })

    return res.status(200).json(article)
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const userType = await prisma.userType.delete({ where: { id } })

    return res.status(200).json(userType)
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

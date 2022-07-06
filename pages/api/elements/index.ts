import type { NextApiRequest, NextApiResponse } from 'next'
// import type { Page, Metadata, Section, element } from '@prisma/client'
// import get from 'lodash.get'

import { prisma } from '../../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const element = await prisma.element.findMany()

    return res.status(200).json(element)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const element = await prisma.element.create({
        data: { ...req.body },
    })

    return res.status(200).json(element)
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const elements = async (req: NextApiRequest, res: NextApiResponse) => {
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

export default elements

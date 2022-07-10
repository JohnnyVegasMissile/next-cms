import type { NextApiRequest, NextApiResponse } from 'next'
// import type { Page, Metadata, Section, element } from '@prisma/client'
// import get from 'lodash.get'

import { prisma } from '../../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const type = req.query.type as string | undefined
    const q = req.query.q as string | undefined

    let search: any = { where: {} }

    if (!!type) {
        search.where.type = type
    }

    if (!!q) {
        const sliptedQ = q.split(' ')

        if (sliptedQ.length === 1) {
            search.where.title = {
                contains: q,
            }
        } else {
            let OR = sliptedQ.map((word) => ({
                title: {
                    contains: word,
                },
            }))

            search.where.OR = OR
        }
    }

    const element = await prisma.element.findMany(search)

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

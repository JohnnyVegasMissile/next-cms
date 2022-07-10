import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const q = req.query.q as string | undefined

    let search: any = { where: {} }

    if (!!q) {
        const sliptedQ = q.split(' ')

        if (sliptedQ.length === 1) {
            search.where.title = {
                contains: q,
            }
        } else {
            let OR = sliptedQ.map((word) => ({
                name: {
                    contains: word,
                },
            }))

            search.where.OR = OR
        }
    }

    const userTypes = await prisma.userType.findMany(search)

    return res.status(200).json(userTypes)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const userType = await prisma.userType.create({
        data: { ...req.body },
    })

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

        case 'POST': {
            return await POST(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default pages

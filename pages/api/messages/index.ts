import type { NextApiRequest, NextApiResponse } from 'next'
// import get from 'lodash.get'

import { prisma } from '../../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const formId = req.query.formId as string

    let search = {}

    if (!!formId) {
        search = {
            where: { formId },
        }
    }

    const messages = await prisma.message.findMany({
        ...search,
        include: { form: { include: { fields: true } } },
    })
    return res.status(200).json(messages)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const { formId, content } = req.body

    const message = await prisma.message.create({
        data: {
            formId: formId as string,
            value: content as string,
        },
    })

    return res.status(200).json(message)
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const users = async (req: NextApiRequest, res: NextApiResponse) => {
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

export default users

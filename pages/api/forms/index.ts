import { FormField, Prisma } from '@prisma/client'
import { FullFormEdit } from '../../../types'
import get from 'lodash.get'
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../utils/prisma'

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
                title: {
                    contains: word,
                },
            }))

            search.where.OR = OR
        }
    }

    const forms = await prisma.form.findMany({
        ...search,
        // include: { fields: true },
        // _count: { fields: true },
        include: {
            _count: {
                select: { fields: true },
            },
        },
    })

    return res.status(200).json(forms)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const newFormContent = req.body as FullFormEdit

    const fields: FormField[] = get(req, 'body.fields', [])
    delete newFormContent.fields

    const article = await prisma.form.create({
        data: {
            ...(newFormContent as Prisma.FormCreateInput),
            fields: { create: fields },
        },
    })

    return res.status(200).json(article)
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

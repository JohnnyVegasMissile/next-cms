// import { FullArticleEdit } from '../../../types'
import type { NextApiRequest, NextApiResponse } from 'next'
// import type { Page, Metadata, Section, Article } from '@prisma/client'
// import get from 'lodash.get'

import { prisma } from '../../../utils/prisma'
import { FormField, Prisma, Section } from '@prisma/client'
import get from 'lodash.get'
import { FullFormEdit } from '../../../types'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const form = await prisma.form.findUnique({
        where: { id },
        include: { fields: true },
    })

    if (!form) return res.status(404).json({ error: 'Form not found' })

    return res.status(200).json(form)
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string
    const newFormContent: FullFormEdit = req.body

    // delete existing sections
    await prisma.formField.deleteMany({
        where: { formId: id },
    })

    // create new sections
    const newFields: FormField[] = get(req, 'body.fields', [])
    delete newFormContent.fields

    for (const field of newFields) {
        await prisma.formField.create({
            data: {
                formId: id,
                name: field.name,
                type: field.type,
                label: field.label,
                placeholder: field.placeholder,
                required: true,
            },
        })
    }

    const form = await prisma.form.update({
        where: { id },
        data: newFormContent as Prisma.FormFieldCreateInput,
        include: { fields: true },
    })

    return res.status(200).json(form)
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const form = await prisma.form.delete({ where: { id } })

    return res.status(200).json(form)
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

// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '~/utilities/prisma'
import { PAGE_SIZE } from '~/utilities/constants'
import FormCreation from '~/types/formCreation'

export const GET = async (request: NextRequest) => {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')
    const page = searchParams.get('page')
    const sort = searchParams.get('sort')

    let skip = 0
    if (typeof page === 'string' && page !== '0' && page !== '1') {
        skip = (parseInt(page) - 1) * PAGE_SIZE
    }

    const where: any = {}
    let orderBy: any = {}

    if (!!q) where.name = { contains: q }
    if (!!sort) {
        const parsedSort = sort.split(',')

        if (parsedSort[0] === 'slug') {
            orderBy = { slug: { full: parsedSort[1] } }
        } else {
            orderBy = { [`${parsedSort[0]}`]: parsedSort[1] }
        }
    }

    const count = await prisma.form.count({ where })
    const forms = await prisma.form.findMany({
        where,
        orderBy,
        take: PAGE_SIZE,
        skip,
        include: {
            _count: {
                select: { fields: true },
            },
        },
    })

    return NextResponse.json({ results: forms, count })
}

export const POST = async (request: NextRequest) => {
    const { name, redirectMail, mailToRedirect, successMessage, errorMessage, extraData, fields } =
        (await request.json()) as FormCreation

    if (typeof name !== 'string') return NextResponse.json({ message: 'Name not valid' }, { status: 400 })

    if (!Array.isArray(fields)) return NextResponse.json({ message: 'Fields not valid.' }, { status: 400 })

    if (typeof redirectMail !== 'boolean')
        return NextResponse.json({ message: 'Published not valid' }, { status: 400 })

    const form = await prisma.form.create({
        data: {
            name,
            redirectMail,
            mailToRedirect,
            successMessage,
            errorMessage,
            extraData,
            fields: {
                createMany: {
                    data: fields.map((field) => ({ ...field })),
                },
            },
        },
    })

    return NextResponse.json(form, { status: 200 })
}

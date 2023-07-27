import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '~/utilities/prisma'
import { MetricName, PageType } from '@prisma/client'
import dayjs from 'dayjs'

export const GET = async (request: NextRequest) => {
    console.log('geo', request.geo)

    await prisma.role.findMany({
        include: {
            _count: {
                select: { logins: true },
            },
        },
    })

    await prisma.page.count({ where: { type: PageType.PAGE } })
    await prisma.container.count()
    await prisma.content.count()

    return NextResponse.json({})
}

export const POST = async (request: NextRequest) => {
    const { name, value, url } = (await request.json()) as {
        name: MetricName
        value: number
        url: string
    }

    const slug = await prisma.slug.findUnique({ where: { full: url.substring(1) } })

    if (!slug) {
        return NextResponse.json({ error: 'Slug not found' }, { status: 404 })
    }

    const today = dayjs().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0)

    const metric = await prisma.metric.findFirst({
        where: {
            name,
            day: { equals: today.toISOString() },
            slugId: slug.id,
        },
    })

    if (!metric) {
        await prisma.metric.create({
            data: {
                name,
                day: today.toISOString(),
                value: value,
                count: 1,
                slugId: slug.id,
            },
        })
    } else {
        await prisma.metric.update({
            where: { id: metric.id },
            data: {
                value: (metric.value * metric.count + value) / (metric.count + 1),
                count: metric.count + 1,
            },
        })
    }

    return NextResponse.json({})
}

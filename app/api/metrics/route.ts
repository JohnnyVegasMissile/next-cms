import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '~/utilities/prisma'
import { CodeLanguage, MetricName, PageType, SettingType } from '@prisma/client'
import dayjs from 'dayjs'
import languages from '~/utilities/languages'

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
    
    let newSlug = url.substring(1)
    let language: CodeLanguage | undefined = undefined
    const splitSlug = newSlug.split('/')
    const keys = Object.keys({ ...languages })

    if (!!splitSlug.length) {
        for (const key of keys) {
            if (splitSlug[0] === languages[key as CodeLanguage].code) {
                language = key as CodeLanguage
                break
            }
        }
    }

    if (!language) {
        language = (await prisma.setting.findUnique({ where: { type: SettingType.LANGUAGE_PREFERRED } }))?.value as CodeLanguage
    } else {
        splitSlug.shift()
        newSlug = splitSlug.join('/')
    }

    const slug = await prisma.slug.findUnique({ where: { full: newSlug } })

    if (!slug) return NextResponse.json({ error: 'Slug not found' }, { status: 404 })

    const today = dayjs().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0)

    const metric = await prisma.metric.findFirst({
        where: {
            name,
            language,
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
                language,
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

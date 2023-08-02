import { CodeLanguage, SettingType } from '@prisma/client'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/utilities/prisma'

export async function GET(request: NextRequest, context: any) {
    const { pageId } = context.params
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    let language = searchParams.get('language') as CodeLanguage | null

    let day = undefined

    if (!!from) {
        const gte = dayjs(from)
            .set('hour', 0)
            .set('minute', 0)
            .set('second', 0)
            .set('millisecond', 0)
            .toDate()

        day = { ...(day || {}), gte }
    }
    if (!!to) {
        const lte = dayjs(to).set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0).toDate()

        day = { ...(day || {}), lte }
    }

    if (!language) {
        language = (await prisma.setting.findUnique({ where: { type: SettingType.LANGUAGE_PREFERRED } }))?.value as CodeLanguage
    }

    const metrics = await prisma.metric.findMany({
        where: { slug: { pageId }, day, language },
        orderBy: { day: 'asc' },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json(metrics)
}

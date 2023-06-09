// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'
import { SettingType } from '@prisma/client'
import SettingsCreation from '~/types/settingsCreation'
import { prisma } from '~/utilities/prisma'
import { revalidatePath } from 'next/cache'

export const GET = async () => {
    const settings = await prisma.setting.findMany()

    return NextResponse.json(settings)
}

export async function PUT(request: Request) {
    const settings = (await request.json()) as SettingsCreation

    const newSettings = []
    for (const key of Object.keys(settings) as SettingType[]) {
        const updatedSetting = await prisma.setting.update({
            where: { type: key },
            data: {
                value: `${settings[key]}`,
            },
        })

        newSettings.push(updatedSetting)
    }

    const slugs = await prisma.slug.findMany()

    slugs.forEach(async (slug) => await revalidatePath(`/${slug.full}`))
    revalidatePath('/')
    revalidatePath('/sign-in')

    // NextResponse extends the Web Response API
    return NextResponse.json(newSettings)
}

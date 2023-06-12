// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'
import { SettingType } from '@prisma/client'
import SettingsCreation from '~/types/settingsCreation'
import { prisma } from '~/utilities/prisma'
import revalidateAllSlugs from '~/utilities/revalidateAllSlugs'

export const GET = async () => {
    const settings = await prisma.setting.findMany({
        where: { visible: true },
    })

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

    revalidateAllSlugs()

    return NextResponse.json(newSettings)
}

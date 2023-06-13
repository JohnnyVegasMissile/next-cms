import { SettingType } from '@prisma/client'
import { MetadataRoute } from 'next'
import { prisma } from '~/utilities/prisma'

const robots = async (): Promise<MetadataRoute.Robots> => {
    const INDEXED =
        (
            await prisma.setting.findUnique({
                where: { type: SettingType.INDEXED },
            })
        )?.value === 'false'

    const allow = INDEXED ? undefined : '/'
    const disallow = ['/admin/', '/api/']

    const url = await prisma.setting.findUnique({
        where: { type: SettingType.SITE_URL },
    })

    if (INDEXED) disallow.push('/')

    return {
        rules: {
            userAgent: '*',
            allow,
            disallow,
        },
        sitemap: `${url?.value}/sitemap.xml`,
    }
}

export default robots

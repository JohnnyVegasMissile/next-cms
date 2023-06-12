import { SettingType } from '@prisma/client'
import { MetadataRoute } from 'next'
import { prisma } from '~/utilities/prisma'

const robots = async (): Promise<MetadataRoute.Robots> => {
    const allow = true ? undefined : '/'
    const disallow = ['/admin/*', '/api/*']

    const url = await prisma.setting.findUnique({
        where: { type: SettingType.SITE_URL },
    })

    if (true) disallow.push('/')

    return {
        rules: {
            userAgent: '*',
            allow,
            disallow: true ? '/' : undefined,
        },
        sitemap: `${url?.value}/sitemap.xml`,
    }
}

export default robots

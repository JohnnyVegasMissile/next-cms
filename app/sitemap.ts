import { SettingType } from '@prisma/client'
import { MetadataRoute } from 'next'
import { prisma } from '~/utilities/prisma'

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
    const url = await prisma.setting.findUnique({
        where: { type: SettingType.SITE_URL },
    })

    const slugs = await prisma.slug.findMany({
        where: {
            OR: [
                { page: { published: true } },
                { container: { published: true } },
                { content: { published: true } },
            ],
        },
    })

    const defaults = [
        {
            url: `${url?.value}`,
            lastModified: new Date(),
        },
        {
            url: `${url?.value}/sign-in`,
            lastModified: new Date(),
        },
    ]

    return [
        ...defaults,
        ...slugs.map((slug) => ({
            url: `${url?.value}/${slug.full}`,
            lastModified: slug.revalidatedAt,
        })),
    ]
}

export default sitemap

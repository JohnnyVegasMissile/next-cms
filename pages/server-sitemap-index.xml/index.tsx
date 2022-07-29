// // pages/server-sitemap-index.xml/index.tsx
import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps } from 'next'

import { prisma } from '../../utils/prisma'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const containers = await prisma.container.findMany({
        where: {
            published: true,
        },
        include: { contents: true },
    })

    const paths = containers.map((container) => {
        const slug = container.slug

        let contentsSlugs: {
            loc: string
            lastmod: string
        }[] = []

        if (!!container.contents?.length) {
            contentsSlugs = container.contents
                ?.filter((content) => content.published && content.id !== 'notfound' && content.id !== 'home')
                ?.map((content) => ({
                    loc: `${process.env.SITE_URL}/${slug}/${content.slug}`,
                    lastmod: new Date().toISOString(),
                }))
        }

        return [
            {
                loc: `${process.env.SITE_URL}/${container.slug}`,
                lastmod: new Date().toISOString(),
            },
            ...contentsSlugs,
        ]
    })

    return getServerSideSitemap(ctx, paths.flat())
}

export default function Sitemap() {}

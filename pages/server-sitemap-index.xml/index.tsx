// // pages/server-sitemap-index.xml/index.tsx
import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps } from 'next'

import { prisma } from '../../utils/prisma'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const pages = await prisma.page.findMany({
        where: {
            published: true,
            OR: [{ type: 'page' }, { type: 'article' }],
        },
        include: { articles: true },
    })

    const paths = pages.map((page) => {
        const slug = page.slug

        let articlesSlugs: {
            loc: string
            lastmod: string
        }[] = []

        if (page.articles) {
            articlesSlugs = page.articles
                ?.filter((article) => article.published)
                ?.map((article) => ({
                    loc: `${process.env.SITE_URL}/${slug}/${article.slug}`,
                    lastmod: new Date().toISOString(),
                }))
        }

        return [
            {
                loc: `${process.env.SITE_URL}/${page.slug}`,
                lastmod: new Date().toISOString(),
            },
            ...articlesSlugs,
        ]
    })

    return getServerSideSitemap(ctx, paths.flat())
}

export default function Sitemap() {}

// // pages/server-sitemap-index.xml/index.tsx
import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps } from 'next'

import { prisma } from '../../utils/prisma'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const slugs = await prisma.slug.findMany({
        where: {
            published: true,
        },
    })

    const paths = slugs.map((slug) => ({
        loc: `${process.env.SITE_URL}/${slug.fullSlug}`,
        lastmod: new Date().toISOString(),
    }))

    return getServerSideSitemap(ctx, paths)
}

export default function Sitemap() {}

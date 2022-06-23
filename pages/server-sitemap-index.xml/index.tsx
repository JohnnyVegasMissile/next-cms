// // pages/server-sitemap-index.xml/index.tsx
import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import { PrismaClient } from '@prisma/client'
import type { Page } from '@prisma/client'

const prisma = new PrismaClient()

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const pages: Page[] = await prisma.page.findMany({
        where: {
            published: true,
            type: 'page',
        },
    })

    const paths = pages.map((page) => ({
        loc: `${process.env.SITE_URL}/${page.slug}`,
        lastmod: new Date().toISOString(),
    }))

    return getServerSideSitemap(ctx, paths)
}

export default function Sitemap() {}

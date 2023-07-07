import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Link, LinkType, SectionType, SettingType } from '@prisma/client'
import DisplaySection from '~/components/DisplaySection'
import { prisma } from '~/utilities/prisma'
import getSection from '~/utilities/getSection'
import {
    appLinks,
    appleWebApp,
    formatDetection,
    general,
    iTunes,
    icons,
    openGraph,
    twitter,
} from '~/components/MetadatasList/metadataLists'
import { LinkValue } from '~/components/LinkSelect'
import { ObjectId } from '~/types'

const getLangMetas = async (url: string) => {
    const locales =
        (
            await prisma.setting.findUnique({
                where: { type: SettingType.LANGUAGE_LOCALES },
            })
        )?.value.split(', ') || []

    const preferred = (
        await prisma.setting.findUnique({
            where: { type: SettingType.LANGUAGE_PREFERRED },
        })
    )?.value

    const sideUrl = (
        await prisma.setting.findUnique({
            where: { type: SettingType.SITE_URL },
        })
    )?.value!

    const canonical = `/${url}`
    const languages: any = {}

    for (const locale of locales) {
        if (locale !== preferred) {
            languages[locale.toLocaleLowerCase()!] = `/${locale}/${url}`
        }
    }

    const metadataBase = new URL(sideUrl)
    const alternates = {
        canonical,
        languages,
    }

    return {
        metadataBase,
        alternates,
    }
}

const linkToLinkValue = (link: Link): LinkValue => {
    if (link.type === LinkType.IN) {
        return {
            type: link.type,
            slugId: link.slugId as ObjectId,
        }
    } else {
        return {
            type: link.type,
            link: link.link!,
            prototol: link.prototol!,
        }
    }
}

export const generateMetadata = async ({ params }: { params: { slug: string } }) => {
    const full = Array.isArray(params.slug) ? params.slug.join('/') : params.slug

    const langMetas = await getLangMetas(full)

    const options = [
        ...general,
        ...formatDetection,
        ...openGraph,
        ...icons,
        ...twitter,
        ...iTunes,
        ...appleWebApp,
        ...appLinks,
    ]

    const page = await prisma.page.findFirst({
        where: { slug: { full } },
        include: { metadatas: { include: { values: { include: { link: true } } } } },
    })

    if (!!page) {
        let metadatas: any = {
            ...langMetas,
            openGraph: { title: page.name },
            twitter: { title: page.name },
            appleWebApp: { title: page.name },
        }

        page.metadatas.forEach((metadata) => {
            metadata.types.forEach((type) => {
                const opt = options.find((e) => e.value === type)

                if (!opt || !opt.toValue) return

                const cleanValues = metadata.values.map(
                    (e) =>
                        (e.string === null ? undefined : e.string) ||
                        (e.number === null ? undefined : e.number) ||
                        (e.boolean === null ? undefined : e.boolean) ||
                        (e.link === null ? undefined : linkToLinkValue(e.link)) ||
                        ''
                )

                metadatas = opt.toValue(cleanValues, metadatas)
            })
        })

        console.log('metadatas', metadatas)

        return metadatas
    }

    const content = await prisma.container.findFirst({
        where: { slug: { full } },
    })

    if (!!content)
        return {
            title: content.name,
            ...langMetas,
            openGraph: {
                title: content.name,
            },
        }

    const container = await prisma.container.findFirst({
        where: { slug: { full } },
    })

    if (!!container)
        return {
            title: container.name,
            ...langMetas,
            openGraph: {
                title: container.name,
            },
        }

    return {}

    //       openGraph: {
    //     title: 'Next.js',
    //     description: 'The React Framework for the Web',
    //     url: 'https://nextjs.org',
    //     siteName: 'Next.js',
    //     images: [
    //       {
    //         url: 'https://nextjs.org/og.png',
    //         width: 800,
    //         height: 600,
    //       },
    //       {
    //         url: 'https://nextjs.org/og-alt.png',
    //         width: 1800,
    //         height: 1600,
    //         alt: 'My custom alt',
    //       },
    //     ],
    //     locale: 'en_US',
    //     type: 'website',
    //   },
}

const getSections = async (slug: string) => {
    const exist = await prisma.slug.findFirst({
        where: { full: slug },
        include: {
            page: { select: { published: true } },
            container: { select: { published: true } },
            content: { select: { containerId: true, published: true } },
        },
    })

    if (!exist) return null

    if (!!exist.pageId && exist.page?.published) {
        const pageSections = await getSection({ pageId: exist.pageId, type: SectionType.PAGE })

        return pageSections
    } else if (!!exist.containerId && exist.container?.published) {
        const containerSections = await getSection({
            containerId: exist.containerId,
            type: SectionType.CONTAINER,
        })

        return containerSections
    } else if (!!exist.contentId && exist.content?.published) {
        const contentSections = await getSection({ contentId: exist.contentId, type: SectionType.CONTENT })
        const containerTopSections = await getSection({
            containerId: exist.content.containerId,
            type: SectionType.TEMPLATE_TOP,
        })
        const containerBottomSections = await getSection({
            containerId: exist.content.containerId,
            type: SectionType.TEMPLATE_BOTTOM,
        })

        return [...containerTopSections, ...contentSections, ...containerBottomSections]
    }

    return null
}

const Content = async ({ params }: { params: { slug: string } }) => {
    const sections = await getSections(Array.isArray(params.slug) ? params.slug.join('/') : params.slug)

    if (sections === null) notFound()

    return (
        <>
            {sections.map((section) => (
                <Suspense key={section.id}>
                    <DisplaySection section={section} />
                </Suspense>
            ))}
        </>
    )
}

export const revalidate = Infinity

export default Content

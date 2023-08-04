import { CodeLanguage, Link, LinkType, SettingType } from '@prisma/client'
import { prisma } from '~/utilities/prisma'
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
import languages from '~/utilities/languages'
import { ResolvingMetadata } from 'next'

const getLangMetas = async (url: string, lang: CodeLanguage | undefined) => {
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

    const siteUrl = (
        await prisma.setting.findUnique({
            where: { type: SettingType.SITE_URL },
        })
    )?.value!

    const canonical = `/${url}`
    const langs: any = {}

    for (const locale of locales) {
        if (locale !== preferred) {
            langs[languages[locale as CodeLanguage].code] = `/${
                languages[locale as CodeLanguage].code
            }/${url}`
        }
    }

    const metadataBase = new URL(siteUrl)
    const alternates = {
        canonical,
        languages: langs,
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

const generateMetadata = async (slug: string, lang?: CodeLanguage) => {
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

    let language = lang

    if (!language) {
        const preferred = await prisma.setting.findFirst({
            where: { type: SettingType.LANGUAGE_PREFERRED },
        })

        language = (preferred?.value as CodeLanguage) || CodeLanguage.EN
    }

    const langMetas = await getLangMetas(slug || '', language)

    const exist = await prisma.slug.findFirst({
        where: { full: slug || '' },
        include: {
            page: { select: { published: true, name: true } },
            container: { select: { published: true } },
            content: { select: { containerId: true, published: true } },
        },
    })

    if (!!exist?.pageId) {
        const pageMetadatas = await prisma.metadata.findMany({
            where: {
                OR: [
                    { pageId: exist?.pageId, language: null },
                    { pageId: exist?.pageId, language },
                ],
            },
            include: { values: { include: { link: true, media: true } } },
            orderBy: { language: { sort: 'asc', nulls: 'first' } },
        })

        let metadatas: any = {
            ...langMetas,
            openGraph: { title: exist?.page?.name },
            twitter: { title: exist?.page?.name },
            appleWebApp: { title: exist?.page?.name },
        }

        for (const metadata of pageMetadatas) {
            for (const type of metadata.types) {
                const opt = options.find((e) => e.value === type)

                if (!opt || !opt.toValue) return

                const cleanValues = metadata.values.map(
                    (e) =>
                        (e.string === null ? undefined : e.string) ||
                        (e.number === null ? undefined : e.number) ||
                        (e.boolean === null ? undefined : e.boolean) ||
                        (e.link === null ? undefined : linkToLinkValue(e.link)) ||
                        (e.media === null ? undefined : e.media)
                )

                metadatas = opt.toValue(cleanValues, metadatas)
            }
        }

        return metadatas
    }

    const content = await prisma.container.findFirst({
        where: { slug: { full: slug } },
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
        where: { slug: { full: slug } },
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
}

export default generateMetadata

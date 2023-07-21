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

const getLangMetas = async (url: string, lang: CodeLanguage) => {
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

    const langMetas = await getLangMetas(full, CodeLanguage.EN)

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
        include: { metadatas: { include: { values: { include: { link: true, media: true } } } } },
    })

    if (!!page) {
        let metadatas: any = {
            ...langMetas,
            openGraph: { title: page.name },
            twitter: { title: page.name },
            appleWebApp: { title: page.name },
        }

        for (const metadata of page.metadatas) {
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
}

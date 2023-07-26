import { CodeLanguage, PageType, SectionType, SettingType } from '@prisma/client'
import { RedirectType } from 'next/dist/client/components/redirect'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import DefaultSection from '~/components/DefaultSection'
import DisplaySection from '~/components/DisplaySection'
import getSection, { SectionResponse } from '~/utilities/getSection'
import { prisma } from '~/utilities/prisma'

const getProps = async (
    lang: CodeLanguage | undefined,
    slug: string[] | undefined,
    homepage: boolean,
    sidebar: boolean
): Promise<
    | { redirectUrl: string; sections?: undefined; exist?: undefined }
    | { sections: SectionResponse[]; redirectUrl?: undefined; exist: true }
    | { sections?: undefined; redirectUrl?: undefined; exist: false }
> => {
    const preferred = await prisma.setting.findFirst({
        where: { type: SettingType.LANGUAGE_PREFERRED },
    })

    if (!!slug && !!lang && preferred?.value === lang) {
        return { redirectUrl: `/${slug.join('/')}` }
    }

    const language = (lang || preferred?.value) as CodeLanguage

    if (homepage) {
        const sections = await getSection({ page: { type: PageType.HOMEPAGE }, language })

        return { exist: true, sections }
    }

    const exist = await prisma.slug.findFirst({
        where: { full: slug?.join('/') },
        include: {
            page: { select: { published: true } },
            container: { select: { published: true } },
            content: { select: { containerId: true, published: true } },
        },
    })

    if (!exist) return { exist: false }

    if (!!exist.pageId && exist.page?.published) {
        const pageSections = await getSection({
            pageId: exist.pageId,
            type: sidebar ? SectionType.PAGE_SIDEBAR : SectionType.PAGE,
            language,
        })

        return { exist: true, sections: pageSections }
    } else if (!!exist.containerId && exist.container?.published) {
        const containerSections = await getSection({
            containerId: exist.containerId,
            type: sidebar ? SectionType.CONTAINER_SIDEBAR : SectionType.CONTAINER,
            language,
        })

        return { exist: true, sections: containerSections }
    } else if (!!exist.contentId && exist.content?.published) {
        const contentSections = await getSection({
            contentId: exist.contentId,
            type: sidebar ? SectionType.CONTENT_SIDEBAR : SectionType.CONTENT,
            language,
        })
        const containerTopSections = await getSection({
            containerId: exist.content.containerId,
            type: sidebar ? SectionType.TEMPLATE_SIDEBAR_TOP : SectionType.TEMPLATE_TOP,
            language,
        })
        const containerBottomSections = await getSection({
            containerId: exist.content.containerId,
            type: sidebar ? SectionType.TEMPLATE_SIDEBAR_BOTTOM : SectionType.TEMPLATE_BOTTOM,
            language,
        })

        return {
            exist: true,
            sections: [...containerTopSections, ...contentSections, ...containerBottomSections],
        }
    }

    return { exist: false }
}

const OthersPage = async ({
    lang,
    slug,
    homepage,
    sidebar,
}: {
    lang?: CodeLanguage
    slug?: string[]
    homepage?: boolean
    sidebar?: boolean
}) => {
    const { sections, exist, redirectUrl } = await getProps(lang, slug, !!homepage, !!sidebar)

    if (!!redirectUrl) redirect(redirectUrl, RedirectType.replace)

    if (!exist) notFound()

    if (!sections?.length) return <DefaultSection.Homepage />

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

export default OthersPage

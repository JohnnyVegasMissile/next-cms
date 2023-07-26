import { CodeLanguage, SectionType, SettingType } from '@prisma/client'
import { notFound } from 'next/navigation'
import { prisma } from '~/utilities/prisma'
import Form from './Form'
import { Metadata } from 'next'
import getSection from '~/utilities/getSection'
import getSidebar from '~/utilities/getSidebar'

export const metadata: Metadata = {
    title: 'Edit page sections',
}

const getSections = async (pageId: string) => {
    const exist = await prisma.page.findUnique({ where: { id: pageId } })
    if (!exist) return null

    const content = await getSection({ pageId, type: SectionType.PAGE })
    const sidebar = await getSection({ pageId, type: SectionType.PAGE_SIDEBAR })

    return {
        content,
        sidebar,
    }
}

const getLanguage = async () => {
    const locales = await prisma.setting.findFirst({
        where: { type: SettingType.LANGUAGE_LOCALES },
    })

    const preferred = await prisma.setting.findFirst({
        where: { type: SettingType.LANGUAGE_PREFERRED },
    })

    return {
        locales: (locales?.value.split(', ') || [CodeLanguage.EN]) as CodeLanguage[],
        preferred: (preferred?.value || CodeLanguage.EN) as CodeLanguage,
    }
}

const EditPageSections = async ({ params }: any) => {
    const layout = await getSections(params.pageId)
    const sidebar = await getSidebar()
    const languages = await getLanguage()

    if (!layout) notFound()

    return <Form pageId={params.pageId} layout={layout} sidebar={sidebar} {...languages} />
}

export const dynamic = 'force-dynamic'

export default EditPageSections
